import { Skeleton } from '~/components/skeleton/skeleton';

const LoadingProperty = () => (
  <article className="rounded-lg flex flex-col gap-6 bg-white p-4 shadow">
    <Skeleton className="h-6 w-3/4" />
    <div className="mt-2 flex items-end justify-between">
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
  </article>
);

export default LoadingProperty;
