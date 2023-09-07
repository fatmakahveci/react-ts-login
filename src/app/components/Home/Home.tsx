'use client';

import { LogoutProps } from '@/shared/types/Types';
import { FC } from 'react';
import Card from '../UI/Card/Card';
import './Home.css';

const Home: FC<LogoutProps> = ({ onLogout }) => {
  return (
    <Card cssName="home">
      <h1>Welcome back!</h1>
    </Card>
  );
};
export default Home;