import React from 'react';

export const JazzCashGlossyBadge: React.FC<{ size?: number; className?: string }> = ({ size = 96, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Outer Silver/White Beveled Ring */}
        <linearGradient id="jc-outer-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#EDE5E6" />
          <stop offset="55%" stopColor="#D9C9CB" />
          <stop offset="85%" stopColor="#E8DFE0" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="jc-rim-groove" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9B4B6" />
          <stop offset="100%" stopColor="#EDE3E4" />
        </linearGradient>
        
        {/* Deep Glossy Ruby Crimson Core */}
        <radialGradient id="jc-crimson-dome" cx="42%" cy="32%" r="68%" fx="35%" fy="25%">
          <stop offset="0%" stopColor="#A8152D" />
          <stop offset="45%" stopColor="#6E0518" />
          <stop offset="80%" stopColor="#3B010B" />
          <stop offset="100%" stopColor="#1A0004" />
        </radialGradient>

        {/* Top Gloss Arc */}
        <linearGradient id="jc-top-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* 3D Yellow Left Crescent */}
        <linearGradient id="jc-crescent-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF266" />
          <stop offset="35%" stopColor="#FFC800" />
          <stop offset="80%" stopColor="#E68A00" />
          <stop offset="100%" stopColor="#B35E00" />
        </linearGradient>

        {/* 3D Red Right Crescent */}
        <linearGradient id="jc-crescent-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D63" />
          <stop offset="40%" stopColor="#E60D28" />
          <stop offset="80%" stopColor="#A30013" />
          <stop offset="100%" stopColor="#66000B" />
        </linearGradient>
        
        {/* Bevel Highlights */}
        <linearGradient id="crescent-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Drop Shadow */}
        <filter id="badge-shadow" x="-15%" y="-15%" width="130%" height="135%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2E040B" floodOpacity="0.28" />
        </filter>
        <filter id="crescent-drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Outer White Bevel Ring */}
      <circle cx="60" cy="60" r="56" fill="url(#jc-outer-ring)" stroke="#EAE0E2" strokeWidth="1" filter="url(#badge-shadow)" />
      {/* Inner Groove Line */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#jc-rim-groove)" strokeWidth="1.2" opacity="0.9" />
      {/* Dark Rim Separation */}
      <circle cx="60" cy="60" r="46" fill="#1A0105" />

      {/* Ruby Crimson Sphere */}
      <circle cx="60" cy="60" r="45" fill="url(#jc-crimson-dome)" />

      {/* Gloss reflection ellipse */}
      <ellipse cx="60" cy="36" rx="33" ry="17" fill="url(#jc-top-gloss)" />

      {/* Yellow Left Crescent (Smooth 3D form) */}
      <g filter="url(#crescent-drop)">
        <path
          d="M 45 35 C 47.5 35 49 36.8 50 39.5 C 54.5 48 54.5 66 45 76 C 41 80 37 82 34 81.5 C 33 81.2 32.5 80.2 33 79.2 C 37 73.5 39.5 65.5 39 57 C 38.5 48 35.5 42 33.5 38.5 C 32.8 37.5 33.2 36.2 34.5 35.8 C 37.5 35.2 41.5 35 45 35 Z"
          fill="url(#jc-crescent-yellow)"
        />
        {/* Yellow Crescent Top Bevel */}
        <path
          d="M 45 35 C 47.5 35 49 36.8 50 39.5 C 49 43 45 48 40 47 C 36 46 34.5 40 33.5 38.5 C 32.8 37.5 33.2 36.2 34.5 35.8 C 37.5 35.2 41.5 35 45 35 Z"
          fill="url(#crescent-highlight)"
        />
      </g>

      {/* Red Right Crescent (Smooth 3D form) */}
      <g filter="url(#crescent-drop)">
        <path
          d="M 75 35.5 C 76.8 36.2 77.8 37.8 77 40 C 72.5 48.5 72.5 66.5 82 76.5 C 83.2 78 82.8 79.8 81.5 80.5 C 78.5 82 73.5 81.5 69 77 C 61.5 69.5 61.5 51 70 41 C 72 38.5 74 36.5 75 35.5 Z"
          fill="url(#jc-crescent-red)"
        />
        {/* Red Crescent Top Bevel */}
        <path
          d="M 75 35.5 C 76.8 36.2 77.8 37.8 77 40 C 74 44 69 46 66 48 C 65.5 45 68 41 70 41 C 72 38.5 74 36.5 75 35.5 Z"
          fill="url(#crescent-highlight)"
        />
      </g>
    </svg>
  );
};

export const JazzCashLogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 10 2 C 10.8 2 11.8 3.2 12.2 4.8 C 14.5 9.5 14.5 16.5 10 20.8 C 8.5 22 6.5 22.2 5.2 21.8 C 4.8 21.6 4.7 21.1 5 20.6 C 7 17.5 8.2 13.8 8 10 C 7.8 6.5 6.2 4 5.2 2.8 C 4.8 2.3 5.1 1.8 5.8 1.6 C 7.2 1.3 8.8 2 10 2 Z"
        fill="#FFBA00"
      />
      <path
        d="M 18 2.5 C 19 3 19.5 3.8 19 5 C 16.8 9.5 16.8 17 21.2 21 C 21.8 21.6 21.5 22.4 20.7 22.7 C 19 23.2 16.5 23 14.5 20.5 C 11.2 17 11.2 9 15.5 4.5 C 16.5 3.5 17.3 2.8 18 2.5 Z"
        fill="#E50914"
      />
    </svg>
  );
};

export const EasypaisaGoldCoin: React.FC<{ size?: number; className?: string }> = ({ size = 96, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Radial Gold Gradient */}
        <radialGradient id="gold-radial" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="25%" stopColor="#E8C36A" />
          <stop offset="60%" stopColor="#C49B38" />
          <stop offset="85%" stopColor="#A27B22" />
          <stop offset="100%" stopColor="#7E5C10" />
        </radialGradient>

        {/* Gold Rim Edge */}
        <linearGradient id="gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="50%" stopColor="#8A6518" />
          <stop offset="100%" stopColor="#FFF2B2" />
        </linearGradient>

        {/* 3D Green Checkmark Gradient */}
        <linearGradient id="green-check" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="35%" stopColor="#00C853" />
          <stop offset="85%" stopColor="#009624" />
          <stop offset="100%" stopColor="#00600F" />
        </linearGradient>

        {/* Checkmark shadow */}
        <filter id="check-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#423105" floodOpacity="0.45" />
        </filter>

        <filter id="coin-shadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#2A2109" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Coin Outer Base */}
      <circle cx="60" cy="60" r="54" fill="url(#gold-rim)" filter="url(#coin-shadow)" />
      <circle cx="60" cy="60" r="51" fill="url(#gold-radial)" />
      
      {/* Subtle Inner Circular Ridge */}
      <circle cx="60" cy="60" r="45" fill="none" stroke="#FEE8A3" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#7A5810" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Brushed metal sheen overlay */}
      <ellipse cx="48" cy="40" rx="32" ry="18" fill="#FFFFFF" fillOpacity="0.22" transform="rotate(-15 48 40)" />

      {/* 3D Green Checkmark */}
      <g filter="url(#check-shadow)">
        <path
          d="M 37 59 C 35.5 57.5 33 57.8 31.8 59.2 C 30.5 60.8 30.8 63 32.2 64.4 L 47 79 C 48.5 80.5 50.8 80.5 52.2 79 L 88 43 C 89.4 41.6 89.4 39.2 88 37.8 C 86.6 36.4 84.2 36.4 82.8 37.8 L 49.5 71 L 37 59 Z"
          fill="url(#green-check)"
          stroke="#00E676"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
        {/* Checkmark glossy top highlight */}
        <path
          d="M 37 59 C 35.5 57.5 33 57.8 31.8 59.2 L 49.5 73.5 L 84 39 C 85.5 37.8 87 38.5 87 39 L 49.5 71 L 37 59 Z"
          fill="#FFFFFF"
          fillOpacity="0.25"
        />
      </g>
    </svg>
  );
};

export const EasypaisaWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 font-sans select-none ${className}`}>
      <span className="text-[#55635B] font-normal text-[13.5px] tracking-tight">Paid via</span>
      <div className="flex items-center gap-1">
        <span className="text-[#00A859] font-extrabold text-[15px] tracking-tight">easy</span>
        <div className="relative inline-flex items-baseline">
          <span className="text-[#1E2522] font-extrabold text-[15px] tracking-tight">paisa</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] absolute -top-0.5 right-[10px]" />
        </div>
        <span className="text-[#55635B] text-[10px] font-semibold tracking-tight ml-0.5">digital bank</span>
      </div>
    </div>
  );
};

export const RaastLogo: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#E07A26] to-[#F59E0B] flex items-center justify-center text-white font-bold text-xs shadow-xs">
        R
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-[#E07A26] text-xs tracking-wider">RAAST</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-tight">Instant Payment</span>
      </div>
    </div>
  );
};

export const OneLinkBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-600 font-semibold ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
      1LINK SWITCH VERIFIED
    </div>
  );
};
