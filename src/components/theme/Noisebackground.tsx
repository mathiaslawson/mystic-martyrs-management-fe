import React from 'react';

export default function Noisebackground() {
  return (
    <div className="flex sm:h-[100svh] h-full  bg-neutral-600 absolute inset-0 z-0 opacity-[0.9]">
      <svg width="0" height="0">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="3.5" 
            stitchTiles="stitch" />
          <feColorMatrix 
            in="colorNoise" 
            type="matrix" 
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 " />
          <feComposite 
            operator="in" 
            in2="SourceGraphic" 
            result="monoNoise" />
          <feBlend 
            in="SourceGraphic" 
            in2="monoNoise" 
            mode="screen" />
        </filter>
      </svg>
      <div 
        className="w-full h-full bg-purple-600" 
        style={{ filter: "url(#noiseFilter)" }}>
        {/* <p className="text-white text-center mt-28">Noisy Box</p> */}
      </div>
    </div>
  );
}