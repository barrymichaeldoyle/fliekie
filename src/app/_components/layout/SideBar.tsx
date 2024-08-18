import { Eye, LucideProps, Search, Star } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export function SideBar() {
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

function NavItem(props: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href: string;
}) {
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
