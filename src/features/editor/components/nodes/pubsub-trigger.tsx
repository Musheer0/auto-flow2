"use client"
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader } from '@/components/base-node'
import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import { nodesUi } from '../../config/nodes-ui'
import { Badge } from '@/components/ui/badge'
import { NodeForms } from '../../config/node-forms'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SettingsIcon } from 'lucide-react'
import { NodeData } from '../../types'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NodeType } from '@/generated/prisma/enums'
import { useSubscribePubSubHub } from '../../hooks/use-subscribe-pubsubhub'
import z from 'zod'
import { YoutubePubSubSchema } from '../../schemas/youtube-pubsubhubhub-schema'
import { useParams } from 'next/navigation'
import { useEditorStore } from '../../store/editor.store'

const PubSubTrigger = (props: NodeProps) => {
  const NodeUi = nodesUi[props.type as keyof typeof nodesUi]
  const NodeForm = NodeForms[props.type as keyof typeof nodesUi]
  const node_data: NodeData<z.infer<typeof YoutubePubSubSchema>> = props.data as any
  const { mutate, isPending, isError } = useSubscribePubSubHub()
  const { id } = useParams<{ id: string }>()
  const { updateNode } = useEditorStore()
  const callbackurl = `${window.origin}/api/workflows/${id}/webhook/${props.id}/pubsub`
  const handleClick = () =>
    mutate({
      callback: callbackurl,
      secret: node_data?.user_data?.verify_secret,
      topic: node_data?.user_data?.channel_id,
      onSuccess() {
        updateNode(props.id, (node) => ({
          ...node,
          data: {
            ...node.data,
            user_data: {
              ...(node?.data?.user_data || {}),
              has_subscribed: true,
            },
          },
        }))
      },
    })
  const name = node_data?.config?.name || props.type === NodeType.MANUAL_TRIGGER ? "MANUAL_TRIGGER" : props.type
  const isUnconfigured = !name || !node_data?.user_data?.channel_id || !node_data?.user_data?.verify_secret
  const isSubscribed = props.type === NodeType.PUBSUBHUBBUB && node_data?.user_data?.has_subscribed
  if (NodeUi)
    return (
      <BaseNode
        className={cn(
          'rounded-r-none h-14 w-14 relative flex items-center justify-center',
          isUnconfigured && 'ring-1 ring-red-500/60', !isSubscribed && 'ring-1 ring-red-500/60',

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
        {

          <BaseNodeFooter className="absolute top-[120%] left-1/2 border-0 -translate-x-1/2">
            <Button
              onClick={handleClick}
              size={'sm'}
              className={'scale-85'}
              disabled={isPending || isUnconfigured}
            >
              {isPending ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  {isSubscribed ? "Subscribing Again..." : "Subscribing..."}
                </>
              ) : isSubscribed ? (
                "Subscribe Again"
              ) : (
                "Subscribe"
              )}
            </Button>
          </BaseNodeFooter>
        }
        {isUnconfigured || !isSubscribed && (
          <Tooltip>
            <TooltipTrigger>
              <span className="absolute -right-1 -top-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full border-2 border-background bg-red-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              This node needs a name before it can run {!isSubscribed && 'subscribe to enable it  '}
            </TooltipContent>
          </Tooltip>
        )}

        <BaseNodeContent>
          {NodeUi &&
            <>
              {typeof NodeUi.icon === "string" ? <img src={NodeUi.icon} alt={NodeUi.type} className='w-10 h-10 object-contain' /> : <NodeUi.icon />}
            </>
          }          <Handle type="source" position={Position.Right} />
        </BaseNodeContent>

        <Badge
          className={cn(
            'absolute top-full left-1/2 -translate-x-1/2 scale-50',
            isUnconfigured || !isSubscribed
              ? 'bg-red-600 dark:bg-red-500'
              : 'bg-orange-600 dark:bg-orange-400'
          )}
        >
          {`${NodeUi.name} ${isUnconfigured ? "(unconfigured)" : ""}` || name}
        </Badge>
      </BaseNode>
    )
}

export default PubSubTrigger