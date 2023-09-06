'use client';

import { FC, useEffect, useState } from 'react';

import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import './Login.css';
import { LoginProps } from '@/shared/types/Types';

const Login: FC<LoginProps> = ({ onLogin }) => {
  const [enteredEmail, setEnteredEmail] = useState<string>('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();
  const [formIsValid, setFormIsValid] = useState<boolean>(false);

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  // useEffect(() => {
  //   const identifier = setTimeout(() => {
  //     console.log('Checking form validity!');
  //     setFormIsValid(
  //       enteredEmail.includes('@') && enteredPassword.trim().length > 6
  //     );
  //   }, 500);

  //   return () => {
  //     console.log('CLEANUP');
  //     clearTimeout(identifier);
  //   };
  // }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (e: any) => {
    setEnteredEmail(e.target.value);

    setFormIsValid(
      e.target.value.includes('@') && enteredPassword.trim().length > 6
    );
  };

  const passwordChangeHandler = (e: any) => {
    setEnteredPassword(e.target.value);

    setFormIsValid(
      enteredEmail.includes('@') && e.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes('@'));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card cssName="login">
      <form onSubmit={submitHandler}>
        <div className={`control ${passwordIsValid === false ? 'invalid' : ''}`}>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div className={`control ${passwordIsValid === false ? 'invalid' : ''}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
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
