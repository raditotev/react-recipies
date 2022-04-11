const AuthContext = React.createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isInContext: false,
});

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, isInContext: true }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = React.useContext(AuthContext);

  if (!ctx.isInContext) {
    throw new Error('useAuth can only be used inside AuthProvider.');
  }

  return ctx;
};

const App = () => {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <>
      <h1>
        Hello App! User is{' '}
        {isAuthenticated ? 'authenticated' : 'unauthenticated'}
      </h1>
      <button onClick={() => login()}>Login</button>{' '}
      <button onClick={() => logout()}>Logout</button>
    </>
  );
};

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);

