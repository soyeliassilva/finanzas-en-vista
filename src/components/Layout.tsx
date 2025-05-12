
import React from 'react';
import { Outlet } from 'react-router-dom';
import StepsHeader from './StepsHeader';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <StepsHeader currentStep={1} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
