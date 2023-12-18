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
    mutationKey: ['entries'],
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

export const useSaveWithdrawal = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (withdrawal: Withdrawal) => {
      const accessToken = await getToken();
      return saveWithdrawal(accessToken!, withdrawal);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      });
    },
  });
};

export const useSaveDeposit = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (deposit: Deposit) => {
      const accessToken = await getToken();
      return saveDeposit(accessToken!, deposit);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      });
    },
  });
};

export const useSaveTaxes = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (taxes: Taxes) => {
      const accessToken = await getToken();
      return saveTaxes(accessToken!, taxes);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      });
    },
  });
};

export const useSaveDividend = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (dividend: Dividend) => {
      const accessToken = await getToken();
      return saveDividend(accessToken!, dividend);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      });
    },
  });
};

export const useSaveTrade = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['entries'],
    mutationFn: async (trade: Trade) => {
      const accessToken = await getToken();
      return saveTrade(accessToken!, trade);
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

const saveWithdrawal = (
  accessToken: string,
  withdrawal: Withdrawal
): Promise<Withdrawal> => {
  return fetch(`${config.api}/api/v1/entries/withdrawals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(withdrawal),
  }).then(responseOrError);
};

const saveDeposit = (
  accessToken: string,
  deposit: Deposit
): Promise<Deposit> => {
  return fetch(`${config.api}/api/v1/entries/deposits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deposit),
  }).then(responseOrError);
};

const saveTaxes = (accessToken: string, taxes: Taxes): Promise<Taxes> => {
  return fetch(`${config.api}/api/v1/entries/taxes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taxes),
  }).then(responseOrError);
};

const saveDividend = (
  accessToken: string,
  dividend: Dividend
): Promise<Dividend> => {
  return fetch(`${config.api}/api/v1/entries/dividends`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dividend),
  }).then(responseOrError);
};

const saveTrade = (accessToken: string, dividend: Trade): Promise<Trade> => {
  return fetch(`${config.api}/api/v1/entries/trades`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dividend),
  }).then(responseOrError);
};
