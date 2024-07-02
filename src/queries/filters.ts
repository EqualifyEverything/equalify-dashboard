import { queryOptions } from '@tanstack/react-query';
import { getFilters } from '~/services';

export const filtersQuery = () =>
  queryOptions({
    queryKey: ['filters'],
    queryFn: getFilters,
  });