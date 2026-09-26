import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  activeTab: string;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children, activeTab }) => {
  const [deviceMode, setDeviceMode] = useState<'mobile_frame' | 'responsive'>('mobile_frame');
  const [currentTime, setCurrentTime] = useState('09:41');

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3EEF9] flex flex-col items-center">
      {/* Top Floating Mobile View Controller for evaluation */}
      <div className="w-full bg-[#2A0845] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-purple-900/60 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight text-white hidden sm:inline">NIRVAHA AI Mobile</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-purple-200 uppercase tracking-wider">
            Mobile App View
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceMode('mobile_frame')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              deviceMode === 'mobile_frame'
                ? 'bg-[#9333EA] text-white shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Phone Frame</span>
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              deviceMode === 'responsive'
                ? 'bg-[#9333EA] text-white shadow-xs'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full Width</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full flex-1 flex justify-center items-start py-0 sm:py-6 px-0 sm:px-4">
        {deviceMode === 'mobile_frame' ? (
          /* Phone Frame Mockup for Realistic Mobile Preview */
          <div className="w-full max-w-[440px] bg-slate-900 sm:rounded-[48px] sm:p-3 sm:shadow-[0_25px_60px_-15px_rgba(42,8,69,0.35)] sm:border-[5px] sm:border-slate-800 transition-all flex flex-col overflow-hidden min-h-screen sm:min-h-[880px]">
            {/* Phone Screen Outer Shell */}
            <div className="w-full bg-[#FAF7FD] sm:rounded-[38px] flex-1 flex flex-col overflow-hidden relative shadow-inner">
              {/* Phone Status Bar */}
              <div className="bg-white/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-800 font-semibold z-40 select-none border-b border-purple-50">
                <span className="tracking-tight text-[11px] font-bold">{currentTime}</span>

                {/* Dynamic Island / Speaker Pill */}
                <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800 ml-auto mr-2" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-700">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4 text-slate-800" />
                </div>
              </div>

              {/* Scrollable Content inside Mobile Phone */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                {children}
              </div>

              {/* Bottom iOS Home Indicator */}
              <div className="hidden sm:flex justify-center py-2 bg-white/95 border-t border-purple-50 z-40">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive View */
          <div className="w-full max-w-6xl bg-transparent transition-all">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
