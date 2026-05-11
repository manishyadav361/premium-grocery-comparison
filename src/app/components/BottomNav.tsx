import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Search, Bookmark, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/profile', icon: User, label: 'Profile' },
];

/** Width of the desktop sidebar — import in screens to add left padding on lg+ */
export const SIDEBAR_WIDTH = 220;

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedItems, alerts } = useApp();

  const isActive = (path: string) =>
    location.pathname === path || (path === '/search' && location.pathname.includes('products'));

  const badge = (path: string) =>
    path === '/saved' ? savedItems.length : path === '/alerts' ? alerts.filter(a => a.enabled).length : 0;

  return (
    <>
      {/* ── MOBILE / TABLET: bottom tab bar (hidden on lg+) ─────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        <div className="bg-white border-t border-gray-100 px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around max-w-2xl mx-auto">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              const count = badge(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 relative min-w-[56px]"
                >
                  <div className="relative">
                    <Icon
                      size={22}
                      className={active ? 'text-emerald-500' : 'text-gray-400'}
                      strokeWidth={active ? 2.5 : 1.8}
                      fill={active && (label === 'Saved' || label === 'Home') ? 'currentColor' : 'none'}
                    />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {label}
                  </span>
                  {active && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: fixed left sidebar (visible on lg+) ─────────────────── */}
      <div
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col"
        style={{ width: `${SIDEBAR_WIDTH}px` }}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm px-3 py-6">
          {/* Brand */}
          <div className="flex items-center gap-2 px-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/30">
              <span className="text-white font-black text-xs">PC</span>
            </div>
            <div>
              <p className="text-gray-900 font-black text-sm leading-none">PriceCart</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Grocery Comparator</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 flex-1">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              const count = badge(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative ${active
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.8}
                    fill={active && (label === 'Saved' || label === 'Home') ? 'currentColor' : 'none'}
                  />
                  <span className="font-semibold text-sm">{label}</span>
                  {count > 0 && (
                    <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {count}
                    </span>
                  )}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 pt-4 border-t border-gray-100">
            <p className="text-gray-300 text-[10px]">© 2025 PriceCart</p>
          </div>
        </div>
      </div>
    </>
  );
};