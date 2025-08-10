import React from 'react';

export const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 animate-gradient-x" />
      
      {/* Animated overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-purple-900/20 animate-pulse-slow" />
      
      {/* Moving gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float-diagonal" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-move" />
      </div>
      
      {/* Subtle animated lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-line-horizontal" />
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-line-horizontal-reverse" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-line-vertical" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-pink-500/30 to-transparent animate-line-vertical-reverse" />
      </div>
    </div>
  );
};