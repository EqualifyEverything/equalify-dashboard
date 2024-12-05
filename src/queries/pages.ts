import { queryOptions } from '@tanstack/react-query';
import { getPages, getPageDetail, IPageParams, IPageDetailParams } from '~/services';

// Query for all pages
export const pagesQuery = (params:IPageParams) => queryOptions({
    queryKey: ['pages'],
    queryFn: async () => getPages({params: params}),
});

// Query for page detail
export const pageDetailQuery = (params:IPageDetailParams) => queryOptions({
    queryKey: ['page-detail'],
    queryFn: async () => getPageDetail(params),
});


