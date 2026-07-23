"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import UpgradeButton from "@/features/payment/compoents/ugrade-button";

interface WorkflowDetailHeaderProps {
  name: string;
  createdAt: string | Date;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function WorkflowDetailHeader({
  name,
  onEdit,
  onDelete,
  isDeleting,
}: WorkflowDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between py-2 pb-3 border-b px-3 ">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/workflows")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-lg font-semibold leading-none tracking-tight text-foreground ">
          {name || "Untitled workflow"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <UpgradeButton/>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
}
