import { Skeleton } from '@/components/Skeleton';
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="card">
        <Skeleton className="h-6 w-1/3" />
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
      <div className="card">
        <Skeleton className="h-5 w-1/4" />
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    </div>
  );
}
