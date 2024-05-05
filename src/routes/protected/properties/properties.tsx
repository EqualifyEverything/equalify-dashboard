import React from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '~/graphql/hooks/useProperties';
import LoadingProperty from './loading-property';

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
  sitemapUrl: string;
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
          Processed {formatDate(lastProcessed)}
        </p>
      </div>
      <Link
        to={`/properties/${id}`}
        className="inline-flex h-9 justify-center whitespace-nowrap rounded-md bg-[#663808] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
      >
        Edit Property
      </Link>
    </div>
  </article>
);

const Properties = () => {
  const { data: properties, isLoading, error } = useProperties();

  if (error) return <p>Error loading properties</p>;

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="properties-list-heading"
        >
          Properties
        </h1>
        <Link
          to="/properties/add-property"
          className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
        >
          Add Property
        </Link>
      </div>
      {isLoading ? (
        <section
          aria-labelledby="properties-list-heading"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <LoadingProperty key={index} />
          ))}
        </section>
      ) : (
        <section
          aria-labelledby="properties-list-heading"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {properties?.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </section>
      )}
    </>
  );
};

export default Properties;
