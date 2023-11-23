import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Login = () => {
  const { login, register } = useKindeAuth();
  return (
    <>
      <button onClick={() => register()} type="button">
        Sign up
      </button>
      <button onClick={() => login()} type="button">
        Sign In
      </button>
    </>
  );
};
