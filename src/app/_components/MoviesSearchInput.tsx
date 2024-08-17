"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "~/components/ui/input";

export function MoviesSearchInput(props: { defaultValue?: string }) {
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    router.replace(`?search=${e.target.value}`);
  }

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
      <Input
        defaultValue={props.defaultValue}
        onChange={handleChange}
        placeholder="Search Movies"
        className="pl-8"
      />
    </div>
  );
}
