'use client';

import { EmailProps, LoginProps, PasswordProps } from '@/shared/types/Types';
import { ChangeEvent, FC, FormEvent, useContext, useEffect, useReducer, useState } from 'react';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import './Login.css';
import AuthContext from '@/app/store/auth-context';

const emailReducer = (state: EmailProps["type"], action: EmailProps["action"]) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.includes('@')};
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@')};
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state: PasswordProps["type"], action: PasswordProps["action"]) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.trim().length > 6};
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6};
  }
  return { value: '', isValid: false };
};

const Login = (): JSX.Element => {
  const [formIsValid, setFormIsValid] = useState<boolean>(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: false });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: false });

  const authCtx = useContext(AuthContext);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatchEmail({ type: 'USER_INPUT', value: e.target.value });
  };

  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatchPassword({ type: 'USER_INPUT', value: e.target.value });
  };

  const validateEmailHandler = (): void => {
    dispatchEmail({ type: 'INPUT_BLUR', isValid: emailState.isValid });
  };
  
  const validatePasswordHandler = (): void => {  
    dispatchPassword({ type: 'INPUT_BLUR', isValid: passwordState.isValid });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card cssName="login">
      <form onSubmit={submitHandler}>
        <div className={`control ${emailState.isValid === false ? 'invalid' : ''}`}>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div className={`control ${passwordState.isValid === false ? 'invalid' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className="actions">
          <Button type="submit" className="btn" disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
