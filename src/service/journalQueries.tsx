import { useQuery } from '@tanstack/react-query';
import { useAuthState } from 'lib/authentication';
import { config } from 'lib/config';
import { Journal } from 'model/journal';
import { Paginated } from 'model/pagination';
import { responseOrError } from './response';

export const useGetJournals = (
  query?: string,
  currency?: string,
  pageSize?: string,
  page?: string
) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: ['journals', `journal-${query}-${currency}-${pageSize}-${page}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getJournals(accessToken!, query, currency, pageSize, page);
    },
  });
};

const getJournals = (
  accessToken: string,
  query?: string,
  currency?: string,
  pageSize?: string,
  page?: string
): Promise<Paginated<Journal>> => {
  let url = `${config.api}/api/v1/journals?`;

  if (query) {
    url = `${url}query=${query}&`;
  }
  if (currency) {
    url = `${url}currency=${currency}&`;
  }
  if (page) {
    url = `${url}page=${page}&`;
  }
  if (pageSize) {
    url = `${url}pageSize=${pageSize}&`;
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};
