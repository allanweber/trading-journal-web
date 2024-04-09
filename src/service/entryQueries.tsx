import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "lib/authentication";
import { config } from "lib/config";
import { Deposit, Dividend, Entry, ExitEntry, Stock, Taxes, Withdrawal } from "model/entry";
import { ImageUploaded } from "model/fileUploaded";
import { Paginated } from "model/pagination";
import { responseOrError } from "./response";

export const useGetEntries = (
  portfolioId: string,
  query?: string,
  type?: string,
  status?: string,
  direction?: string,
  pageSize?: string,
  page?: string
) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [
      "entries",
      `entries-${query}-${portfolioId}-${type}-${status}-${direction}-${pageSize}-${page}`,
    ],
    queryFn: async () => {
      const accessToken = await getToken();
      return getEntries(accessToken!, portfolioId, query, type, status, direction, pageSize, page);
    },
  });
};

export const useGetPortfolioEntries = (portfolioId: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: ["portfolio-entries"],
    queryFn: async () => {
      const accessToken = await getToken();
      return getPortfolioEntries(accessToken!, portfolioId);
    },
  });
};

export const useGetEntry = (portfolioId: string, id?: string) => {
  const { getToken } = useAuthState();
  return useQuery({
    queryKey: [`entry-${id}`],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const accessToken = await getToken();
      return getEntry(accessToken!, portfolioId, id);
    },
  });
};

export const useDeleteEntry = (portfolioId: string) => {
  const { getToken } = useAuthState();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const accessToken = await getToken();
      return deleteEntry(accessToken!, portfolioId, id);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      });
      queryClient.invalidateQueries({
        queryKey: ["portfolio-entries"],
      });
      queryClient.invalidateQueries({
        queryKey: [`balance-${portfolioId}`],
      });
    },
  });
};

export const useSaveEntry = (portfolioId: string, id?: string) => {
  const { getToken } = useAuthState();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Stock | Deposit | Withdrawal | Taxes | Dividend) => {
      const accessToken = await getToken();
      if (id) {
        return editEntry(accessToken!, portfolioId, id, entry);
      }
      return createEntry(accessToken!, portfolioId, entry);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      });
      queryClient.invalidateQueries({
        queryKey: ["portfolio-entries"],
      });
      queryClient.invalidateQueries({
        queryKey: [`balance-${portfolioId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`entry-${data.id}`],
      });
    },
  });
};

export const useCloseEntry = (portfolioId: string, entryId: string) => {
  const { getToken } = useAuthState();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exitEntry: ExitEntry) => {
      const accessToken = await getToken();
      return closeEntry(accessToken!, portfolioId, entryId, exitEntry);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["entries"],
      });
      queryClient.invalidateQueries({
        queryKey: [`balance-${portfolioId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`entry-${data.id}`],
      });
    },
  });
};

export const useGetImages = (portfolioId: string, entryId: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [`images-${entryId}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getImages(accessToken!, portfolioId, entryId);
    },
  });
};

export const useDeleteImage = (portfolioId: string, entryId: string) => {
  const { getToken } = useAuthState();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const accessToken = await getToken();
      return deleteImage(accessToken!, portfolioId, entryId, imageId);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [`images-${entryId}`],
      });
    },
  });
};

export const useUpdateNotes = (portfolioId: string, entryId: string) => {
  const { getToken } = useAuthState();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notes: string) => {
      const accessToken = await getToken();
      return updateNotes(accessToken!, portfolioId, entryId, notes);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [`entry-${entryId}`],
      });
    },
  });
};

const getEntries = (
  accessToken: string,
  portfolioId: string,
  query?: string,
  type?: string,
  status?: string,
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
  if (status) {
    url = `${url}status=${status}&`;
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

const getPortfolioEntries = (accessToken: string, portfolioId: string): Promise<Entry[]> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/balances`, {
    method: "GET",
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

const closeEntry = (
  accessToken: string,
  portfolioId: string,
  entryId: string,
  exitEntry: ExitEntry
): Promise<Entry> => {
  return fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}/close`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exitEntry),
  }).then(responseOrError);
};

const getImages = (
  accessToken: string,
  portfolioId: string,
  entryId: string
): Promise<ImageUploaded[]> =>
  fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}/images`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);

const deleteImage = (
  accessToken: string,
  portfolioId: string,
  entryId: string,
  imageId: string
): Promise<string> =>
  fetch(
    `${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}/images/${encodeURIComponent(
      imageId
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  ).then(responseOrError);

const updateNotes = (
  accessToken: string,
  portfolioId: string,
  entryId: string,
  notes: string
): Promise<string> =>
  fetch(`${config.api}/api/v1/portfolios/${portfolioId}/entries/${entryId}/notes`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  }).then(responseOrError);
