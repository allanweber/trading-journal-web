import { useMutation } from "@tanstack/react-query";
import { config } from "lib/config";
import { responseOrError } from "./response";

export const usePostMe = () => {
  return useMutation({
    mutationFn: async (user: any) => {
      return postMe(user);
    },
  });
};

const postMe = (user: any): Promise<any> => {
  return fetch(`${config.api}/api/v1/users/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(responseOrError);
};
