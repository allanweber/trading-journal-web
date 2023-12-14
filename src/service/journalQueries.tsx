import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    queryKey: ['journals', `journals-${query}-${currency}-${pageSize}-${page}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getJournals(accessToken!, query, currency, pageSize, page);
    },
  });
};

export const useGetJournal = (id: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [`journal-${id}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getJournal(accessToken!, id);
    },
  });
};

export const useSaveJournal = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['journals'],
    mutationFn: async (journal: Journal) => {
      const accessToken = await getToken();
      return createJournal(accessToken!, journal);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [`journal-${data._id}`, 'all-journals'],
      });
    },
  });
};

export const useDeleteJournal = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['journals'],
    mutationFn: async (id: string) => {
      const accessToken = await getToken();
      return deleteJournal(accessToken!, id);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['all-journals'] });
    },
  });
};

export const useAllJournals = () => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: ['all-journals'],
    queryFn: async () => {
      const accessToken = await getToken();
      return getAllJournals(accessToken!);
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

const getJournal = (accessToken: string, id: string): Promise<Journal> => {
  return fetch(`${config.api}/api/v1/journals/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};

const createJournal = (
  accessToken: string,
  journal: Journal
): Promise<Journal> => {
  return fetch(`${config.api}/api/v1/journals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(journal),
  }).then(responseOrError);
};

const deleteJournal = (accessToken: string, id: string): Promise<string> => {
  return fetch(`${config.api}/api/v1/journals/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};

const getAllJournals = (accessToken: string): Promise<Journal[]> => {
  return fetch(`${config.api}/api/v1/journals/all`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).then(responseOrError);
};
