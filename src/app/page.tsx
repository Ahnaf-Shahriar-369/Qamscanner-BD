'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
 import DropZone from './components/DropZone'

export default function Page() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    // Set initial value
    handleResize()

    // Listen for resize
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Choose image based on screen size
  const backgroundImage = 
    screenSize === 'mobile' ? '/d.webp' :
    screenSize === 'tablet' ? '/t.jfif' :
    '/t.webp' // desktop

  const altText =
    screenSize === 'mobile' ? 'Mobile background' :
    screenSize === 'tablet' ? 'Tablet background' :
    'Desktop background'

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
          // color: 'white',
          // textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          // fontSize: '2rem',
          // fontWeight: 'bold',
          // textAlign: 'center',
          // padding: '1rem'
        }}>
          <DropZone onFileSelect={(files) => {
            console.log('Selected files:', files)
            // Handle file processing here
          }} />
         {/* <div>
            <h1>Responsive Background with Drop Zone</h1>
            <p>Resize the window to see background image change.</p>
            <p>Drag and drop files into the drop zone below:</p>
          </div>  */}
         {/* <div style={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          textAlign: 'center',
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
          fontSize: '1rem'
         }}>
          <p>Background Image: {altText}</p>
         </div> */}
        </div>

      </div>
    </>
  )
}