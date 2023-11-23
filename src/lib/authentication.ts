import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const useAuthState = () => {
  return useKindeAuth();
};
