
import React from 'react';
import { Outlet } from 'react-router-dom';
import StepsHeader from './StepsHeader';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <StepsHeader currentStep={1} />
      <main className="flex-grow pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
