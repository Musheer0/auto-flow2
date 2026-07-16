"use client"
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node'
import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import { nodesUi } from '../../config/nodes-ui'
import { Badge } from '@/components/ui/badge'
import { NodeForms } from '../../config/node-forms'
import { Button } from '@/components/ui/button'
import { SettingsIcon } from 'lucide-react'
import { NodeData } from '../../types'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const BaseExecutor = (props: NodeProps) => {
  const NodeUi = nodesUi[props.type as keyof typeof nodesUi]
  const NodeForm = NodeForms[props.type as keyof typeof nodesUi]
  const node_data: NodeData<any> = props.data as any

  const name = node_data?.config?.name
  const isUnconfigured = !name

  if (NodeUi)
    return (
      <BaseNode
        className={cn(
          'h-14 w-14 relative flex items-center justify-center',
          isUnconfigured && 'ring-1 ring-red-500/60'
        )}
      >
        {NodeForm && (
          <BaseNodeHeader className="absolute bottom-full left-0">
            <NodeForm {...props}>
              <Button size={'icon-sm'} className={'scale-85'} variant={'ghost'}>
                <SettingsIcon />
              </Button>
            </NodeForm>
          </BaseNodeHeader>
        )}

        {isUnconfigured && (
          <Tooltip>
            <TooltipTrigger >
              <span className="absolute -right-1 -top-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full border-2 border-background bg-red-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              This node needs a name before it can run
            </TooltipContent>
          </Tooltip>
        )}

        <BaseNodeContent>
          {NodeUi && <NodeUi.icon />}
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </BaseNodeContent>

        <Badge
          className={cn(
            'absolute top-full left-1/2 -translate-x-1/2 scale-50',
            isUnconfigured
              ? 'bg-red-600 dark:bg-red-500'
              : 'bg-orange-600 dark:bg-orange-400'
          )}
        >
          {name || `${NodeUi.name} (unconfigured)`}
        </Badge>
      </BaseNode>
    )
}

export default BaseExecutor