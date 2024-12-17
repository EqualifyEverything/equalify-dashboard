import { queryOptions } from '@tanstack/react-query';
import { getProperties, getPropertyById, IPropertyParams } from '~/services';

// Query for all properties
export const propertiesQuery = () => queryOptions({
    queryKey: ['properties'],
    queryFn: getProperties,
});

// Query for a specific property
export const propertyQuery = (params:IPropertyParams) => queryOptions({
    queryKey: ['property', params.property_id], 
    queryFn: async () => {
        const property = await getPropertyById(params.property_id, params.limit, params.offset);
        if (!property) {
          throw new Response('', {
            status: 404,
            statusText: 'Property Not Found',
          });
        }
        return property;
      },
});
