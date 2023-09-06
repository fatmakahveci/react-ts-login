'use client';

import { HomeProps } from '@/shared/types/Types';
import React, { FC } from 'react';
import Card from '../UI/Card/Card';
import './Home.css';

const Home: FC<HomeProps> = ({ onLogout }) => {
  return (
    <Card cssName="home">
      <h1>Welcome back!</h1>
    </Card>
  );
};
export default Home;