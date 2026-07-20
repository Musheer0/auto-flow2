import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

const useTriggerWorkflow = () => {
  const trpc = useTRPC()
  return useMutation(trpc.workflows.runWokrkflowManually.mutationOptions())
}

export default useTriggerWorkflow