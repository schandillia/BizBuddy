import React from "react"

const HeroIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" {...props}>
      <defs>
        {/* Gradient Definitions */}
        <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
        </linearGradient>

        <filter id="shadowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="shadow" />
          <feOffset dx="0" dy="10" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0"
          />
        </filter>
      </defs>

      {/* Background Gradient */}
      <rect width="400" height="500" fill="url(#dataGradient)" opacity="0.05" />

      {/* Main Data Visualization Container */}
      <g transform="translate(50, 50)">
        {/* 3D-like Container */}
        <rect
          x="0"
          y="0"
          width="300"
          height="400"
          rx="20"
          ry="20"
          fill="white"
          filter="url(#shadowEffect)"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* Grid Background */}
        <g stroke="#e2e8f0" strokeWidth="1" opacity="0.3">
          {[50, 100, 150, 200, 250, 300, 350].map((y) => (
            <line key={`h-${y}`} x1="0" y1={y} x2="300" y2={y} />
          ))}
          {[50, 100, 200, 250].map((x) => (
            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="400" />
          ))}
        </g>

        {/* Animated Data Lines */}
        <g clipPath="inset(5%)">
          {/* Background Line */}
          <polyline
            points="50,350 100,300 150,250 200,200 250,150 300,100 350,50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {/* Animated Foreground Line */}
          <polyline
            points="50,350 100,300 150,250 200,200 250,150 300,100 350,50"
            fill="none"
            stroke="url(#dataGradient)"
            strokeWidth="4"
          >
            <animate
              attributeName="stroke-dasharray"
              from="0,1000"
              to="500,500"
              dur="3s"
              repeatCount="indefinite"
            />
          </polyline>
        </g>

        {/* Notification Indicators */}
        <g>
          {/* Top Right Notification */}
          <circle cx="330" cy="30" r="15" fill="#10b981" opacity="0.7">
            <animate
              attributeName="r"
              values="10;20;10"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Bottom Left Notification */}
          <circle cx="30" cy="370" r="12" fill="#f43f5e" opacity="0.7">
            <animate
              attributeName="r"
              values="8;16;8"
              dur="2.5s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </g>
      </g>
    </svg>
  )
}

export default HeroIllustration
