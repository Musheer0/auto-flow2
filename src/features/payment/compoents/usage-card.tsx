"use client"

import React from 'react'
import { AlertCircle, Zap } from 'lucide-react'
import { SidebarMenuItem } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUsage } from '../hooks/use-get-usage'
import { useUpgradeUsage } from '../hooks/use-upgrade-usage'

const UsageCard = () => {
  const { data, isLoading, isError, refetch } = useGetUsage()
  const { mutate, isPending } = useUpgradeUsage()

  const usage = data

  // --- Loading state ---
  if (isLoading) {
    return (
      <SidebarMenuItem className="flex flex-col gap-2 px-2 py-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-md" />
      </SidebarMenuItem>
    )
  }

  // --- Error state ---
  if (isError) {
    return (
      <SidebarMenuItem className="flex flex-col gap-2 px-2 py-3 text-sm">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>Couldn&apos;t load usage</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </SidebarMenuItem>
    )
  }

  // --- Empty / no-data state (no usage record yet) ---
  if (!usage) {
    return (
      <SidebarMenuItem className="flex flex-col gap-2 px-2 py-3 text-sm text-muted-foreground">
        <span>No usage data available</span>
      </SidebarMenuItem>
    )
  }

  // --- Success state ---
  const { credits_used, credits_alloted } = usage
  const percentUsed = credits_alloted > 0
    ? Math.min(100, Math.round((credits_used / credits_alloted) * 100))
    : 0
  const isExhausted = credits_alloted > 0 && credits_used >= credits_alloted
  const isNearLimit = !isExhausted && percentUsed >= 80

  return (
    <SidebarMenuItem className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Credits used</span>
        <span
          className={
            isExhausted
              ? 'font-medium text-destructive'
              : isNearLimit
              ? 'font-medium text-amber-500'
              : 'font-medium text-foreground'
          }
        >
          {credits_used} / {credits_alloted}
        </span>
      </div>

      <Progress
        value={percentUsed}
        className={isExhausted ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-amber-500' : ''}
      />

      {isExhausted && (
        <p className="text-xs text-destructive">
          You&apos;ve used all your credits.
        </p>
      )}
      {isNearLimit && !isExhausted && (
        <p className="text-xs text-amber-500">
          You&apos;re close to your limit.
        </p>
      )}

      <Button
        size="sm"
        className="w-full gap-1.5"
        variant={isExhausted ? 'default' : 'outline'}
        onClick={() => mutate()}
        disabled={isPending}
      >
        <Zap className="size-3.5" />
        {isPending ? 'Redirecting…' : 'Buy more credits'}
      </Button>
    </SidebarMenuItem>
  )
}

export default UsageCard