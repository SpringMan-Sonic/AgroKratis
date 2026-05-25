import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-green-100 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Header;