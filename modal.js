// credit goes to:
// Kent C. Dodds https://kentcdodds.com/
// Maximilian Schwarzmüller https://academind.com/

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach((fn) => fn && fn(...args));

/*
  Add
  <div id="background"></div>
  <div id="modal"></div>
  in your html, so that you can plug Background and Modal
 */

const Background = () => {
  const [, setIsVisible] = React.useContext(ModalContext);

  return ReactDOM.createPortal(
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: 'black',
        opacity: '0.3',
        zIndex: '10',
      }}
      onClick={() => setIsVisible(false)}
    />,
    document.getElementById('background')
  );
};

const ModalContext = React.createContext({
  isVisible: false,
  setIsVisible: () => {},
});

const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <ModalContext.Provider value={[isVisible, setIsVisible]}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalOverlay = ({ children }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

const ModalOpenButton = ({ children: child }) => {
  const [, setIsVisible] = React.useContext(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsVisible(true), child.props.onClick),
  });
};

const ModalCloseButton = ({ children: child }) => {
  const [, setIsVisible] = React.useContext(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsVisible(false), child.props.onClick),
  });
};

const Modal = ({ children }) => {
  const [isVisible] = React.useContext(ModalContext);
  if (!isVisible) {
    return;
  }

  return ReactDOM.createPortal(
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          backgroundColor: 'white',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid black',
          borderRadius: '5px',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '20',
        }}
      >
        {children}
      </div>
      <Background />
    </>,
    document.getElementById('modal')
  );
};

const ModalTitle = ({ children }) => {
  return children;
};

const ModalBody = ({ children }) => {
  return children;
};

const ModalFooter = ({ style, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: '10px',
        padding: '5px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const App = () => {
  return (
    <>
      <h1>Hello App!</h1>
      <ModalOverlay>
        <ModalOpenButton>
          <button>Show Modal</button>
        </ModalOpenButton>
        <Modal>
          <ModalTitle>
            <h1>Modal Title</h1>
          </ModalTitle>
          <ModalBody>
            <p>Modal content goes here</p>
          </ModalBody>
          <ModalFooter>
            <ModalCloseButton>
              <button>Cancel</button>
            </ModalCloseButton>
          </ModalFooter>
        </Modal>
      </ModalOverlay>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
