"use client"
import React from 'react'
import { useEditorStore } from '../store/editor.store'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { transformReactFlowToServerData } from '../lib/transform-data'
import { Button } from '@/components/ui/button'
import { Loader2, SaveIcon } from 'lucide-react'
import { ZodError } from 'zod'
import useSaveWorkflow from '../hooks/use-save-workflow'

const SaveButton = () => {
  const { nodes, edges } = useEditorStore()
  const { id } = useParams<{ id: string }>()
  const { mutate: saveWorkflow, isPending } = useSaveWorkflow()

  const handleSave = () => {
    if (!id) {
      toast.error("missing id")
      return
    }

    try {
      const data = transformReactFlowToServerData(nodes, edges, id)
      saveWorkflow(data, {
        onSuccess: () => toast.success("Workflow saved"),
        onError: (error) => toast.error(error.message || "something went wrong try again."),
      })
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error)
        toast.warning(error.issues[0]?.message ?? "Invalid workflow data")
        return
      }
      toast.error("something went wrong try again.")
    }
  }

  return (
    <Button onClick={handleSave} disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : <SaveIcon />}
      {isPending ? "Saving..." : "Save Changes"}
    </Button>
  )
}

export default SaveButton