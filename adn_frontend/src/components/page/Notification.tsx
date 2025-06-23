import React from 'react';
import { NavLink } from 'react-router-dom';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Lớp phủ mờ phía sau modal với hiệu ứng backdrop blur */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm z-40 animate-pulse"
        onClick={onClose}
      ></div>

      {/* Modal với hiệu ứng glassmorphism và animation */}
      <div className="relative bg-white/95 backdrop-blur-xl p-12 rounded-[2rem] shadow-2xl border border-white/20 w-[28rem] z-50 transform transition-all duration-700 ease-out animate-in slide-in-from-bottom-4 fade-in-0">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-cyan-50/50 rounded-[2rem] -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
        
        {/* Header với icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            {title}
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mx-auto"></div>
        </div>

        <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed font-medium">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          {/* Nút Hành Chính với hiệu ứng nâng cao */}
          <NavLink
            to="/service/administrative"
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 w-full text-center overflow-hidden"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Hành Chính
            </span>
          </NavLink>

          {/* Nút Dân Sự với hiệu ứng nâng cao */}
          <NavLink
            to="/service/civil"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 w-full text-center overflow-hidden"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Dân Sự
            </span>
          </NavLink>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:rotate-90 group"
        >
          <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;