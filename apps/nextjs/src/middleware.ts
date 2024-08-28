import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import Cidr from "ip-cidr";

const isProtectedRoute = createRouteMatcher([
  "/followers(.*)",
  "/following(.*)",
  "/ratings(.*)",
  "/watchlist(.*)",
]);

const isClerkWebhookRoute = createRouteMatcher(["/api/clerk-webhook(.*)"]);

let cachedIps: string[] = [];
let lastFetchTime = 0;
const IP_CACHE_DURATION = 60 * 60 * 1000;

interface WebhookIps {
  us?: string[];
  "us-east"?: string[];
  eu?: string[];
  in?: string[];
}

async function fetchAllowedIps(): Promise<string[]> {
  if (Date.now() - lastFetchTime < IP_CACHE_DURATION && cachedIps.length > 0) {
    return cachedIps;
  }

  try {
    const response = await fetch("https://docs.svix.com/webhook-ips.json");
    const data = (await response.json()) as WebhookIps;
    cachedIps = Object.values(data)
      .flat()
      .filter((ip): ip is string => typeof ip === "string");
    lastFetchTime = Date.now();
  } catch (error) {
    console.error("Failed to fetch allowed IPs", error);
  }

  return cachedIps;
}

function isIpAllowed(ip: string, allowedIps: string[]): boolean {
  return allowedIps.some((allowedIp) => {
    if (allowedIp.includes("/")) {
      const cidr = new Cidr(allowedIp);
      return cidr.contains(ip);
    }
    return ip === allowedIp;
  });
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  if (isClerkWebhookRoute(req)) {
    const allowedIps = await fetchAllowedIps();
    const ip = req.headers.get("x-forwarded-for") ?? req.ip;

    if (!ip || !isIpAllowed(ip, allowedIps)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
