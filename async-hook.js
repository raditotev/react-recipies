// credit goes to:
// Kent C. Dodds https://kentcdodds.com/

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}

const defaultInitialState = { status: 'idle', data: null, error: null };
function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data) => safeSetState({ data, status: 'resolved' }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error) => safeSetState({ error, status: 'rejected' }),
    [safeSetState]
  );
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }
      safeSetState({ status: 'pending' });
      return promise.then(
        (data) => {
          setData(data);
          return data;
        },
        (error) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

const mockApi = (response) => {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        response === 'fail' ? reject('Failed response') : resolve('Success'),
      1000
    )
  );
};

const App = () => {
  const {
    data,
    error,
    status,
    run,
    isLoading,
    isSuccess,
    isError,
    setData,
    reset,
  } = useAsync();

  return (
    <>
      <h1>Hello App!</h1>
      <button onClick={() => run(mockApi('success'))}>
        Successful call
      </button>{' '}
      <button onClick={() => run(mockApi('fail'))}>Failed call</button>{' '}
      <button onClick={() => setData('Data is set')}>Set data</button>{' '}
      <button onClick={() => reset()}>Reset</button>
      <div>
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span>Status: </span>
          <strong>{status}</strong>
        </div>
        {isLoading ? 'Loading...' : null}
        {isError ? error : null}
        {isSuccess ? data : null}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
