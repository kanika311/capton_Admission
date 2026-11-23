import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EnquiryModal from '../components/common/EnquiryModal';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-brand-darkText relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal />
    </div>
  );
};

export default PublicLayout;
