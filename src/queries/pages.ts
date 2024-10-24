import { queryOptions } from '@tanstack/react-query';
import { getPages, IPageParams } from '~/services';

// Query for all pages
export const pagesQuery = (params:IPageParams) => queryOptions({
    queryKey: ['pages'],
    queryFn: async () => getPages({params: params}),
});


