import React from 'react';
import { AgentStatus } from '../types/clinical';
import { Activity, Stethoscope, Scale, AlertOctagon, LineChart, ShieldAlert, Clock, Sparkles } from 'lucide-react';

interface AvatarDisplayProps {
  agentId: string;
  status: AgentStatus;
  currentStep?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  agentId,
  status,
  currentStep,
  size = 'md'
}) => {
  const isProcessing = status === 'processing';
  const isCompleted = status === 'completed';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }[size];

  // Colors & icons by agent
  const agentThemeMap: Record<string, {
    bgGrad: string;
    glowColor: string;
    accentColor: string;
    icon: React.ReactNode;
    suitColor: string;
    hairColor: string;
    glasses?: boolean;
    headset?: boolean;
    labCoat?: boolean;
  }> = {
    agent_1: {
      bgGrad: 'from-teal-600/30 to-emerald-900/40',
      glowColor: 'shadow-teal-500/50',
      accentColor: 'text-teal-400',
      icon: <Stethoscope className="w-3.5 h-3.5 text-teal-300" />,
      suitColor: '#0f766e',
      hairColor: '#451a03',
      labCoat: true
    },
    agent_2: {
      bgGrad: 'from-indigo-600/30 to-slate-900/50',
      glowColor: 'shadow-indigo-500/50',
      accentColor: 'text-indigo-400',
      icon: <Scale className="w-3.5 h-3.5 text-indigo-300" />,
      suitColor: '#3730a3',
      hairColor: '#172554',
      glasses: true,
      labCoat: true
    },
    agent_3: {
      bgGrad: 'from-rose-600/30 to-red-950/50',
      glowColor: 'shadow-rose-500/50',
      accentColor: 'text-rose-400',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-300" />,
      suitColor: '#9f1239',
      hairColor: '#1c1917',
      headset: true,
      labCoat: false
    },
    agent_4: {
      bgGrad: 'from-cyan-600/30 to-slate-900/50',
      glowColor: 'shadow-cyan-500/50',
      accentColor: 'text-cyan-400',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-cyan-300" />,
      suitColor: '#0e7490',
      hairColor: '#292524',
      glasses: true,
      labCoat: false
    },
    agent_5: {
      bgGrad: 'from-purple-600/30 to-violet-950/50',
      glowColor: 'shadow-purple-500/50',
      accentColor: 'text-purple-400',
      icon: <LineChart className="w-3.5 h-3.5 text-purple-300" />,
      suitColor: '#6b21a8',
      hairColor: '#701a75',
      glasses: true,
      labCoat: true
    },
    agent_6: {
      bgGrad: 'from-emerald-600/30 to-teal-950/50',
      glowColor: 'shadow-emerald-500/50',
      accentColor: 'text-emerald-400',
      icon: <Clock className="w-3.5 h-3.5 text-emerald-300" />,
      suitColor: '#047857',
      hairColor: '#18181b',
      headset: true,
      labCoat: false
    }
  };

  const theme = agentThemeMap[agentId] || agentThemeMap.agent_1;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Glow Halo during processing */}
      <div
        className={`relative ${sizeClasses} rounded-2xl flex items-center justify-center bg-gradient-to-b ${theme.bgGrad} border border-slate-700/60 transition-all duration-500 overflow-hidden ${
          isProcessing ? `ring-2 ring-emerald-400 shadow-lg ${theme.glowColor} scale-105` : ''
        }`}
      >
        {/* Animated Scanning Waveform when processing */}
        {isProcessing && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Ambient Room Lighting Grid */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />

        {/* Vector SVG Avatar */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full p-1.5 transition-transform duration-300 ${isProcessing ? 'animate-[pulse_1.8s_ease-in-out_infinite]' : ''}`}
        >
          <defs>
            <radialGradient id={`glow-${agentId}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`suit-${agentId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.suitColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Background aura circle */}
          <circle cx="50" cy="50" r="42" fill={`url(#glow-${agentId})`} />

          {/* Shoulders / Coat */}
          <path
            d="M 22 92 C 22 72, 32 68, 50 68 C 68 68, 78 72, 78 92 Z"
            fill={`url(#suit-${agentId})`}
          />

          {/* White clinical lab collar / shirt */}
          {theme.labCoat ? (
            <>
              <polygon points="50,68 40,78 60,78" fill="#f8fafc" />
              <path d="M 40 78 L 36 92 L 64 92 L 60 78 Z" fill="#e2e8f0" opacity="0.8" />
              <polygon points="46,78 50,86 54,78" fill="#0284c7" />
              <line x1="50" y1="84" x2="50" y2="92" stroke="#64748b" strokeWidth="1" />
            </>
          ) : (
            <>
              {/* Executive collar or tactical scrub */}
              <polygon points="50,68 42,76 58,76" fill="#f1f5f9" />
              <polygon points="48,74 50,84 52,74" fill="#0369a1" />
            </>
          )}

          {/* Neck */}
          <rect x="44" y="58" width="12" height="12" rx="3" fill="#fbcfe8" opacity="0.9" />

          {/* Face Base */}
          <ellipse cx="50" cy="46" rx="17" ry="20" fill="#fcd34d" opacity="0.85" />

          {/* Hair */}
          <path
            d="M 33 42 C 32 26, 42 22, 50 22 C 58 22, 68 26, 67 42 C 64 36, 60 30, 50 30 C 40 30, 36 36, 33 42 Z"
            fill={theme.hairColor}
          />

          {/* Eyes */}
          <ellipse cx="44" cy="45" rx="2" ry="2.2" fill="#0f172a" />
          <ellipse cx="56" cy="45" rx="2" ry="2.2" fill="#0f172a" />
          <circle cx="44.8" cy="44.2" r="0.8" fill="#ffffff" />
          <circle cx="56.8" cy="44.2" r="0.8" fill="#ffffff" />

          {/* Eyebrows */}
          <path d="M 41 40 Q 44 38 47 40" stroke="#451a03" strokeWidth="1.2" fill="none" />
          <path d="M 53 40 Q 56 38 59 40" stroke="#451a03" strokeWidth="1.2" fill="none" />

          {/* Glasses if equipped */}
          {theme.glasses && (
            <g stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.85">
              <rect x="39" y="41" width="10" height="8" rx="2" fill="#38bdf8" fillOpacity="0.1" />
              <rect x="51" y="41" width="10" height="8" rx="2" fill="#38bdf8" fillOpacity="0.1" />
              <line x1="49" y1="45" x2="51" y2="45" />
              <line x1="39" y1="45" x2="35" y2="43" />
              <line x1="61" y1="45" x2="65" y2="43" />
            </g>
          )}

          {/* Headset if equipped */}
          {theme.headset && (
            <g stroke="#f43f5e" strokeWidth="1.5" fill="none">
              <path d="M 33 45 C 33 28, 67 28, 67 45" />
              <rect x="30" y="42" width="4" height="8" rx="1.5" fill="#f43f5e" />
              <rect x="66" y="42" width="4" height="8" rx="1.5" fill="#f43f5e" />
              <path d="M 32 48 Q 40 58 46 54" strokeWidth="1.2" />
              <circle cx="47" cy="54" r="2" fill="#f43f5e" />
            </g>
          )}

          {/* Mouth */}
          <path d="M 46 53 Q 50 56 54 53" stroke="#991b1b" strokeWidth="1" fill="none" />

          {/* Working Holographic Tablet / Terminal at bottom */}
          <rect
            x="32"
            y="80"
            width="36"
            height="18"
            rx="3"
            fill="#0284c7"
            fillOpacity={isProcessing ? '0.7' : '0.4'}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <line x1="36" y1="84" x2="64" y2="84" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          <line x1="36" y1="88" x2="56" y2="88" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
          <line x1="36" y1="92" x2="60" y2="92" stroke="#a5f3fc" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Small Specialty Icon Badge */}
        <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-900/80 border border-slate-700/80 shadow-xs">
          {theme.icon}
        </div>

        {/* Processing Indicator Pulse Beacon */}
        {isProcessing && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/50 rounded-md px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-medium text-emerald-300">ACTIVE</span>
          </div>
        )}

        {isCompleted && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-slate-900/90 border border-teal-500/40 rounded-md px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[10px] font-mono text-teal-300">READY</span>
          </div>
        )}
      </div>

      {/* Real-time processing micro-stage caption if provided */}
      {isProcessing && currentStep && (
        <div className="mt-1.5 max-w-[140px] text-center">
          <p className="text-[11px] font-mono text-emerald-400 truncate animate-pulse flex items-center justify-center gap-1">
            <Activity className="w-3 h-3 shrink-0" />
            {currentStep}
          </p>
        </div>
      )}
    </div>
  );
};
