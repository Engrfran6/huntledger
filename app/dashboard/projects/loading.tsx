import {Skeleton} from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full md:w-[200px]" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[250px] w-full" />
        ))}
      </div>
    </div>
  );
}
