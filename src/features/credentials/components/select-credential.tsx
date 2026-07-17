"use client"
import { NodeType } from '@/generated/prisma/enums'
import React from 'react'
import { useCredentialsByType } from '../hooks/use-credentials-bytype'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateCredentialDialog } from './create-credential-dialog'

interface props {
  type: NodeType
  currentId: string
  onSelect: (id: string) => void
}

const SelectCredentials: React.FC<props> = ({ type, currentId, onSelect }) => {
  const { data, isLoading, isError } = useCredentialsByType(type)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loading credentials..." />
          </SelectTrigger>
        </Select>
        <CreateCredentialDialog type={type} onCreated={onSelect} />
      </div>
    )
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="No credentials found" />
          </SelectTrigger>
        </Select>
        <CreateCredentialDialog type={type} onCreated={onSelect} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentId}
        onValueChange={(val) => {
          if (val) onSelect(val)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a credential" />
        </SelectTrigger>
        <SelectContent>
          {data.map((credential) => (
            <SelectItem key={credential.id} value={credential.id}>
              {credential.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CreateCredentialDialog type={type} onCreated={onSelect} />
    </div>
  )
}

export default SelectCredentials