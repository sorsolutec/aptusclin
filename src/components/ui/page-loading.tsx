import { Card, CardContent, CardHeader } from '@/components/ui/card'

function SkeletonLine({ className = 'h-4 w-full' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonLine className="h-7 w-48" />
        <SkeletonLine className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <SkeletonLine className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine className="h-4 w-20" />
                  <SkeletonLine className="h-5 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <SkeletonLine className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-5/6" />
            <SkeletonLine className="h-4 w-4/6" />
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <SkeletonLine className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <SkeletonLine className="h-10 w-full" />
            <SkeletonLine className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function PortalDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <SkeletonLine className="h-7 w-44" />
          <SkeletonLine className="h-4 w-56" />
        </div>
        <SkeletonLine className="h-10 w-32 rounded-lg" />
      </div>

      <div className="rounded-xl bg-slate-200 p-6">
        <div className="space-y-3">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-6 w-48" />
          <SkeletonLine className="h-4 w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-7 w-16" />
              <SkeletonLine className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
