import React from 'react';

interface FishLogoProps {
  className?: string;
  size?: number;
}

export const FishLogo: React.FC<FishLogoProps> = ({ className = '', size = 88 }) => {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#03457a" />
            <stop offset="100%" stopColor="#082142" />
          </radialGradient>
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Outer rope/bead border */}
        <circle cx="80" cy="80" r="76" fill="none" stroke="url(#goldRing)" strokeWidth="6" strokeDasharray="3 3" />
        <circle cx="80" cy="80" r="73" fill="none" stroke="#ca8a04" strokeWidth="2" />

        {/* Inner circle background */}
        <circle cx="80" cy="80" r="70" fill="url(#waterGrad)" />

        {/* Water wave texture */}
        <path
          d="M 15,80 Q 40,65 80,75 T 145,75"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <path
          d="M 18,100 Q 50,88 90,98 T 142,95"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* Palm tree silhouettes in background */}
        <g opacity="0.4" fill="#0f172a">
          {/* Left palm */}
          <path d="M 45,68 Q 42,50 35,42 Q 33,52 38,68 Z" />
          <path d="M 45,68 Q 52,50 60,45 Q 52,55 45,68 Z" />
          <path d="M 45,68 Q 38,40 45,35 Q 46,48 45,68 Z" />
          <rect x="43" y="66" width="3" height="20" rx="1" />
        </g>

        {/* Fishing Hook */}
        <path
          d="M 125,40 C 130,55 130,68 122,75 C 114,82 104,78 106,68"
          fill="none"
          stroke="#fef08a"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <polygon points="106,68 111,72 103,75" fill="#fef08a" />

        {/* Catfish (Keli) Graphic */}
        <g id="catfish">
          {/* Body */}
          <path
            d="M 30,105 C 45,75 85,78 125,98 C 115,115 80,125 45,118 C 36,116 32,110 30,105 Z"
            fill="#1e293b"
            stroke="#eab308"
            strokeWidth="1.5"
          />
          {/* Tail fin */}
          <path
            d="M 30,105 C 18,92 12,88 10,95 C 16,105 18,110 12,122 C 18,122 25,115 32,108 Z"
            fill="#334155"
            stroke="#eab308"
            strokeWidth="1"
          />
          {/* Dorsal fin */}
          <path
            d="M 65,83 Q 85,72 105,88 Q 85,82 65,83 Z"
            fill="#475569"
            stroke="#ca8a04"
            strokeWidth="1"
          />
          {/* Whisker (sungut keli) */}
          <path
            d="M 124,96 Q 142,92 148,82"
            fill="none"
            stroke="#fef08a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 122,103 Q 138,105 146,115"
            fill="none"
            stroke="#fef08a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Eye */}
          <circle cx="118" cy="95" r="3" fill="#ffffff" />
          <circle cx="119" cy="95" r="1.5" fill="#000000" />
        </g>

        {/* Text Top: KOLAM PALMVIEW */}
        <text
          x="80"
          y="42"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="900"
          letterSpacing="1.2"
          className="font-black drop-shadow"
        >
          KOLAM
        </text>
        <text
          x="80"
          y="56"
          textAnchor="middle"
          fill="#fef08a"
          fontSize="14"
          fontWeight="900"
          letterSpacing="0.8"
          className="font-black drop-shadow"
        >
          PALMVIEW
        </text>
        <text
          x="80"
          y="69"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9"
          fontWeight="800"
          letterSpacing="1"
        >
          KERATONG 8
        </text>

        {/* Lower Banner Ribbon: SINCE 2024 */}
        <path
          d="M 38,132 L 122,132 L 115,145 L 45,145 Z"
          fill="url(#goldRibbon)"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        <text
          x="80"
          y="142"
          textAnchor="middle"
          fill="#1e293b"
          fontSize="8.5"
          fontWeight="900"
          letterSpacing="1"
        >
          — SINCE 2024 —
        </text>
      </svg>
    </div>
  );
};
