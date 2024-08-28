import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type PropsWithChildren } from "react";
import { Toaster } from "sonner";

import "~/styles/globals.css";
import { AuthProvider } from "~/components/AuthProvider";
import { ThemeProvider } from "~/components/ThemeProvider";

import { SideBar } from "./_layout/SideBar";
import { TopNav } from "./_layout/TopNav";

export const metadata: Metadata = {
  title: "Fliekie - Movie Night",
  description: "Rate movies with your friends and plan your next movie night!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

console.log("Test");

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${GeistSans.variable}`}
        suppressHydrationWarning
      >
        <body>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <div className="flex h-full flex-col">
              <TopNav />
              <div className="flex min-h-0 flex-1">
                <SideBar />
                <div className="flex-1 overflow-auto">{children}</div>
              </div>
            </div>
            <Toaster closeButton />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
