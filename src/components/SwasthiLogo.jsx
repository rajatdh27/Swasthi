const SwasthiLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gojo-style purple-blue gradient */}
        <radialGradient id="gojoGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E40AF" />
        </radialGradient>
        
        {/* Glow effect filter */}
        <filter id="gojoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Inner glow */}
        <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feOffset in="blur" dx="0" dy="0" result="offset"/>
          <feFlood floodColor="#8B5CF6" floodOpacity="0.6"/>
          <feComposite in2="offset" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer glow circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#gojoGradient)" 
        opacity="0.15"
        filter="url(#gojoGlow)"
      />
      
      {/* Main circle with gradient */}
      <circle 
        cx="50" 
        cy="50" 
        r="35" 
        fill="url(#gojoGradient)" 
        opacity="0.3"
        filter="url(#innerGlow)"
      />
      
      {/* Stylized 'S' in Gojo style */}
      <g transform="translate(50,50)" filter="url(#gojoGlow)">
        {/* Main S shape with curves like Gojo's infinity */}
        <path 
          d="M-12,-15 Q-18,-20 -12,-25 Q-6,-30 6,-25 Q12,-20 6,-15 Q0,-10 -6,-5 Q-12,0 -6,5 Q0,10 6,15 Q12,20 6,25 Q-6,30 -12,25 Q-18,20 -12,15" 
          fill="url(#gojoGradient)"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.9"
        />
        
        {/* Energy orbs around the S */}
        <circle cx="-20" cy="-10" r="2" fill="#8B5CF6" opacity="0.8"/>
        <circle cx="20" cy="10" r="2" fill="#6366F1" opacity="0.8"/>
        <circle cx="-15" cy="15" r="1.5" fill="#1E40AF" opacity="0.8"/>
        <circle cx="15" cy="-15" r="1.5" fill="#8B5CF6" opacity="0.8"/>
      </g>
      
      {/* Infinity-style energy waves */}
      <g opacity="0.4" stroke="url(#gojoGradient)" strokeWidth="1" fill="none">
        <path d="M20,20 Q30,30 40,20 Q50,10 60,20 Q70,30 80,20"/>
        <path d="M20,80 Q30,70 40,80 Q50,90 60,80 Q70,70 80,80"/>
      </g>
    </svg>
  );
};

export default SwasthiLogo;