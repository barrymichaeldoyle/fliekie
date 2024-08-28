import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Home,
  Info,
  type LucideProps,
  Plus,
  Star,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type NavItemProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href: string;
};

const unauthenicatedNavItems: NavItemProps[] = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
];

const authenticatedNavItems: NavItemProps[] = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Plus,
    label: "Watchlist",
    href: "/watchlist",
  },
  {
    icon: Star,
    label: "My Ratings",
    href: "/ratings",
  },
  {
    icon: UserCheck,
    label: "Following",
    href: "/following",
  },
  {
    icon: UserPlus,
    label: "Followers",
    href: "/followers",
  },
];

const supportNavItems: NavItemProps[] = [
  {
    icon: Info,
    label: "Privacy Policy",
    href: "/legal#privacy-policy",
  },
];

export function SideBar() {
  return (
    <aside className="bg-card w-56 border-r p-4">
      <nav className="flex h-full flex-col gap-6">
        <SignedIn>
          <NavItems items={authenticatedNavItems} />
        </SignedIn>
        <SignedOut>
          <NavItems items={unauthenicatedNavItems} />
        </SignedOut>
        <div className="flex-1" />
        <NavItems items={supportNavItems} />
      </nav>
    </aside>
  );
}

function NavItems(props: { items: NavItemProps[] }) {
  return props.items.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="text-md flex items-center gap-3 font-medium"
    >
      <item.icon className="h-5 w-5" />
      {item.label}
    </Link>
  ));
}
