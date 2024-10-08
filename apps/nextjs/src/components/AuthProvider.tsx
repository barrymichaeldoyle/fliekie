"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

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
