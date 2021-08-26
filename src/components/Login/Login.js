import React, { useEffect, useReducer, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const stateReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_CHANGED":
      return {
        ...state,
        email: { value: action.data, valid: action.data.includes("@") },
      };
    case "EMAIL_BLUR":
      return {
        ...state,
        email: { ...state.email, valid: state.email.value.includes("@") },
      };
    case "PASSWORD_CHANGED":
      return {
        ...state,
        password: { value: action.data, valid: action.data.trim().length > 6 },
      };
    case "PASSWORD_BLUR":
      return {
        ...state,
        password: {
          ...state.password,
          valid: state.password.value.trim().length > 6,
        },
      };
    case "FORM_VALIDATION":
      return { ...state, formIsValid: action.data };
    default:
      return state;
  }
};

const initialState = {
  email: {
    value: "",
    valid: null,
  },
  password: {
    value: "",
    valid: null,
  },
  formIsValid: false,
};

const Login = () => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const ctx = useContext(AuthContext);

  const emailInputRef = useRef();
  const pwdInputref = useRef();

  useEffect(() => {
    const callToApi = setTimeout(() => {
      dispatch({
        type: "FORM_VALIDATION",
        data: state.email.valid && state.password.valid,
      });
    }, 500);

    return () => {
      clearTimeout(callToApi);
    };
  }, [state.email.valid, state.password.valid]);

  const emailChangeHandler = (event) => {
    dispatch({ type: "EMAIL_CHANGED", data: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatch({ type: "PASSWORD_CHANGED", data: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatch({ type: "EMAIL_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatch({ type: "PASSWORD_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (state.formIsValid) {
      ctx.onLogin(state.email.value, state.password.value);
    } else if (!state.email.valid) {
      emailInputRef.current.focus();
    } else {
      pwdInputref.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          type="email"
          label="E-Mail"
          ref={emailInputRef}
          value={state.email.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          ref={pwdInputref}
          value={state.password.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
