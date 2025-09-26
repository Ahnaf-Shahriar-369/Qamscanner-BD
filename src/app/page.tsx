// App.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DropZone from './components/DropZone';
import ImageViewer from './components/ImageViewer';

export default function Page() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Set initial value
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Choose image based on screen size
  const backgroundImage = 
    screenSize === 'mobile' ? '/d.webp' :
    screenSize === 'tablet' ? '/t.jfif' :
    '/t.webp'; // desktop

  const altText =
    screenSize === 'mobile' ? 'Mobile background' :
    screenSize === 'tablet' ? 'Tablet background' :
    'Desktop background';

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setIsViewing(true);
  };

  const handleBack = () => {
    setIsViewing(false);
  };

  const handleConvert = () => {
    // This will be implemented later with ConvertAPI
    alert('Converting to PDF...');
  };

  return (
    <>
      {/* Global reset */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>

      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}>

        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 1,
          transition: 'opacity 0.5s ease-in-out'
        }}>
          <Image
            src={backgroundImage}
            alt={altText}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Overlay content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
          {!isViewing ? (
            <DropZone onFileSelect={handleFileSelect} />
          ) : (
            <ImageViewer 
              files={selectedFiles} 
              onBack={handleBack} 
              onConvert={handleConvert} 
            />
          )}
        </div>
      </div>
    </>
  );
}