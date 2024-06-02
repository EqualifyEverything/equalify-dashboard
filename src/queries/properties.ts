import { queryOptions } from '@tanstack/react-query';
import { getProperties, getPropertyById } from '~/services';

// Query for all properties
export const propertiesQuery = () => queryOptions({
    queryKey: ['properties'],
    queryFn: getProperties,
});

// Query for a specific property
export const propertyQuery = (propertyId: string) => queryOptions({
    queryKey: ['property', propertyId],
    queryFn: async () => {
        const property = await getPropertyById(propertyId);
        if (!property) {
          throw new Response('', {
            status: 404,
            statusText: 'Property Not Found',
          });
        }
        return property;
      },
});
