import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Eye, Info, type LucideProps, Search, Star } from "lucide-react";
import Link from "next/link";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

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
];

const supportNavItems: NavItemProps[] = [
  {
    icon: Info,
    label: "Disclaimer",
    href: "/disclaimer",
  },
];

export function SideBar() {
  return (
    <aside className="w-56 border-r bg-card p-4">
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
