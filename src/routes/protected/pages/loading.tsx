import { Skeleton } from '~/components/skeleton/skeleton';

export const LoadingPages = () => (
  <section
    aria-labelledby="properties-list-heading"
    className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: 6 }, (_, index) => (
      <article
        className="flex flex-col gap-6 rounded-lg bg-white p-4 shadow"
        key={index}
      >
        <Skeleton className="h-6 w-3/4" />
        <div className="mt-2 flex items-end justify-between">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </article>
    ))}
  </section>
);
