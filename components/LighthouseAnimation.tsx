import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface Boat {
  id: number;
  x: number;
  y: number;
  icon: 'message' | 'help' | 'alert';
}

export function LighthouseAnimation() {
  const [rotation, setRotation] = useState(0);
  const [illuminatedBoats, setIlluminatedBoats] = useState<number[]>([]);

  const boats: Boat[] = [
    { id: 1, x: 120, y: 180, icon: 'message' },
    { id: 2, x: 280, y: 220, icon: 'help' },
    { id: 3, x: 200, y: 280, icon: 'alert' },
    { id: 4, x: 380, y: 260, icon: 'message' },
    { id: 5, x: 320, y: 160, icon: 'help' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 불빛이 비추는 각도 범위 계산
    const lightAngle = rotation;
    const lightSpan = 45; // 불빛의 각도 범위
    
    const lit = boats.filter((boat) => {
      const dx = boat.x - 250;
      const dy = boat.y - 160;
      const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      
      const normalizedLightAngle = (lightAngle + 90) % 360;
      let angleDiff = Math.abs(angle - normalizedLightAngle);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;
      
      return angleDiff < lightSpan / 2;
    }).map(boat => boat.id);
    
    setIlluminatedBoats(lit);
  }, [rotation]);

  const getBoatIcon = (icon: string, isIlluminated: boolean) => {
    const iconProps = {
      className: `w-4 h-4 transition-colors duration-300 ${
        isIlluminated ? 'text-yellow-400' : 'text-blue-300/50'
      }`,
    };

    switch (icon) {
      case 'message':
        return <MessageCircle {...iconProps} />;
      case 'help':
        return <HelpCircle {...iconProps} />;
      case 'alert':
        return <AlertCircle {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full"
        style={{ maxWidth: '600px', maxHeight: '500px' }}
      >
        {/* 바다 배경 */}
        <defs>
          <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          
          {/* 불빛 그라디언트 */}
          <radialGradient id="lightGradient">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 바다 웨이브 */}
        <motion.path
          d="M0,300 Q125,290 250,300 T500,300 L500,400 L0,400 Z"
          fill="url(#seaGradient)"
          opacity="0.6"
          animate={{
            d: [
              "M0,300 Q125,290 250,300 T500,300 L500,400 L0,400 Z",
              "M0,300 Q125,310 250,300 T500,300 L500,400 L0,400 Z",
              "M0,300 Q125,290 250,300 T500,300 L500,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M0,320 Q125,310 250,320 T500,320 L500,400 L0,400 Z"
          fill="url(#seaGradient)"
          opacity="0.4"
          animate={{
            d: [
              "M0,320 Q125,310 250,320 T500,320 L500,400 L0,400 Z",
              "M0,320 Q125,330 250,320 T500,320 L500,400 L0,400 Z",
              "M0,320 Q125,310 250,320 T500,320 L500,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* 등대가 서있는 작은 섬 */}
        <ellipse cx="250" cy="310" rx="60" ry="15" fill="#1e40af" opacity="0.8" />
        <path
          d="M210,310 Q250,280 290,310 Z"
          fill="#1e3a8a"
          opacity="0.9"
        />

        {/* 등대 구조물 */}
        <g transform="translate(250, 160)">
          {/* 등대 기둥 */}
          <motion.rect
            x="-15"
            y="80"
            width="30"
            height="70"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          
          {/* 등대 중간 스트라이프 */}
          <rect x="-15" y="100" width="30" height="15" fill="#ef4444" />
          <rect x="-15" y="130" width="30" height="15" fill="#ef4444" />
          
          {/* 등대 꼭대기 (램프 하우스) */}
          <rect
            x="-20"
            y="60"
            width="40"
            height="25"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="2"
          />
          
          {/* 등대 지붕 */}
          <path
            d="M-25,60 L0,45 L25,60 Z"
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="1"
          />

          {/* 회전하는 불빛 콘 */}
          <motion.g
            style={{
              transformOrigin: '0 72px',
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {/* 주요 불빛 콘 */}
            <motion.path
              d="M0,72 L150,0 L150,30 L0,72 L150,114 L150,144 Z"
              fill="url(#lightGradient)"
              opacity="0.7"
            />
            
            {/* 불빛 외곽선 */}
            <motion.path
              d="M0,72 L150,0"
              stroke="#fbbf24"
              strokeWidth="1"
              opacity="0.5"
            />
            <motion.path
              d="M0,72 L150,144"
              stroke="#fbbf24"
              strokeWidth="1"
              opacity="0.5"
            />
          </motion.g>

          {/* 중앙 불빛 글로우 */}
          <motion.circle
            cx="0"
            cy="72"
            r="8"
            fill="#fbbf24"
            animate={{
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="0"
            cy="72"
            r="12"
            fill="#fbbf24"
            opacity="0.4"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* 배들 (참여기관) */}
        {boats.map((boat) => {
          const isIlluminated = illuminatedBoats.includes(boat.id);
          
          return (
            <g key={boat.id}>
              {/* 배 본체 */}
              <motion.g
                animate={{
                  y: [0, -3, 0],
                  scale: isIlluminated ? 1.1 : 1,
                }}
                transition={{
                  y: {
                    duration: 2 + boat.id * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 0.3,
                  },
                }}
              >
                {/* 배 몸체 */}
                <path
                  d={`M${boat.x - 15},${boat.y} L${boat.x - 10},${boat.y + 8} L${boat.x + 10},${boat.y + 8} L${boat.x + 15},${boat.y} Z`}
                  fill={isIlluminated ? "#60a5fa" : "#1e40af"}
                  stroke={isIlluminated ? "#93c5fd" : "#2563eb"}
                  strokeWidth="1"
                  style={{ transition: 'all 0.3s ease' }}
                />
                
                {/* 돛 */}
                <path
                  d={`M${boat.x},${boat.y - 5} L${boat.x},${boat.y} L${boat.x + 8},${boat.y - 2} Z`}
                  fill={isIlluminated ? "#fbbf24" : "#3b82f6"}
                  opacity={isIlluminated ? 0.9 : 0.6}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* 말풍선 배경 */}
                <motion.circle
                  cx={boat.x}
                  cy={boat.y - 20}
                  r="10"
                  fill={isIlluminated ? "#fef3c7" : "#1e3a8a"}
                  stroke={isIlluminated ? "#fbbf24" : "#3b82f6"}
                  strokeWidth="1.5"
                  animate={{
                    opacity: isIlluminated ? [0.8, 1, 0.8] : 0.7,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* 말풍선 꼬리 */}
                <path
                  d={`M${boat.x - 2},${boat.y - 12} L${boat.x},${boat.y - 8} L${boat.x + 2},${boat.y - 12} Z`}
                  fill={isIlluminated ? "#fef3c7" : "#1e3a8a"}
                  opacity={isIlluminated ? 0.9 : 0.7}
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* 아이콘을 foreignObject로 렌더링 */}
                <foreignObject
                  x={boat.x - 8}
                  y={boat.y - 28}
                  width="16"
                  height="16"
                >
                  {getBoatIcon(boat.icon, isIlluminated)}
                </foreignObject>
              </motion.g>

              {/* 연결선 (illuminated일 때만) */}
              {isIlluminated && (
                <motion.line
                  x1="250"
                  y1="232"
                  x2={boat.x}
                  y2={boat.y}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </g>
          );
        })}

        {/* 장식용 별들 */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={50 + i * 60}
            cy={30 + (i % 3) * 20}
            r="1.5"
            fill="#fbbf24"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
