"use client";

import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";

import { Input } from "@fliekie/ui/input";

import { TMDBAltShort } from "~/components/images/TMDBAltShort";

export function SearchInput() {
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
        const newQueryString = createQueryString("q", query);
        if (query.length > 0) {
          router.replace(`/search?${newQueryString}`);
        } else {
          router.replace("/");
        }
      }, 500),
    [router, createQueryString],
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    debouncedChange(e.target.value);
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        placeholder="Search Movies"
        className="rounded-full pl-8 pr-24"
      />
      <TMDBAltShort className="absolute right-2 top-3.5 w-20 opacity-80" />
    </div>
  );
}
