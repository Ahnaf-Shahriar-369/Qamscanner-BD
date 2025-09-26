// ImageViewer.tsx
import React, { useState, useEffect, useRef } from 'react';

interface ImageViewerProps {
  files: File[];
  onBack: () => void;
  onConvert: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ files, onBack, onConvert }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [files]);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % files.length);
    resetTransformations();
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + files.length) % files.length);
    resetTransformations();
  };

  const resetTransformations = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (imagePreviews.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 [mask:padding-box_borde-box] [border:2px_solid_transparent] animate-pulse shadow-[0_0_20px_rgba(100,100,255,0.2)]"></div>
        
        {/* Header */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="group-hover:animate-pulse">← Back</span>
          </button>
          
          <div className="text-center">
            <span className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent shadow-lg shadow-blue-500/30 animate-pulse">
              Image {currentImageIndex + 1} of {files.length}
            </span>
          </div>
          
          <button 
            onClick={onConvert}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <span className="group-hover:animate-pulse">Convert to PDF</span>
          </button>
        </div>

        {/* Image Controls */}
        <div className="p-4 flex justify-center gap-3 relative z-10">
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
          >
            <span className="hover:animate-pulse">-</span>
          </button>
          <button 
            onClick={resetTransformations}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
          >
            <span className="hover:animate-pulse">Reset</span>
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
          >
            <span className="hover:animate-pulse">+</span>
          </button>
          <button 
            onClick={handleRotate}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
          >
            <span className="hover:animate-spin">↻</span>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
          >
            <span className="hover:animate-pulse">{isFullscreen ? '✕' : '⛶'}</span>
          </button>
        </div>

        {/* Image Display */}
        <div 
          className="relative h-[60vh] flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 border border-white/20 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(100,100,255,0.2)]"></div>
            <img 
              ref={imageRef}
              src={imagePreviews[currentImageIndex]} 
              alt={`Preview ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10 transition-transform duration-300"
              style={{ 
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
          
          {/* Navigation Arrows */}
          {files.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 animate-pulse"
              >
                <span className="hover:animate-pulse">&larr;</span>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 animate-pulse"
              >
                <span className="hover:animate-pulse">&rarr;</span>
              </button>
            </>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="p-4 flex justify-center relative z-10">
          <div className="flex gap-2">
            {files.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  resetTransformations();
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-blue-500 scale-125 animate-pulse shadow-lg shadow-blue-500/50' 
                    : 'bg-gray-600 hover:bg-gray-500 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {files.length > 1 && (
          <div className="p-4 flex justify-center gap-2 overflow-x-auto pb-6 relative z-10">
            {imagePreviews.map((preview, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  resetTransformations();
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/30 animate-pulse' 
                    : 'border-gray-600 hover:border-gray-400 hover:scale-105'
                }`}
              >
                <img 
                  src={preview} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;