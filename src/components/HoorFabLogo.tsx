import React from 'react';

interface HoorFabLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'stacked';
  subtitle?: string;
}

export const HoorFabLogo: React.FC<HoorFabLogoProps> = ({ 
  className = '', 
  variant = 'dark',
  size = 'md',
  layout = 'horizontal',
  subtitle
}) => {
  // Color palette matching user's uploaded brand logo (1-removebg-preview.png)
  const emblemColor = variant === 'light' ? '#f5ede2' : variant === 'gold' ? '#d5be9b' : '#b89a78';
  const textColor = variant === 'light' ? '#ffffff' : variant === 'gold' ? '#d4af37' : '#332a21';

  const dimensions = {
    sm: { 
      iconWidth: 26, 
      iconHeight: 38, 
      stackedIconW: 30,
      stackedIconH: 44,
      text: 'text-sm sm:text-base tracking-[0.16em]' 
    },
    md: { 
      iconWidth: 34, 
      iconHeight: 50, 
      stackedIconW: 38,
      stackedIconH: 56,
      text: 'text-lg sm:text-xl tracking-[0.18em]' 
    },
    lg: { 
      iconWidth: 44, 
      iconHeight: 64, 
      stackedIconW: 50,
      stackedIconH: 74,
      text: 'text-2xl sm:text-3xl tracking-[0.2em]' 
    },
    xl: { 
      iconWidth: 54, 
      iconHeight: 80, 
      stackedIconW: 64,
      stackedIconH: 94,
      text: 'text-3xl sm:text-4xl tracking-[0.22em]' 
    }
  }[size];

  // Botanical Capsule Arch Monogram SVG matching user's uploaded brand logo
  const renderEmblem = (width: number, height: number) => (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 144" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      {/* Outer Capsule Stadium Arch matching user upload */}
      <path 
        d="M 16 48 A 34 34 0 0 1 84 48 L 84 96 A 34 34 0 0 1 16 96 Z" 
        stroke={emblemColor} 
        strokeWidth="2.8" 
        strokeLinejoin="round"
      />

      {/* Classical Serif Monogram 'H' */}
      {/* Left Pillar with bracketed serifs */}
      <path 
        d="M 27 52 L 47 52 L 47 54.5 C 43 55 39 57.5 39 62 L 39 84 C 39 88.5 43 91 47 91.5 L 47 94 L 27 94 L 27 91.5 C 31 91 35 88.5 35 84 L 35 62 C 35 57.5 31 55 27 54.5 Z" 
        fill={emblemColor} 
      />

      {/* Right Pillar with bracketed serifs */}
      <path 
        d="M 53 52 L 73 52 L 73 54.5 C 69 55 65 57.5 65 62 L 65 84 C 65 88.5 69 91 73 91.5 L 73 94 L 53 94 L 53 91.5 C 57 91 61 88.5 61 84 L 61 62 C 61 57.5 57 55 53 54.5 Z" 
        fill={emblemColor} 
      />

      {/* Horizontal Crossbar */}
      <rect x="39" y="71" width="22" height="3.8" fill={emblemColor} />

      {/* Botanical Leaf Flourish 1: Upper-Right Corner */}
      <g stroke={emblemColor} fill="none">
        {/* Main curving branch stem */}
        <path d="M 54 50 Q 64 34 76 20" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Leaf 1 (lower right) */}
        <path d="M 61 41 Q 69 38 75 43 Q 68 46 61 41 Z" strokeWidth="1.1" />
        {/* Leaf 2 (mid left) */}
        <path d="M 65 32 Q 59 28 55 31 Q 60 35 65 32 Z" strokeWidth="1.1" />
        {/* Leaf 3 (mid right) */}
        <path d="M 69 28 Q 75 24 80 29 Q 74 32 69 28 Z" strokeWidth="1.1" />
        {/* Leaf 4 (tip top leaf) */}
        <path d="M 73 23 Q 75 16 78 19 Q 78 24 73 23 Z" strokeWidth="1.1" />
        {/* Leaf 5 (side leaf) */}
        <path d="M 57 46 Q 50 44 48 48 Q 53 50 57 46 Z" strokeWidth="1.1" />
      </g>

      {/* Botanical Leaf Flourish 2: Lower-Left Corner */}
      <g stroke={emblemColor} fill="none">
        {/* Main curving branch stem */}
        <path d="M 46 96 Q 36 112 24 126" strokeWidth="1.5" strokeLinecap="round" />

        {/* Leaf 1 (upper left) */}
        <path d="M 39 105 Q 31 107 25 103 Q 32 100 39 105 Z" strokeWidth="1.1" />
        {/* Leaf 2 (mid right) */}
        <path d="M 35 114 Q 41 118 45 115 Q 40 111 35 114 Z" strokeWidth="1.1" />
        {/* Leaf 3 (lower left) */}
        <path d="M 31 118 Q 25 122 20 118 Q 26 114 31 118 Z" strokeWidth="1.1" />
        {/* Leaf 4 (tip bottom leaf) */}
        <path d="M 27 123 Q 25 130 22 127 Q 22 122 27 123 Z" strokeWidth="1.1" />
        {/* Leaf 5 (upper side leaf) */}
        <path d="M 43 100 Q 50 102 52 98 Q 47 96 43 100 Z" strokeWidth="1.1" />
      </g>
    </svg>
  );

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {renderEmblem(dimensions.stackedIconW, dimensions.stackedIconH)}
        <span 
          style={{ color: textColor }} 
          className={`font-serif font-bold uppercase leading-tight mt-1 ${dimensions.text}`}
        >
          HOOR FAB
        </span>
        {subtitle && (
          <span 
            style={{ color: variant === 'light' ? '#d8cebe' : '#887460' }} 
            className="text-[9px] tracking-[0.25em] uppercase font-sans font-medium mt-0.5"
          >
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {renderEmblem(dimensions.iconWidth, dimensions.iconHeight)}
      <div className="flex flex-col justify-center">
        <span 
          style={{ color: textColor }} 
          className={`font-serif font-bold uppercase leading-none ${dimensions.text}`}
        >
          HOOR FAB
        </span>
        {subtitle && (
          <span 
            style={{ color: variant === 'light' ? '#d8cebe' : '#887460' }} 
            className="text-[9px] tracking-[0.25em] uppercase font-sans font-medium mt-0.5"
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
