import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/ThemeProvider";

import { TopNav } from "./_components/layout/TopNav";
import { SideBar } from "./_components/layout/SideBar";

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
