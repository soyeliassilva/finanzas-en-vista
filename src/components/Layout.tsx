
import React from 'react';
import { Outlet } from 'react-router-dom';
import StepsHeader from './StepsHeader';

// Added 1rem vertical padding to match left/right padding.
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light py-4">
      <StepsHeader currentStep={1} />
      <main className="flex-grow pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
