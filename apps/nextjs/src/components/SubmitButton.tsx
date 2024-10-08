"use client";

import type { Ref } from "react";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import type { ButtonProps } from "@fliekie/ui/button";
import { Button } from "@fliekie/ui/button";

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
