import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { ReactNode } from 'react';

export const AuthContext = ({ children }: { children: ReactNode }) => {
  return (
    <KindeProvider
      clientId={process.env.REACT_APP_KINDE_CLIENT_ID!}
      domain={process.env.REACT_APP_KINDE_DOMAIN!}
      redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URI!}
      logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URI!}
    >
      {children}
    </KindeProvider>
  );
};
