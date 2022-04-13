// Credit: Kent C. Dodds https://kentcdodds.com/

import { client } from './api-client';

function useClient() {
  // imaginary hook returning user object
  const { user } = useAuth();
  const token = user?.token;
  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token }),
    [token]
  );
}
