import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Button } from 'components/ui/button';

export const Login = () => {
  const { login, register } = useKindeAuth();
  return (
    <>
      <Button onClick={() => register()} type="button">
        Sign up
      </Button>
      <Button onClick={() => login()} type="button">
        Sign In
      </Button>
    </>
  );
};
