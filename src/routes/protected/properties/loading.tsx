import { Skeleton } from '~/components/skeleton/skeleton';

export const LoadingProperties = () => (
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

// TODO: Fix the styles of loading property skeleton

export const LoadingProperty = () => (
  <>
    <Skeleton className="" />

    <section
      aria-labelledby="edit-property-heading"
      className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
    >
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />

      <div className="space-x-6">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </section>
  </>
);
