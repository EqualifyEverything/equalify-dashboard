import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as API from "aws-amplify/api";

interface Property {
  id: string;
  name: string;
  lastProcessed: string;
  propertyUrl: string;
}

const fetchProperties = async (): Promise<Property[]> => {
  const properties = await (await API.get({ apiName: 'auth', path: '/get/properties' }).response).body.json();
  return properties.result;
};

const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  const properties = await (await API.get({ apiName: 'auth', path: `/get/properties?propertyIds=${id}` }).response).body.json();
  return properties?.result?.[0];
};

export const useProperties = () =>
  useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    refetchOnWindowFocus: true,
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
  });
};
