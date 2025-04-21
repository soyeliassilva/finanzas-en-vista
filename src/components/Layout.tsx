
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import StepsHeader from './StepsHeader';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <StepsHeader currentStep={1} />
      <main className="flex-grow pb-10">
        <Outlet />
      </main>
      <footer className="bg-primary py-4 text-white text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© 2025 Mutualidad. Todos los derechos reservados.</p>
          <p className="mt-1">
            Este simulador ofrece resultados orientativos y no constituye una oferta vinculante.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
