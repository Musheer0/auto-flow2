"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useUpgradeUsage } from "../hooks/use-upgrade-usage";

type UpgradeButtonProps = {
  variant?: "default" | "outline";
  className?: string;
};

const UpgradeButton = ({
  variant = "outline",
  className,
}: UpgradeButtonProps) => {
  const { mutate, isPending } = useUpgradeUsage();

  return (
    <Button
      size="sm"
      variant={variant}
      className={className}
      onClick={() => mutate()}
      disabled={isPending}
    >
      <Zap className="size-3.5" />
      {isPending ? "Redirecting…" : "Buy more credits"}
    </Button>
  );
};

export default UpgradeButton;