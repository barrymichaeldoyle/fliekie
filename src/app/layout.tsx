import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PropsWithChildren } from "react";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "sonner";
import { Eye, Search, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fliekie",
  description: "Rate movies with your friends and plan your next movie night!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${GeistSans.variable} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <body className="flex flex-col">
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <TopNav />
            <div className="flex flex-1">
              <SideBar />
              {children}
            </div>
            <Toaster closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function TopNav() {
  return (
    <nav className="bg-card flex w-full items-center justify-between border-b p-4 px-6 text-xl font-semibold">
      <div>Fliekie</div>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

function SideBar() {
  return (
    <aside className="bg-card w-56 border-r p-4">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="text-md flex items-center gap-3 font-medium">
          <Search className="h-5 w-5" />
          Search
        </Link>
        <Link href="/" className="text-md flex items-center gap-3 font-medium">
          <Eye className="h-5 w-5" />
          Seen List
        </Link>
        <Link href="/" className="text-md flex items-center gap-3 font-medium">
          <Star className="h-5 w-5" />
          Watch List
        </Link>
      </nav>
    </aside>
  );
}
