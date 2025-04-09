
import React from 'react';
import Logo from './Logo';
import { ChevronRight } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="bg-primary w-full py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        <a href="#" className="bg-accent text-primary px-4 py-2 rounded-md flex items-center gap-2">
          Conoce tu perfil de ahorro <ChevronRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
