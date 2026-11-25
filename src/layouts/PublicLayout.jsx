import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EnquiryModal from '../components/common/EnquiryModal';

const PublicLayout = () => {
  const location = useLocation();
  const isThreePanelPage =
    location.pathname === '/courses' ||
    location.pathname === '/universities' ||
    location.pathname === '/exams' ||
    location.pathname === '/services' ||
    location.pathname === '/blogs';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-white text-brand-darkText relative ${
        isThreePanelPage ? 'h-screen overflow-hidden' : ''
      }`}
    >
      <Navbar />
      <main className={`flex-1 w-full ${isThreePanelPage ? 'overflow-hidden flex flex-col' : ''}`}>
        <Outlet />
      </main>
      {!isThreePanelPage && <Footer />}
      <EnquiryModal />
    </div>
  );
};

export default PublicLayout;
