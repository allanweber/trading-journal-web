import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "lib/authentication";
import { config } from "lib/config";
import { Portfolio, PortfolioBalance } from "model/portfolio";
import { responseOrError } from "./response";

export const useAllPortfolios = () => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const accessToken = await getToken();
      return getAllPortfolios(accessToken!);
    },
  });
};

export const useGetPortfolio = (id?: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [`portfolio-${id}`],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const accessToken = await getToken();
      return getPortfolio(accessToken!, id);
    },
  });
};

export const useGetPortfolioBalance = (id: string) => {
  const { getToken } = useAuthState();

  return useQuery({
    queryKey: [`balance-${id}`],
    queryFn: async () => {
      const accessToken = await getToken();
      return getPortfolioBalance(accessToken!, id);
    },
    enabled: !!id,
  });
};

export const useSavePortfolio = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolio: Portfolio) => {
      const accessToken = await getToken();
      return createPortfolio(accessToken!, portfolio);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
      queryClient.invalidateQueries({
        queryKey: [`portfolio-${data.id}`],
      });
    },
  });
};

export const useDeletePortfolio = () => {
  const { getToken } = useAuthState();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const accessToken = await getToken();
      return deletePortfolio(accessToken!, id);
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
  });
};

const getAllPortfolios = (accessToken: string): Promise<Portfolio[]> => {
  return fetch(`${config.api}/api/v1/portfolios`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const getPortfolio = (accessToken: string, id: string): Promise<Portfolio> => {
  return fetch(`${config.api}/api/v1/portfolios/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const getPortfolioBalance = (accessToken: string, id: string): Promise<PortfolioBalance> => {
  return fetch(`${config.api}/api/v1/portfolios/${id}/balance`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};

const createPortfolio = (accessToken: string, portfolio: Portfolio): Promise<Portfolio> => {
  return fetch(`${config.api}/api/v1/portfolios`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(portfolio),
  }).then(responseOrError);
};

const deletePortfolio = (accessToken: string, id: string): Promise<string> => {
  return fetch(`${config.api}/api/v1/portfolios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then(responseOrError);
};
