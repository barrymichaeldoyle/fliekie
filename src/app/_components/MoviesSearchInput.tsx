"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo } from "react";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";

import { Input } from "~/components/ui/input";

export function MoviesSearchInput(props: { defaultValue?: string }) {
  const router = useRouter();

  const debouncedChange = useMemo(
    () =>
      debounce((query: string) => {
        router.replace(`?search=${query}`);
      }, 500),
    [router],
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    debouncedChange(e.target.value);
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
