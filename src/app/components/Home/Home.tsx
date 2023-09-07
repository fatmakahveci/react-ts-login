'use client';

import AuthContext from '@/app/store/auth-context';
import { useContext } from 'react';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import './Home.css';

const Home = (): JSX.Element => {
  const authCtx = useContext(AuthContext);
  return (
    <Card cssName="home">
      <h1>Welcome back!</h1>
      <Button type="button" onClick={authCtx.onLogout} disabled={false}>Logout</Button>
    </Card>
  );
};
export default Home;