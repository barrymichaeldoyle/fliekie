"use client";

import { type Ref, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "./ui/button";

export const SubmitButton = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { pending } = useFormStatus();

    return (
      <Button
        ref={ref}
        isLoading={pending || props.isLoading}
        type="submit"
        {...props}
      />
    );
  },
);
SubmitButton.displayName = "SubmitButton";
