import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePortfolioContext } from "contexts/PortfolioContext";
import { useAuthState } from "lib/authentication";
import { config } from "lib/config";
import { Deposit, Dividend, Entry, Stock, Taxes, Withdrawal } from "model/entry";
import { Paginated } from "model/pagination";
import { responseOrError } from "./response";

export const useGetEntries = (
  query?: string,
  type?: string,
  direction?: string,
  pageSize?: string,
  page?: string
) => {
  const { getToken } = useAuthState();
  const { portfolio } = usePortfolioContext();

  return useQuery({
    queryKey: [
      "entries",
      `entries-${query}-${portfolio?.id}-${type}-${direction}-${pageSize}-${page}`,
    ],
    queryFn: async () => {
      const accessToken = await getToken();
      return getEntries(accessToken!, portfolio?.id!, query, type, direction, pageSize, page);
    },
  });
};

export const useGetEntry = (id: string) => {
  const { getToken } = useAuthState();
  const { portfolio } = usePortfolioContext();

  return useQuery({
    queryKey: [`entry-${id}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getEntry(accessToken!, portfolio?.id!, id);
    },
  });
};

export const useDeleteEntry = () => {
  const { getToken } = useAuthState();
  const { portfolio } = usePortfolioContext();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const accessToken = await getToken();
      return deleteEntry(accessToken!, portfolio?.id!, id);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      });
      queryClient.invalidateQueries({
        queryKey: [`balance-${portfolio?.id}`],
      });
    },
  });
};

export const useSaveEntry = (id: string | undefined) => {
  const { getToken } = useAuthState();
  const { portfolio } = usePortfolioContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Stock | Deposit | Withdrawal | Taxes | Dividend) => {
      const accessToken = await getToken();
      if (id) {
        return editEntry(accessToken!, portfolio?.id!, id, entry);
      }
      return createEntry(accessToken!, portfolio?.id!, entry);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      });
      queryClient.invalidateQueries({
        queryKey: [`balance-${portfolio?.id}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`entry-${data.id}`],
      });
    },
  });
};

const getEntries = (
  accessToken: string,
  portfolioId: string,
  query?: string,
  type?: string,
  direction?: string,
  pageSize?: string,
  page?: string
): Promise<Paginated<Entry>> => {
  let url = `${config.api}/api/v1/portfolios/${portfolioId}/entries?`;

  if (query) {
    url = `${url}query=${query}&`;
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
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const getEntry = (accessToken: string, portfolioId: string, id: string): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const deleteEntry = (accessToken: string, portfolioId: string, id: string): Promise<string> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const createEntry = (
  accessToken: string,
  portfolioId: string,
  dividend: Stock | Deposit | Withdrawal | Taxes | Dividend
): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dividend),
  }).then(responseOrError);
};

const editEntry = (
  accessToken: string,
  portfolioId: string,
  entryId: string,
  dividend: Stock | Deposit | Withdrawal | Taxes | Dividend
): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dividend),
  }).then(responseOrError);
};
