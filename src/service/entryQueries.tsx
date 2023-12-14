import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthState } from 'lib/authentication';
import { config } from 'lib/config';
import { Entry, Withdrawal } from 'model/entry';
import { Paginated } from 'model/pagination';
import { responseOrError } from './response';

export const useGetEntries = (
  query?: string,
  journal?: string,
  type?: string,
  direction?: string,
  pageSize?: string,
  page?: string
) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [
      'entries',
      `entries-${query}-${journal}-${type}-${direction}-${pageSize}-${page}`,
    ],
    queryFn: async () => {
      const accessToken = await getToken();
      return getEntries(
        accessToken!,
        query,
        journal,
        type,
        direction,
        pageSize,
        page
      );
    },
  });
};

export const useSaveWithdrawal = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (withdrawal: Withdrawal) => {
      const accessToken = await getToken();
      return createWithdrawal(accessToken!, withdrawal);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      });
    },
  });
};

const getEntries = (
  accessToken: string,
  query?: string,
  journal?: string,
  type?: string,
  direction?: string,
  pageSize?: string,
  page?: string
): Promise<Paginated<Entry>> => {
  let url = `${config.api}/api/v1/entries?`;

  if (query) {
    url = `${url}query=${query}&`;
  }
  if (journal) {
    url = `${url}journal=${journal}&`;
  }
  if (type) {
    url = `${url}type=${type}&`;
  }
  if (direction) {
    url = `${url}direction=${direction}&`;
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

const createWithdrawal = (
  accessToken: string,
  journal: Withdrawal
): Promise<Withdrawal> => {
  return fetch(`${config.api}/api/v1/entries/withdrawals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(journal),
  }).then(responseOrError);
};
