import React from 'react';

const AuthBackgroundSVG = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated geometric shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="radial1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Large floating circles */}
        <circle
          cx="200"
          cy="150"
          r="120"
          fill="url(#radial1)"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <circle
          cx="1000"
          cy="600"
          r="80"
          fill="url(#grad1)"
          className="animate-pulse"
          style={{ animationDuration: '3s', animationDelay: '1s' }}
        />

        {/* Geometric shapes */}
        <path
          d="M100 300 L300 200 L400 400 L200 500 Z"
          fill="url(#grad2)"
          className="animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '0.5s' }}
        />
        
        <path
          d="M800 100 L1100 150 L1000 350 L700 300 Z"
          fill="url(#grad3)"
          className="animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />

        {/* Curved lines */}
        <path
          d="M0 400 Q300 200 600 400 T1200 400"
          stroke="url(#grad1)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        <path
          d="M0 600 Q400 400 800 600 T1200 600"
          stroke="url(#grad2)"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
        />

        {/* Floating dots */}
        <g className="animate-pulse" style={{ animationDuration: '3s' }}>
          <circle cx="150" cy="500" r="4" fill="#3B82F6" opacity="0.4" />
          <circle cx="350" cy="450" r="3" fill="#8B5CF6" opacity="0.3" />
          <circle cx="550" cy="520" r="5" fill="#06B6D4" opacity="0.35" />
        </g>

        <g className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <circle cx="850" cy="250" r="4" fill="#3B82F6" opacity="0.4" />
          <circle cx="950" cy="300" r="3" fill="#8B5CF6" opacity="0.3" />
          <circle cx="1050" cy="200" r="5" fill="#06B6D4" opacity="0.35" />
        </g>

        {/* Abstract shapes */}
        <path
          d="M500 50 Q600 100 500 200 Q400 150 500 50"
          fill="url(#grad1)"
          opacity="0.2"
          className="animate-pulse"
          style={{ animationDuration: '7s' }}
        />

        <path
          d="M700 650 Q800 700 700 750 Q600 700 700 650"
          fill="url(#grad3)"
          opacity="0.15"
          className="animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1.5s' }}
        />
      </svg>

      {/* Additional floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-cyan-500/5 rounded-full blur-lg animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-20 w-20 h-20 bg-indigo-500/5 rounded-full blur-lg animate-bounce" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
    </div>
  );
};

export default AuthBackgroundSVG;