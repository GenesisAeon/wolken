import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "bg-surface-2 shadow-panel",
        "data-[state=checked]:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "transition-[background-color] duration-150 ease-out",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-fg shadow-sm",
          "data-[state=checked]:bg-accent-fg",
          "translate-x-0.5 data-[state=checked]:translate-x-[22px]",
          "transition-transform duration-150 ease-out",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
