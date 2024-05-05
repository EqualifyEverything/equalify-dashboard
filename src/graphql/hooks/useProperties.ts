import { useQuery, useQueryClient } from '@tanstack/react-query';

import { mockProperties } from '../mocks/mock-properties';

interface Property {
  id: string;
  name: string;
  lastProcessed: string;
  sitemapUrl: string;
}

const fetchProperties = async (): Promise<Property[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProperties;
};

const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProperties.find((property) => property.id === id);
};

export const useProperties = () =>
  useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });


export const usePropertyDetails = (propertyId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Property | undefined>({
    queryKey: ['property', propertyId],
    queryFn: () => fetchPropertyById(propertyId),
    initialData: (): Property | undefined => {
      const allProperties = queryClient.getQueryData<Property[]>([
        'properties',
      ]);
      return allProperties?.find(
        (property: Property) => property.id === propertyId,
      );
    },
    initialDataUpdatedAt: (): number =>
      queryClient.getQueryState(['properties'])?.dataUpdatedAt ?? 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
