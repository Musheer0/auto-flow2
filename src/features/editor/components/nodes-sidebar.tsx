"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NodeAction, NodeType } from '@/generated/prisma/enums'
import { nodesUi } from '@/features/editor/config/nodes-ui' // adjust to the actual path of your nodesUi 
import { cn } from '@/lib/utils'
import { SearchIcon, ZapIcon, PlayIcon } from 'lucide-react'
import React, { ReactNode, useMemo, useState } from 'react'

type NodesSidebarProps = {
  children: ReactNode
  onSelect?: (type: NodeType) => void
  existingNodes?: { type?: string }[]
}

const sectionMeta: Record<NodeAction, { label: string; icon: LucideIconType; hint: string }> = {
  [NodeAction.TRIGGER]: {
    label: 'Triggers',
    icon: ZapIcon,
    hint: 'Starts the workflow',
  },
  [NodeAction.EXECUTOR]: {
    label: 'Actions',
    icon: PlayIcon,
    hint: 'Runs a step in the workflow',
  },
}

// local alias so we don't need to import LucideIcon type separately for the meta table
type LucideIconType = React.ComponentType<{ className?: string }>

const NodesSidebar = ({ children, onSelect, existingNodes = [] }: NodesSidebarProps) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const hasTrigger = useMemo(
    () => existingNodes.some((n) => nodesUi[n.type as NodeType]?.type === NodeAction.TRIGGER),
    [existingNodes]
  )

  const entries = useMemo(() => {
    const all = Object.entries(nodesUi) as [NodeType, (typeof nodesUi)[NodeType]][]
    if (!hasTrigger) return all
    return all.filter(([, node]) => node.type !== NodeAction.TRIGGER)
  }, [hasTrigger])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      ([, node]) =>
        node.name.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q)
    )
  }, [entries, query])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, [NodeType, (typeof nodesUi)[NodeType]][]>>(
      (acc, [key, node]) => {
        const bucket = node.type
        if (!acc[bucket]) acc[bucket] = []
        acc[bucket].push([key, node])
        return acc
      },
      {}
    )
  }, [filtered])

  const handleSelect = (type: NodeType) => {
    onSelect?.(type)
    setOpen(false)
    setQuery('')
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger >{children}</SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="gap-1 border-b px-6 py-5">
          <SheetTitle>Add node</SheetTitle>
          <SheetDescription>
            Choose a trigger or action to add to your workflow.
          </SheetDescription>
        </SheetHeader>

        <div className="border-b px-6 py-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes..."
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {Object.keys(grouped).length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No nodes match &ldquo;{query}&rdquo;.
            </p>
          )}

          {(Object.keys(sectionMeta) as NodeAction[]).map((action) => {
            const group = grouped[action]
            if (!group || group.length === 0) return null
            const meta = sectionMeta[action]
            const SectionIcon = meta.icon

            return (
              <div key={action} className="mb-4 last:mb-0">
                <div className="flex items-center gap-1.5 px-3 pb-1.5 pt-2">
                  <SectionIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {meta.label}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {group.map(([key, node]) => {
                    const Icon = node.icon
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelect(key)}
                        className={cn(
                          'group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                          'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none'
                        )}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-foreground group-hover:border-foreground/20">
                          {typeof Icon === 'string' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={Icon} alt="" className="size-4" />
                          ) : (
                            <Icon className="size-4" />
                          )}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium leading-tight">
                            {node.name}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {node.description}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <SheetFooter className="border-t px-6 py-4">
          <Button disabled className="relative w-full">
            <Badge
              variant="secondary"
              className="absolute -left-2 -top-2 pointer-events-none"
            >
              Coming soon
            </Badge>
            Create custom node
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default NodesSidebar