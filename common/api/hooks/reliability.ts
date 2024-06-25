import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR } from '../../constants/time';
import { fetchLineDelaysByLine } from '../reliability';
import type { FetchAlertDelaysByLineOptions } from '../../types/api';

export const useAlertDelays = (options: FetchAlertDelaysByLineOptions, enabled?: boolean) => {
  return useQuery({
    queryKey: ['lineReliability', options],
    queryFn: () => fetchLineDelaysByLine(options),
    enabled: enabled,
    staleTime: ONE_HOUR,
  });
};
