"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

import { Input } from "~/components/ui/input";

export function MoviesSearchInput(props: { defaultValue?: string }) {
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    router.replace(`?search=${e.target.value}`);
  }

  return <Input defaultValue={props.defaultValue} onChange={handleChange} />;
}
