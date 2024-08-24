"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <ClerkProvider
      signInFallbackRedirectUrl={pathname || "/"}
      signUpFallbackRedirectUrl={pathname || "/"}
      afterSignOutUrl={pathname || "/"}
      appearance={{ baseTheme: dark }}
    >
      {children}
    </ClerkProvider>
  );
}
