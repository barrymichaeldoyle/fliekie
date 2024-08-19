import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Eye, Info, LucideProps, Search, Star } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type NavItemProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href: string;
};

const unauthenicatedNavItems: NavItemProps[] = [
  {
    icon: Search,
    label: "Search",
    href: "/",
  },
  {
    icon: Info,
    label: "Disclaimer",
    href: "/disclaimer",
  },
];

const authenticatedNavItems: NavItemProps[] = [
  {
    icon: Search,
    label: "Search",
    href: "/",
  },
  {
    icon: Eye,
    label: "Seen List",
    href: "/seenlist",
  },
  {
    icon: Star,
    label: "Watch List",
    href: "/watchlist",
  },
  {
    icon: Info,
    label: "Disclaimer",
    href: "/disclaimer",
  },
];

export function SideBar() {
  return (
    <aside className="w-56 border-r bg-card p-4">
      <nav className="flex flex-col gap-6">
        <SignedIn>
          {authenticatedNavItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </SignedIn>
        <SignedOut>
          {unauthenicatedNavItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </SignedOut>
      </nav>
    </aside>
  );
}

function NavItem(props: NavItemProps) {
  return (
    <Link
      href={props.href}
      className="text-md flex items-center gap-3 font-medium"
    >
      <props.icon className="h-5 w-5" />
      {props.label}
    </Link>
  );
}
