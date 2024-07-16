import { queryOptions } from '@tanstack/react-query';
import { getScans } from '~/services/scans';

// Query for all scans
export const scansQuery = () =>
  queryOptions({
    queryKey: ['scans'],
    queryFn: getScans,
  });
