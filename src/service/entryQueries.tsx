import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthState } from 'lib/authentication';
import { config } from 'lib/config';
import {
  Deposit,
  Dividend,
  Entry,
  Taxes,
  Trade,
  Withdrawal,
} from 'model/entry';
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

export const useGetEntry = (id: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [`entry-${id}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getEntry(accessToken!, id);
    },
  });
};

export const useDeleteEntry = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const accessToken = await getToken();
      return deleteEntry(accessToken!, id);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries', `entry-${data}`],
      });
    },
  });
};

export const useSaveEntry = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      entry: Trade | Deposit | Withdrawal | Taxes | Dividend
    ) => {
      const accessToken = await getToken();
      return saveEntry(accessToken!, entry);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries', `entry-${data.id}`],
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

const getEntry = (accessToken: string, id: string): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/entries/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};

const deleteEntry = (accessToken: string, id: string): Promise<string> => {
  return fetch(`${config.api}/api/v1/entries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};

const saveEntry = (
  accessToken: string,
  dividend: Trade | Deposit | Withdrawal | Taxes | Dividend
): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/entries`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dividend),
  }).then(responseOrError);
};
