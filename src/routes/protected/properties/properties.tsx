import React from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Link, useLoaderData } from 'react-router-dom';

import { SEO } from '~/components/layout';
import { propertiesQuery } from '~/queries';
import { LoadingProperties } from './loading';

export const propertiesLoader = (queryClient: QueryClient) => async () => {
  const initialProperties =
    await queryClient.ensureQueryData(propertiesQuery());
  return { initialProperties };
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

interface Property {
  id: string;
  name: string;
  lastProcessed: string;
}

const PropertyCard: React.FC<Property> = ({ id, name, lastProcessed }) => (
  <article
    aria-labelledby={`property-title-${id}`}
    className="rounded-lg bg-white p-4 shadow"
  >
    <h2 id={`property-title-${id}`} className="text-lg">
      {name}
    </h2>
    <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div className="min-w-0">
        <p className="mt-1 text-sm text-gray-600">
          Added {formatDate(lastProcessed)}
        </p>
      </div>
      <Link
        to={`/properties/${id}/edit`}
        className="inline-flex h-9 justify-center whitespace-nowrap rounded-md bg-[#663808] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
      >
        <span className="sr-only">{`Edit ${name} Property`}</span>
        <span aria-hidden="true">Edit Property</span>
      </Link>
    </div>
  </article>
);

const Properties = () => {
  const { initialProperties } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof propertiesLoader>>
  >;
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    ...propertiesQuery(),
    initialData: initialProperties,
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SEO
        title="Properties - Equalify"
        description="Manage and monitor your properties on Equalify to improve their accessibility."
        url="https://dashboard.equalify.app/properties"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="properties-list-heading"
        >
          Properties
        </h1>
        <div className='flex flex-row items-center gap-2'>
          <Link
            to="/properties/add"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
          >
            Add Property
          </Link>
          <Link
            to="/properties/bulk"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
          >
            Bulk Upload CSV
          </Link>
        </div>
      </div>
      {isLoading ? (
        <LoadingProperties />
      ) : properties.length === 0 ? (
        <div className="mt-7 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Properties Added
          </h2>
          <p className="mt-2 text-gray-600">
            You haven't added any properties yet. Get started by adding your
            first property and monitor its accessibility status.
          </p>
          <Link
            to="/properties/add"
            className="mt-4 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-[#005031] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <section
          aria-labelledby="properties-list-heading"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {properties.map((property: Property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </section>
      )}
    </>
  );
};

export default Properties;
