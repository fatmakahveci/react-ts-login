'use client';

import './MainHeader.css';
import Navigation from './Navigation';

const MainHeader = (): JSX.Element => {
  return (
    <header className='main-header'>
      <h1>A Typical Page</h1>
      <Navigation />
    </header>
  );
};

export default MainHeader;
