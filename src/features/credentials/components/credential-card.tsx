"use client"

import { useState } from "react"
import { KeyRound, MoreVertical, Pencil, Trash2 } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { useDeleteCredential } from "@/features/credentials/hooks/use-delete-credential"
import { EditCredentialDialog } from "./edit-credential-dialog"
import type { CredentialListItem } from "@/features/credentials/types"
import { toast } from "sonner"

const NODE_TYPE_LABELS: Record<string, string> = {
  MANUAL_TRIGGER: "Manual Trigger",
  WEBHOOK: "Webhook",
  HTTP_REQUEST: "HTTP Request",
  SEND_TELEGRAM_MESSAGE: "Telegram Message",
}

function formatRelativeTime(date: string | Date) {
  const value = new Date(date)
  const diffMs = value.getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / 60000)

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 24 * 365],
    ["month", 60 * 24 * 30],
    ["week", 60 * 24 * 7],
    ["day", 60 * 24],
    ["hour", 60],
    ["minute", 1],
  ]

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  for (const [unit, minutesInUnit] of divisions) {
    if (Math.abs(diffMinutes) >= minutesInUnit || unit === "minute") {
      return rtf.format(Math.round(diffMinutes / minutesInUnit), unit)
    }
  }

  return rtf.format(diffMinutes, "minute")
}

export function CredentialCard({ credential }: { credential: CredentialListItem }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteCredential = useDeleteCredential()

  const handleDelete = async () => {
    try {
      await deleteCredential.mutateAsync({
        credential_id: credential.id,
      })
      toast.success("Credential deleted")
      setDeleteOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete credential",
      )
    }
  }

  return (
    <>
      <Card className="h-full border-border bg-card text-card-foreground transition-colors hover:border-foreground/20 hover:bg-accent/40">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <KeyRound className="h-4 w-4" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-base font-medium">
              {credential.name || "Untitled credential"}
            </CardTitle>
            <CardDescription>
              {NODE_TYPE_LABELS[credential.type] ?? credential.type}
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="pt-0">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(credential.updated_at)}
          </span>
        </CardFooter>
      </Card>

      <EditCredentialDialog
        credential={credential}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog
        open={deleteOpen}
        onOpenChange={(value) => {
          if (!deleteCredential.isPending) setDeleteOpen(value)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{credential.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteCredential.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCredential.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
