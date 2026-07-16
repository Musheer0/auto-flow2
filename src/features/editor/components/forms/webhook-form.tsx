"use client"
import { NodeProps } from '@xyflow/react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import BaseForm from './base-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useEditorStore } from '../../store/editor.store'
import { toast } from 'sonner'
import { NodeData, WebhookData } from '../../types'
import { cn } from '@/lib/utils'

const WebhookForm = (props: NodeProps & { children: React.ReactNode }) => {
  const node_data: NodeData<WebhookData> = props.data as any
  const { id } = useParams<{ id: string }>()
  const webhookurl = `${window.origin}/workflows/${id}/webhook/${props.id}`
  const [whSecret, setWhSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState(node_data?.config?.name || '')
  const { updateNode } = useEditorStore()

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookurl)
    setCopied(true)
    toast.success('Webhook URL copied to clipboard')
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSave = () => {
    if (whSecret.length === 0) {
      toast.warning('No secret set', {
        description:
          'Anyone with this URL can trigger the workflow. Add a secret to make sure requests are really coming from your source.',
      })
    }
    updateNode(props.id, (node) => ({
      ...node,
      data: {
        ...node.data,
        config: {
          name,
        },
        user_data: {
          webhook_secret: whSecret,
        },
      },
    }))
  }

  if (id)
    return (
      <BaseForm
      onSave={handleSave}
        desc="Trigger this workflow by sending a request to a URL — useful for connecting external apps, forms, or services."
        {...props}
        trigger={props.children}
      >
        <div className="flex flex-col gap-1.5">
          <Label>Webhook URL</Label>
          <div className="webhook-url flex items-center gap-2">
            <Input disabled value={webhookurl} className="font-mono text-xs" />
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Send a POST request to this URL to run the workflow. It's live as soon as this node is saved.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Node name</Label>
          <Input
            placeholder="e.g. New Order Webhook"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Used to reference this node's data in later steps, e.g.{' '}
            <code className="rounded bg-muted px-1 py-0.5">
              {`{{${name || 'node_name'}.body}}`}
            </code>
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Webhook secret</Label>
          <div className="relative">
            <Input
              type={showSecret ? 'text' : 'password'}
              placeholder="Leave blank to skip verification"
              value={whSecret}
              onChange={(e) => setWhSecret(e.target.value)}
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowSecret((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showSecret ? 'Hide secret' : 'Show secret'}
            >
              {showSecret ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          <p
            className={cn(
              'text-xs',
              whSecret.length === 0 ? 'text-amber-600' : 'text-muted-foreground'
            )}
          >
            {whSecret.length === 0
              ? "Recommended. Without a secret, anyone who finds this URL can trigger your workflow."
              : "Sent with each request so you can verify it came from the expected source. Keep it private."}
          </p>
        </div>
      </BaseForm>
    )
}

export default WebhookForm