import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../services/userService';
import { getUserDisplayName, getUserRole } from '../utils/userUtils';
import { APP_CONFIG } from '../constants/appConstants';

/* ─── Sidebar nav items ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/org/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/org/inventory',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 'donor-requests',
    label: 'Donor Requests',
    path: '/org/donor-requests',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'hospital-requests',
    label: 'Hospital Requests',
    path: '/org/hospital-requests',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'camps',
    label: 'Camps',
    path: '/org/camps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/org/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
const OrgDashboardLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const dropdownRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitials = () => {
    const name = getUserDisplayName(user);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = getUserDisplayName(user);
  const roleLabel = getUserRole(user);

  // Current page label
  const currentNav = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: sidebarOpen ? '256px' : '72px',
          background: '#000000',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center px-4 border-b border-white/10"
          style={{ height: '64px', minHeight: '64px' }}
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <img
                src={APP_CONFIG.LOGO_PATH}
                alt="logo"
                className="w-7 h-7 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-white font-bold text-lg">B</span>
            )}
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">{APP_CONFIG.NAME}</p>
              <p className="text-red-300 text-xs leading-tight truncate">Organisation Portal</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/org/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.id}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={[
                  'flex items-center rounded-xl transition-all duration-200 group',
                  sidebarOpen ? 'px-3 py-2.5 space-x-3' : 'px-0 py-2.5 justify-center',
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-red-200 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {/* Active indicator bar */}
                <span
                  className={[
                    'absolute left-0 w-1 rounded-r-full transition-all duration-200',
                    isActive ? 'h-8 bg-white opacity-90' : 'h-0 opacity-0',
                  ].join(' ')}
                  style={{ position: 'relative' }}
                />
                <span
                  className={[
                    'flex-shrink-0 transition-colors duration-200',
                    isActive ? 'text-white' : 'text-red-300 group-hover:text-white',
                  ].join(' ')}
                >
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {isActive && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer – mini org info */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-red-300 text-xs truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/80">
              {roleLabel}
            </span>
          </div>
        )}
      </aside>

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Header */}
        <header
          className="flex items-center justify-between bg-white border-b border-gray-200 px-4 flex-shrink-0"
          style={{ height: '64px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
        >
          {/* Left: toggle + breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              id="sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Organisation</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {currentNav?.label || 'Dashboard'}
              </p>
            </div>
          </div>

          {/* Right: user avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="org-user-avatar-btn"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {getInitials()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                id="org-user-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                style={{ animation: 'orgFadeDown 0.18s ease-out' }}
              >
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 px-5 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white/40 flex-shrink-0">
                      {getInitials()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                      {user?.email && (
                        <p className="text-red-100 text-xs truncate mt-0.5">{user.email}</p>
                      )}
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-white/25 text-white">
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 py-3 space-y-2 border-b border-gray-100">
                  {user?.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="leading-snug">{user.address}</span>
                    </div>
                  )}
                  {user?.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a href={user.website} target="_blank" rel="noopener noreferrer"
                        className="text-red-600 hover:underline truncate">
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <div className="px-3 py-2">
                  <button
                    id="org-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes orgFadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrgDashboardLayout;
