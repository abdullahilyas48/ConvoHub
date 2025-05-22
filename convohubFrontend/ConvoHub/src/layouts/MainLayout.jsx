import React from 'react';
import bckg from '../assets/images/bckg.png';

const MainLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bckg})`,
      }}
    >
      {children}
    </div>
  );
};

export default MainLayout;
