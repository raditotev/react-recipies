// credit goes to:
// Maximilian Schwarzmüller https://academind.com/

/*
Input and form validation example

Each input field is required to have at least one character
Each input filed upon initial load doesn't show error.
But if user enters and leaves field without entering text it will show an error.
Form is invalid until any of the input fields are invalid
*/
import { useReducer, useEffect, useCallback } from 'react';

const CHANGE = 'CHANGE';
const TOUCH = 'TOUCH';

const inputReducer = (state, action) => {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.value.trim() !== '', // basic check for demonstration purpose
      };
    case TOUCH:
      return {
        ...state,
        isTouched: true,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};
const Input = ({
  id,
  label,
  type,
  element,
  onInput,
  errorMessage,
  value,
  valid,
  ...props
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: value || '',
    isValid: valid || false,
    isTouched: false,
  });

  const { value, isValid } = inputState;

  useEffect(() => {
    onInput({ id, value, isValid });
  }, [onInput, id, value, isValid]);

  const changeHandler = (event) => {
    dispatch({ type: CHANGE, value: event.target.value });
  };

  const blurHandler = () => {
    dispatch({ type: TOUCH });
  };

  const input =
    element === 'input' ? (
      <input
        name={id}
        id={id}
        type={type}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
        {...props}
      />
    ) : (
      <textarea
        name={id}
        id={id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
        {...props}
      />
    );
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {input}
      {!inputState.isValid && inputState.isTouched ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : null}
    </div>
  );
};

const formReducer = (state, action) => {
  switch (action.type) {
    case CHANGE:
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const useForm = (initialState = {}) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const inputHandler = useCallback(({ id, value, isValid }) => {
    dispatch({ type: CHANGE, id, value, isValid });
  }, []);

  return [formState, inputHandler];
};

const NewForm = () => {
  const [formState, inputHandler] = useForm(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: '',
      },
      description: {
        value: '',
        isValid: '',
      },
    },
    isValid: false,
  });

  const submitNewHandler = (event) => {
    event.preventDefault();

    // handle form submission
    console.log(formState.inputs);
  };

  return (
    <form onSubmit={submitNewHandler}>
      <Input
        id="title"
        label="Title"
        type="text"
        element="input"
        errorMessage="Please enter valid title"
        onInput={inputHandler}
      />
      <Input
        id="description"
        label="Description"
        element="textarea"
        errorMessage="Please enter valid description"
        onInput={inputHandler}
      />
      <button type="submit" disabled={!formState.isValid}>
        Submit
      </button>
    </form>
  );
};

const UpdateForm = (place) => {
  const [formState, inputHandler] = useForm(formReducer, {
    inputs: {
      title: {
        value: place.title,
        isValid: true,
      },
      description: {
        value: place.description,
        isValid: true,
      },
    },
    isValid: true,
  });

  const submitUpdateHandler = (event) => {
    event.preventDefault();

    // handle form submission
    console.log(formState.inputs);
  };

  return (
    <form onSubmit={submitUpdateHandler}>
      <Input
        id="title"
        label="Title"
        type="text"
        element="input"
        errorMessage="Please enter valid title"
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        label="Description"
        element="textarea"
        errorMessage="Please enter valid description"
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.description.isValid}
      />
      <button type="submit" disabled={!formState.isValid}>
        Submit
      </button>
    </form>
  );
};
