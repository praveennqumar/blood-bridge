import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStoredUser } from '../../services/userService';
import OrgDashboardLayout from '../../components/OrgDashboardLayout';
import Loading from '../../components/Loading';

/* ─── Stat Card ──────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, gradient, ring }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}
    style={{ boxShadow: `0 4px 24px ${ring}` }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-white/70 mb-1">{label}</p>
        <p className="text-4xl font-bold">{value}</p>
        {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
    {/* decorative circle */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
  </div>
);

/* ─── Blood Group Row ────────────────────────────────────────────────── */
const BloodRow = ({ group, units, pct }) => (
  <div className="flex items-center space-x-3">
    <span className="w-10 text-center font-bold text-sm text-red-700 bg-red-50 rounded-lg py-1 flex-shrink-0">
      {group}
    </span>
    <div className="flex-1 bg-gray-100 rounded-full h-2">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-600"
        style={{ width: `${pct}%`, transition: 'width 0.6s ease' }}
      />
    </div>
    <span className="text-xs font-semibold text-gray-600 w-12 text-right flex-shrink-0">
      {units} u
    </span>
  </div>
);

/* ─── OrgDashboard ───────────────────────────────────────────────────── */
const OrgDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await getCurrentUser();
      if (fresh) setUser(fresh);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <OrgDashboardLayout user={user}>
        <Loading message="Loading dashboard..." />
      </OrgDashboardLayout>
    );
  }

  const stats = [
    {
      label: 'Total Inventory',
      value: '1,248',
      sub: 'units available',
      gradient: 'bg-gradient-to-br from-red-500 to-red-700',
      ring: 'rgba(239,68,68,0.3)',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Donor Requests',
      value: '34',
      sub: '8 pending review',
      gradient: 'bg-gradient-to-br from-rose-500 to-pink-700',
      ring: 'rgba(244,63,94,0.3)',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label: 'Hospital Requests',
      value: '19',
      sub: '5 urgent',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
      ring: 'rgba(249,115,22,0.3)',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Camps This Month',
      value: '6',
      sub: '2 upcoming',
      gradient: 'bg-gradient-to-br from-red-600 to-rose-900',
      ring: 'rgba(159,18,57,0.3)',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const bloodGroups = [
    { group: 'A+', units: 320, pct: 80 },
    { group: 'A−', units: 80, pct: 20 },
    { group: 'B+', units: 280, pct: 70 },
    { group: 'B−', units: 60, pct: 15 },
    { group: 'AB+', units: 200, pct: 50 },
    { group: 'AB−', units: 40, pct: 10 },
    { group: 'O+', units: 220, pct: 55 },
    { group: 'O−', units: 48, pct: 12 },
  ];

  const recentRequests = [
    { id: 'R001', type: 'Donor', name: 'Arjun Sharma', group: 'O+', units: 2, status: 'Pending', time: '2h ago' },
    { id: 'R002', type: 'Hospital', name: 'City General Hospital', group: 'AB+', units: 5, status: 'Approved', time: '4h ago' },
    { id: 'R003', type: 'Donor', name: 'Priya Nair', group: 'B−', units: 1, status: 'Pending', time: '6h ago' },
    { id: 'R004', type: 'Hospital', name: 'Apollo Clinic', group: 'A+', units: 3, status: 'Urgent', time: '8h ago' },
    { id: 'R005', type: 'Donor', name: 'Rahul Verma', group: 'O−', units: 2, status: 'Approved', time: '1d ago' },
  ];

  const statusConfig = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Urgent: 'bg-red-100 text-red-700',
  };

  return (
    <OrgDashboardLayout user={user}>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-red-200 text-sm font-medium mb-1">Welcome back 👋</p>
          <h1 className="text-2xl font-bold mb-1">
            {user?.organisationName || user?.name || 'Organisation'}
          </h1>
          <p className="text-red-200 text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 right-16 w-32 h-32 rounded-full bg-white/5 translate-y-8" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Bottom Grid: Blood Inventory + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Blood Group Inventory */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">Blood Inventory</h2>
              <p className="text-xs text-gray-500 mt-0.5">Current stock levels</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-red-50 text-red-600 rounded-lg">
              Live
            </span>
          </div>
          <div className="space-y-3">
            {bloodGroups.map((b) => (
              <BloodRow key={b.group} {...b} />
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">Recent Requests</h2>
              <p className="text-xs text-gray-500 mt-0.5">Donor & hospital requests</p>
            </div>
            <button className="text-xs font-medium text-red-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentRequests.map((r) => (
              <div key={r.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${r.type === 'Donor' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  {r.group}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.type} · {r.units} unit{r.units > 1 ? 's' : ''} · {r.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusConfig[r.status]}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OrgDashboardLayout>
  );
};

export default OrgDashboard;
