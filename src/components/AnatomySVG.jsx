import { useState } from 'react';
import { motion } from 'framer-motion';

const AnatomySVG = ({ view = 'front', onMuscleSelect, selectedMuscle }) => {
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const muscleColors = {
    default: '#f3f4f6',
    defaultStroke: '#d1d5db',
    hover: '#fef3c7',
    hoverStroke: '#f59e0b',
    selected: '#fecaca',
    selectedStroke: '#ef4444',
    selectedHover: '#fca5a5',
    selectedHoverStroke: '#dc2626',
    skeleton: '#e5e7eb',
    skeletonStroke: '#9ca3af'
  };

  const getMuscleColor = (muscleId) => {
    if (selectedMuscle === muscleId) {
      return hoveredMuscle === muscleId ? muscleColors.selectedHover : muscleColors.selected;
    }
    return hoveredMuscle === muscleId ? muscleColors.hover : muscleColors.default;
  };

  const getMuscleStroke = (muscleId) => {
    if (selectedMuscle === muscleId) {
      return hoveredMuscle === muscleId ? muscleColors.selectedHoverStroke : muscleColors.selectedStroke;
    }
    return hoveredMuscle === muscleId ? muscleColors.hoverStroke : muscleColors.defaultStroke;
  };

  const handleMuscleClick = (muscleId, event) => {
    event.stopPropagation();
    onMuscleSelect?.(muscleId);
  };

  const handleMuscleHover = (muscleId) => {
    setHoveredMuscle(muscleId);
  };

  const handleMuscleLeave = () => {
    setHoveredMuscle(null);
  };

  if (view === 'front') {
    return (
      <svg 
        width="320" 
        height="640" 
        viewBox="0 0 320 640" 
        className="w-full h-full max-w-sm mx-auto"
        style={{ filter: 'drop-shadow(0px 6px 20px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8f9fa" />
            <stop offset="100%" stopColor="#e9ecef" />
          </linearGradient>
          <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
          <filter id="muscleShadow">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.15"/>
          </filter>
          <filter id="innerShadow">
            <feOffset dx="0" dy="2"/>
            <feGaussianBlur stdDeviation="1" result="offset-blur"/>
            <feFlood floodColor="#000000" floodOpacity="0.1"/>
            <feComposite in2="offset-blur" operator="in"/>
          </filter>
        </defs>

        {/* Professional muscular body outline */}
        <path
          d="M160 45 C172 38, 185 42, 192 58 L198 78 C203 88, 208 98, 212 115 L218 140 L222 170 L224 200 L220 235 L215 270 L210 305 L205 340 L200 380 L195 420 L190 460 L185 500 L180 540 L175 580 L170 610 L165 630 L155 630 L150 610 L145 580 L140 540 L135 500 L130 460 L125 420 L120 380 L115 340 L110 305 L105 270 L100 235 L96 200 L98 170 L102 140 L108 115 C112 98, 117 88, 122 78 L128 58 C135 42, 148 38, 160 45 Z"
          fill="url(#bodyGradient)"
          stroke="#6c757d"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Head with realistic proportions */}
        <ellipse
          cx="160"
          cy="58"
          rx="26"
          ry="32"
          fill="#f1f3f4"
          stroke="#6c757d"
          strokeWidth="1.2"
        />
        
        {/* Facial features */}
        <ellipse cx="153" cy="52" rx="2.5" ry="4" fill="#495057" />
        <ellipse cx="167" cy="52" rx="2.5" ry="4" fill="#495057" />
        <path d="M160 62 Q156 65, 160 67 Q164 65, 160 62" fill="none" stroke="#495057" strokeWidth="1.2" />

        {/* Neck muscles - Sternocleidomastoid */}
        <path
          d="M148 85 Q160 88, 172 85 L170 98 Q160 102, 150 98 Z"
          fill="#e9ecef"
          stroke="#adb5bd"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Trapezius upper portion (front view) */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('traps', e)}
          onMouseEnter={() => handleMuscleHover('traps')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M138 95 Q160 88, 182 95 C188 100, 190 110, 186 118 Q182 125, 175 130 Q170 133, 160 130 Q150 133, 145 130 Q138 125, 134 118 C130 110, 132 100, 138 95 Z"
            fill={getMuscleColor('traps')}
            stroke={getMuscleStroke('traps')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <path d="M138 95 Q160 88, 182 95" fill="url(#muscleHighlight)" opacity="0.3" />
        </motion.g>

        {/* Pectoralis Major - Realistic fan-shaped chest */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('chest', e)}
          onMouseEnter={() => handleMuscleHover('chest')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {/* Left pec */}
          <path
            d="M120 125 C108 130, 102 140, 105 155 Q110 175, 120 185 C130 195, 145 190, 155 180 Q160 170, 158 158 Q155 148, 150 140 C145 132, 135 128, 120 125 Z"
            fill={getMuscleColor('chest')}
            stroke={getMuscleStroke('chest')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Right pec */}
          <path
            d="M200 125 C212 130, 218 140, 215 155 Q210 175, 200 185 C190 195, 175 190, 165 180 Q160 170, 162 158 Q165 148, 170 140 C175 132, 185 128, 200 125 Z"
            fill={getMuscleColor('chest')}
            stroke={getMuscleStroke('chest')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Pec separation/sternum */}
          <path d="M160 135 L160 185" stroke={getMuscleStroke('chest')} strokeWidth="2" opacity="0.4" />
          {/* Muscle fiber definition */}
          <g stroke={getMuscleStroke('chest')} strokeWidth="0.8" opacity="0.3">
            <path d="M125 140 Q140 145, 155 142" />
            <path d="M128 155 Q140 158, 152 155" />
            <path d="M132 170 Q145 172, 158 170" />
            <path d="M192 140 Q175 145, 165 142" />
            <path d="M188 155 Q175 158, 168 155" />
            <path d="M185 170 Q172 172, 162 170" />
          </g>
          <path d="M105 155 Q120 158, 135 155" fill="url(#muscleHighlight)" opacity="0.2" />
          <path d="M215 155 Q200 158, 185 155" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Left Deltoid - Three distinct heads */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('left_shoulder', e)}
          onMouseEnter={() => handleMuscleHover('left_shoulder')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {/* Anterior deltoid */}
          <path
            d="M95 120 C85 125, 80 135, 85 148 Q90 162, 100 170 C110 178, 120 175, 125 165 Q128 155, 125 145 C122 135, 112 125, 95 120 Z"
            fill={getMuscleColor('left_shoulder')}
            stroke={getMuscleStroke('left_shoulder')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Deltoid separation lines */}
          <g stroke={getMuscleStroke('left_shoulder')} strokeWidth="0.6" opacity="0.4">
            <path d="M100 135 Q105 140, 110 145" />
            <path d="M98 150 Q103 155, 108 160" />
          </g>
          <path d="M85 148 Q95 152, 105 148" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Right Deltoid */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('right_shoulder', e)}
          onMouseEnter={() => handleMuscleHover('right_shoulder')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M225 120 C235 125, 240 135, 235 148 Q230 162, 220 170 C210 178, 200 175, 195 165 Q192 155, 195 145 C198 135, 208 125, 225 120 Z"
            fill={getMuscleColor('right_shoulder')}
            stroke={getMuscleStroke('right_shoulder')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <g stroke={getMuscleStroke('right_shoulder')} strokeWidth="0.6" opacity="0.4">
            <path d="M220 135 Q215 140, 210 145" />
            <path d="M222 150 Q217 155, 212 160" />
          </g>
          <path d="M235 148 Q225 152, 215 148" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Left Biceps - Dual-headed with realistic peak */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('left_bicep', e)}
          onMouseEnter={() => handleMuscleHover('left_bicep')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M88 175 C80 180, 75 190, 78 205 Q82 225, 88 240 C95 255, 105 258, 115 250 Q120 240, 118 225 Q116 210, 112 195 C108 185, 100 178, 88 175 Z"
            fill={getMuscleColor('left_bicep')}
            stroke={getMuscleStroke('left_bicep')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Bicep peak highlight */}
          <path d="M90 200 Q95 195, 105 200 Q110 210, 105 220 Q95 225, 90 220 Z" fill="url(#muscleHighlight)" opacity="0.3" />
          {/* Bicep separation */}
          <path d="M95 185 Q100 205, 105 225" stroke={getMuscleStroke('left_bicep')} strokeWidth="0.8" opacity="0.4" />
        </motion.g>

        {/* Right Biceps */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('right_bicep', e)}
          onMouseEnter={() => handleMuscleHover('right_bicep')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M232 175 C240 180, 245 190, 242 205 Q238 225, 232 240 C225 255, 215 258, 205 250 Q200 240, 202 225 Q204 210, 208 195 C212 185, 220 178, 232 175 Z"
            fill={getMuscleColor('right_bicep')}
            stroke={getMuscleStroke('right_bicep')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <path d="M230 200 Q225 195, 215 200 Q210 210, 215 220 Q225 225, 230 220 Z" fill="url(#muscleHighlight)" opacity="0.3" />
          <path d="M225 185 Q220 205, 215 225" stroke={getMuscleStroke('right_bicep')} strokeWidth="0.8" opacity="0.4" />
        </motion.g>

        {/* Rectus Abdominis - Detailed six-pack */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('abs', e)}
          onMouseEnter={() => handleMuscleHover('abs')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {/* Upper abs (2 pack) */}
          <path
            d="M142 195 Q160 190, 178 195 Q180 205, 178 215 Q160 220, 142 215 Q140 205, 142 195 Z"
            fill={getMuscleColor('abs')}
            stroke={getMuscleStroke('abs')}
            strokeWidth="1.5"
            filter="url(#muscleShadow)"
          />
          {/* Middle abs (4 pack) */}
          <path
            d="M143 225 Q160 220, 177 225 Q179 235, 177 245 Q160 250, 143 245 Q141 235, 143 225 Z"
            fill={getMuscleColor('abs')}
            stroke={getMuscleStroke('abs')}
            strokeWidth="1.5"
            filter="url(#muscleShadow)"
          />
          {/* Lower abs (6 pack) */}
          <path
            d="M144 255 Q160 250, 176 255 Q178 265, 176 275 Q160 280, 144 275 Q142 265, 144 255 Z"
            fill={getMuscleColor('abs')}
            stroke={getMuscleStroke('abs')}
            strokeWidth="1.5"
            filter="url(#muscleShadow)"
          />
          {/* Linea alba - central separation */}
          <path d="M160 195 L160 275" stroke={getMuscleStroke('abs')} strokeWidth="1.2" opacity="0.6" />
          {/* Horizontal separations */}
          <path d="M142 215 L178 215" stroke={getMuscleStroke('abs')} strokeWidth="0.8" opacity="0.4" />
          <path d="M143 245 L177 245" stroke={getMuscleStroke('abs')} strokeWidth="0.8" opacity="0.4" />
          {/* Highlight for definition */}
          <path d="M145 200 Q160 195, 175 200" fill="url(#muscleHighlight)" opacity="0.3" />
        </motion.g>

        {/* Left Forearm - Complex muscle group */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('left_forearm', e)}
          onMouseEnter={() => handleMuscleHover('left_forearm')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M75 260 C68 265, 65 275, 68 295 Q72 320, 78 340 C82 355, 88 360, 95 355 Q100 345, 98 330 Q96 315, 92 300 C88 285, 82 270, 75 260 Z"
            fill={getMuscleColor('left_forearm')}
            stroke={getMuscleStroke('left_forearm')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Forearm muscle separation */}
          <g stroke={getMuscleStroke('left_forearm')} strokeWidth="0.6" opacity="0.4">
            <path d="M78 280 Q85 285, 90 290" />
            <path d="M80 310 Q85 315, 88 320" />
          </g>
        </motion.g>

        {/* Right Forearm */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('right_forearm', e)}
          onMouseEnter={() => handleMuscleHover('right_forearm')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M245 260 C252 265, 255 275, 252 295 Q248 320, 242 340 C238 355, 232 360, 225 355 Q220 345, 222 330 Q224 315, 228 300 C232 285, 238 270, 245 260 Z"
            fill={getMuscleColor('right_forearm')}
            stroke={getMuscleStroke('right_forearm')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <g stroke={getMuscleStroke('right_forearm')} strokeWidth="0.6" opacity="0.4">
            <path d="M242 280 Q235 285, 230 290" />
            <path d="M240 310 Q235 315, 232 320" />
          </g>
        </motion.g>

        {/* Left Quadriceps - Four-headed definition */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('left_quad', e)}
          onMouseEnter={() => handleMuscleHover('left_quad')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M125 300 C115 308, 110 325, 118 350 Q125 380, 135 415 C142 435, 150 440, 160 435 Q168 425, 165 410 Q162 395, 158 380 Q155 365, 152 350 C148 335, 140 320, 125 300 Z"
            fill={getMuscleColor('left_quad')}
            stroke={getMuscleStroke('left_quad')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Quadricep separations - vastus lateralis, rectus femoris, vastus medialis */}
          <g stroke={getMuscleStroke('left_quad')} strokeWidth="0.8" opacity="0.4">
            <path d="M135 320 Q145 330, 152 340" />
            <path d="M138 350 Q148 360, 155 370" />
            <path d="M142 380 Q150 390, 158 400" />
          </g>
          <path d="M118 350 Q135 355, 152 350" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Right Quadriceps */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('right_quad', e)}
          onMouseEnter={() => handleMuscleHover('right_quad')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M195 300 C205 308, 210 325, 202 350 Q195 380, 185 415 C178 435, 170 440, 160 435 Q152 425, 155 410 Q158 395, 162 380 Q165 365, 168 350 C172 335, 180 320, 195 300 Z"
            fill={getMuscleColor('right_quad')}
            stroke={getMuscleStroke('right_quad')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <g stroke={getMuscleStroke('right_quad')} strokeWidth="0.8" opacity="0.4">
            <path d="M185 320 Q175 330, 168 340" />
            <path d="M182 350 Q172 360, 165 370" />
            <path d="M178 380 Q170 390, 162 400" />
          </g>
          <path d="M202 350 Q185 355, 168 350" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Left Gastrocnemius - Diamond calf with definition */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('left_calf', e)}
          onMouseEnter={() => handleMuscleHover('left_calf')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M130 460 C122 468, 118 485, 125 505 Q132 530, 140 555 C145 570, 152 575, 160 570 Q168 560, 165 545 Q162 530, 158 515 Q155 500, 152 485 C148 475, 142 468, 130 460 Z"
            fill={getMuscleColor('left_calf')}
            stroke={getMuscleStroke('left_calf')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          {/* Calf separation - medial and lateral heads */}
          <path d="M145 480 Q150 495, 155 510" stroke={getMuscleStroke('left_calf')} strokeWidth="0.8" opacity="0.4" />
          <path d="M125 505 Q140 510, 155 505" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Right Gastrocnemius */}
        <motion.g
          className="cursor-pointer"
          onClick={(e) => handleMuscleClick('right_calf', e)}
          onMouseEnter={() => handleMuscleHover('right_calf')}
          onMouseLeave={handleMuscleLeave}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <path
            d="M190 460 C198 468, 202 485, 195 505 Q188 530, 180 555 C175 570, 168 575, 160 570 Q152 560, 155 545 Q158 530, 162 515 Q165 500, 168 485 C172 475, 178 468, 190 460 Z"
            fill={getMuscleColor('right_calf')}
            stroke={getMuscleStroke('right_calf')}
            strokeWidth="1.8"
            filter="url(#muscleShadow)"
          />
          <path d="M175 480 Q170 495, 165 510" stroke={getMuscleStroke('right_calf')} strokeWidth="0.8" opacity="0.4" />
          <path d="M195 505 Q180 510, 165 505" fill="url(#muscleHighlight)" opacity="0.2" />
        </motion.g>

        {/* Enhanced muscle labels */}
        {hoveredMuscle && (
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, type: "spring" }}
          >
            <rect
              x="220"
              y="20"
              width="95"
              height="32"
              rx="8"
              fill="rgba(20, 20, 20, 0.95)"
              filter="url(#muscleShadow)"
            />
            <text
              x="267"
              y="40"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="700"
              letterSpacing="0.8px"
            >
              {hoveredMuscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </text>
          </motion.g>
        )}
      </svg>
    );
  }

  // Back view - professional anatomical accuracy
  return (
    <svg 
      width="280" 
      height="560" 
      viewBox="0 0 280 560" 
      className="w-full h-full max-w-sm mx-auto"
      style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <linearGradient id="backBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#f4f4f5" />
        </linearGradient>
        <filter id="backMuscleShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>

      {/* Skeletal structure base */}
      <path
        d="M140 45 C155 40, 165 45, 168 55 L170 70 C172 85, 174 95, 176 110 L178 140 L180 170 L178 200 L175 240 L172 280 L170 320 L168 360 L165 400 L163 440 L160 480 L158 520 L155 550 L145 550 L142 520 L140 480 L137 440 L135 400 L132 360 L130 320 L128 280 L125 240 L122 200 L124 170 L126 140 L128 110 C130 95, 132 85, 134 70 L136 55 C139 45, 149 40, 140 45 Z"
        fill="url(#backBodyGradient)"
        stroke={muscleColors.skeletonStroke}
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Head - back view */}
      <ellipse
        cx="140"
        cy="55"
        rx="22"
        ry="26"
        fill={muscleColors.skeleton}
        stroke={muscleColors.skeletonStroke}
        strokeWidth="1"
      />

      {/* Latissimus Dorsi - wing-shaped back muscles */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('back', e)}
        onMouseEnter={() => handleMuscleHover('back')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M118 125 C108 130, 102 140, 105 155 Q110 175, 118 190 C125 200, 135 195, 140 185 Q142 175, 140 165 Q138 155, 135 145 C132 135, 125 128, 118 125 Z"
          fill={getMuscleColor('back')}
          stroke={getMuscleStroke('back')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
        <path
          d="M162 125 C172 130, 178 140, 175 155 Q170 175, 162 190 C155 200, 145 195, 140 185 Q138 175, 140 165 Q142 155, 145 145 C148 135, 155 128, 162 125 Z"
          fill={getMuscleColor('back')}
          stroke={getMuscleStroke('back')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
        {/* Muscle fiber lines */}
        <g stroke={getMuscleStroke('back')} strokeWidth="0.4" opacity="0.4">
          <path d="M122 145 Q130 150, 138 145" />
          <path d="M124 165 Q130 168, 136 165" />
          <path d="M158 145 Q150 150, 142 145" />
          <path d="M156 165 Q150 168, 144 165" />
        </g>
      </motion.g>

      {/* Trapezius - upper back and neck */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('traps', e)}
        onMouseEnter={() => handleMuscleHover('traps')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M125 95 Q140 90, 155 95 C160 100, 162 110, 158 120 Q155 130, 150 135 Q145 138, 140 135 Q135 138, 130 135 Q125 130, 122 120 C118 110, 120 100, 125 95 Z"
          fill={getMuscleColor('traps')}
          stroke={getMuscleStroke('traps')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
        <g stroke={getMuscleStroke('traps')} strokeWidth="0.3" opacity="0.4">
          <path d="M130 105 Q140 108, 150 105" />
          <path d="M132 115 Q140 118, 148 115" />
        </g>
      </motion.g>

      {/* Rear Deltoids */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('left_shoulder', e)}
        onMouseEnter={() => handleMuscleHover('left_shoulder')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M95 115 C88 118, 85 125, 88 135 Q92 145, 98 150 C105 155, 110 152, 112 145 Q110 135, 108 125 C106 118, 100 115, 95 115 Z"
          fill={getMuscleColor('left_shoulder')}
          stroke={getMuscleStroke('left_shoulder')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('right_shoulder', e)}
        onMouseEnter={() => handleMuscleHover('right_shoulder')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M185 115 C192 118, 195 125, 192 135 Q188 145, 182 150 C175 155, 170 152, 168 145 Q170 135, 172 125 C174 118, 180 115, 185 115 Z"
          fill={getMuscleColor('right_shoulder')}
          stroke={getMuscleStroke('right_shoulder')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      {/* Triceps - back view */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('left_tricep', e)}
        onMouseEnter={() => handleMuscleHover('left_tricep')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M88 155 C82 158, 80 165, 83 175 Q86 190, 90 195 C96 200, 100 197, 102 190 Q100 180, 98 170 C96 163, 92 158, 88 155 Z"
          fill={getMuscleColor('left_tricep')}
          stroke={getMuscleStroke('left_tricep')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('right_tricep', e)}
        onMouseEnter={() => handleMuscleHover('right_tricep')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M192 155 C198 158, 200 165, 197 175 Q194 190, 190 195 C184 200, 180 197, 178 190 Q180 180, 182 170 C184 163, 188 158, 192 155 Z"
          fill={getMuscleColor('right_tricep')}
          stroke={getMuscleStroke('right_tricep')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      {/* Gluteus Maximus - anatomically correct shape */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('glutes', e)}
        onMouseEnter={() => handleMuscleHover('glutes')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M118 250 C110 255, 108 265, 112 280 Q118 295, 125 305 C135 315, 145 312, 150 305 Q155 295, 152 280 C150 265, 145 255, 140 252 Q135 250, 130 252 C125 250, 120 250, 118 250 Z"
          fill={getMuscleColor('glutes')}
          stroke={getMuscleStroke('glutes')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
        <path
          d="M162 250 C170 255, 172 265, 168 280 Q162 295, 155 305 C145 315, 135 312, 130 305 Q125 295, 128 280 C130 265, 135 255, 140 252 Q145 250, 150 252 C155 250, 160 250, 162 250 Z"
          fill={getMuscleColor('glutes')}
          stroke={getMuscleStroke('glutes')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
        {/* Glute separation line */}
        <path d="M140 252 L140 305" stroke={getMuscleStroke('glutes')} strokeWidth="0.8" opacity="0.6" />
      </motion.g>

      {/* Hamstrings */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('left_hamstring', e)}
        onMouseEnter={() => handleMuscleHover('left_hamstring')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M115 320 C108 325, 106 335, 110 355 Q115 375, 120 395 C123 405, 127 408, 133 405 Q137 395, 135 375 Q133 355, 130 335 C128 325, 123 320, 115 320 Z"
          fill={getMuscleColor('left_hamstring')}
          stroke={getMuscleStroke('left_hamstring')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('right_hamstring', e)}
        onMouseEnter={() => handleMuscleHover('right_hamstring')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M165 320 C172 325, 174 335, 170 355 Q165 375, 160 395 C157 405, 153 408, 147 405 Q143 395, 145 375 Q147 355, 150 335 C152 325, 157 320, 165 320 Z"
          fill={getMuscleColor('right_hamstring')}
          stroke={getMuscleStroke('right_hamstring')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      {/* Back of calves */}
      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('left_calf', e)}
        onMouseEnter={() => handleMuscleHover('left_calf')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M120 420 C115 425, 113 435, 117 450 Q121 470, 125 485 C127 492, 131 494, 135 492 Q137 485, 135 470 Q133 450, 131 435 C129 425, 125 420, 120 420 Z"
          fill={getMuscleColor('left_calf')}
          stroke={getMuscleStroke('left_calf')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      <motion.g
        className="cursor-pointer"
        onClick={(e) => handleMuscleClick('right_calf', e)}
        onMouseEnter={() => handleMuscleHover('right_calf')}
        onMouseLeave={handleMuscleLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <path
          d="M160 420 C165 425, 167 435, 163 450 Q159 470, 155 485 C153 492, 149 494, 145 492 Q143 485, 145 470 Q147 450, 149 435 C151 425, 155 420, 160 420 Z"
          fill={getMuscleColor('right_calf')}
          stroke={getMuscleStroke('right_calf')}
          strokeWidth="1.5"
          filter="url(#backMuscleShadow)"
        />
      </motion.g>

      {/* Enhanced muscle labels for back view */}
      {hoveredMuscle && (
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, type: "spring" }}
        >
          <rect
            x="190"
            y="15"
            width="85"
            height="28"
            rx="6"
            fill="rgba(30, 30, 30, 0.95)"
            filter="url(#backMuscleShadow)"
          />
          <text
            x="232"
            y="33"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.5px"
          >
            {hoveredMuscle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </text>
        </motion.g>
      )}
    </svg>
  );
};

export default AnatomySVG;