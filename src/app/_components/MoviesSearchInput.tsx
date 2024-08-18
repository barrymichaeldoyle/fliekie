"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";

import { Input } from "~/components/ui/input";

export function MoviesSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const debouncedChange = useMemo(
    () =>
      debounce((query: string) => {
        const newQueryString = createQueryString("search", query);
        router.replace(`?${newQueryString}`);
      }, 500),
    [router, createQueryString],
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    debouncedChange(e.target.value);
  }

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
      <Input
        defaultValue={searchParams.get("search") || ""}
        onChange={handleChange}
        placeholder="Search Movies"
        className="pl-8"
      />
    </div>
  );
}
