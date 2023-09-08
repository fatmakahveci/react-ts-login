'use client';

import AuthContext from '@/app/store/auth-context';
import { EmailProps, PasswordProps } from '@/shared/types/Types';
import { ChangeEvent, FormEvent, useContext, useEffect, useReducer, useRef, useState } from 'react';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import './Login.css';

const emailReducer = (state: EmailProps["type"], action: EmailProps["action"]): any => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.includes('@')};
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@')};
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state: PasswordProps["type"], action: PasswordProps["action"]): any => {
  if (action.type === 'USER_INPUT') {
    return { value: action.value, isValid: action.value.trim().length > 6};
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6};
  }
  return { value: '', isValid: false };
};

const Login = (): JSX.Element => {
  const [formIsValid, setFormIsValid] = useState<boolean | null>(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
    dispatchEmail({ type: 'INPUT_BLUR' });
  };
  
  const validatePasswordHandler = (): void => {  
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current?.focus();
    } else {
      passwordInputRef.current?.focus();
    }
  };

  return (
    <Card cssName="login">
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          isValid={emailIsValid}
          label="E-mail"
          onBlur={validateEmailHandler}
          onChange={emailChangeHandler}
          type="email"
          value={emailState.value}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          isValid={passwordIsValid}
          label="Password"
          onBlur={validatePasswordHandler}
          onChange={passwordChangeHandler}
          type="password"
          value={passwordState.value}
        />
        <div className="actions">
          <Button type="submit" className="btn">
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
