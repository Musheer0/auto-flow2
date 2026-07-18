import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

const useSaveWorkflow = () => {
  const trpc= useTRPC()
  return useMutation(trpc.editor.save.mutationOptions())
}

export default useSaveWorkflow