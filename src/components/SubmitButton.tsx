"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "./ui/button";

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  console.log("Testing GitHub Actions");

  return (
    <Button isLoading={pending || props.isLoading} type="submit" {...props} />
  );
}
