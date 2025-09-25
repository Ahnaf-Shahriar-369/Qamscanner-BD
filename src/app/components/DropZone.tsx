// DropZone.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropZoneProps {
  onFileSelect: (files: FileList) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    fileInputRef.current?.click();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
        isDragging 
          ? 'border-blue-400 bg-blue-500/10' 
          : isHovered 
            ? 'border-blue-300 bg-blue-400/5' 
            : 'border-blue-200 bg-blue-400/3'
      } ${isClicked ? 'scale-95' : ''}`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(17, 25, 40, 0.3)',
        border: `2px solid rgba(33, 150, 243, ${isDragging ? 0.5 : 0.3})`,
        boxShadow: `0 0 20px rgba(0, 195, 255, ${isDragging ? 0.4 : 0.2})`,
        color: 'white',
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out',
        animation: isDragging ? 'pulse 1s infinite' : 'none',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 20px rgba(0, 195, 255, 0.2); }
          50% { box-shadow: 0 0 30px rgba(0, 195, 255, 0.4); }
          100% { box-shadow: 0 0 20px rgba(0, 195, 255, 0.2); }
        }
        
        .drop-zone:hover {
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(0, 195, 255, 0.3);
        }
        
        .drop-zone:active {
          transform: scale(0.98);
        }
        
        @media (max-width: 640px) {
          .drop-zone {
            padding: 1rem;
            min-height: 150px;
          }
          
          .drop-zone svg {
            width: 80px;
            height: 80px;
          }
          
          .drop-zone h3 {
            font-size: 1.25rem;
          }
          
          .drop-zone p {
            font-size: 0.875rem;
          }
        }
      `}</style>
      
      <div className="text-center">
        <div className="mb-4 transition-transform duration-300 ease-in-out">
          <svg 
            className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-300 transition-colors duration-300 ${
              isDragging ? 'text-blue-400 animate-bounce' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-all duration-300 ${
          isDragging ? 'text-blue-300' : 'text-white'
        }`}>
          {isDragging ? 'Drop files here!' : 'Drop your JPG files here'}
        </h3>
        <p className={`mb-4 transition-colors duration-300 ${
          isDragging ? 'text-blue-200' : 'text-blue-200'
        }`}>
          {isDragging ? 'Releasing will upload...' : 'or click to browse files'}
        </p>
        
        <div className="text-sm opacity-80 transition-opacity duration-300">
          Supports multiple files • Max size: 50MB per file
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default DropZone;