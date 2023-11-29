import { useQuery } from '@tanstack/react-query';
import { useAuthState } from 'lib/authentication';
import { config } from 'lib/config';
import { Journal } from 'model/journal';
import { Paginated } from 'model/pagination';
import { responseOrError } from './response';

export const useGetJournals = () => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const accessToken = await getToken();
      return getJournals(accessToken!);
    },
  });
};

const getJournals = (accessToken: string): Promise<Paginated<Journal>> => {
  return fetch(`${config.api}/api/v1/journals`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};
