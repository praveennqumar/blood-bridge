import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStoredUser } from '../../services/userService';
import OrgDashboardLayout from '../../components/OrgDashboardLayout';

const hospitalData = [
  { id: 'HR001', hospital: 'City General Hospital', group: 'AB+', units: 5, urgency: 'Urgent',  date: '2026-04-10', status: 'Pending' },
  { id: 'HR002', hospital: 'Apollo Clinic',         group: 'A+',  units: 3, urgency: 'Normal',  date: '2026-04-09', status: 'Approved' },
  { id: 'HR003', hospital: 'Fortis Hospital',       group: 'O−',  units: 8, urgency: 'Critical', date: '2026-04-09', status: 'Pending' },
  { id: 'HR004', hospital: 'AIIMS Delhi',            group: 'B+',  units: 4, urgency: 'Normal',  date: '2026-04-08', status: 'Completed' },
  { id: 'HR005', hospital: 'Medanta',                group: 'AB−', units: 2, urgency: 'Urgent',  date: '2026-04-07', status: 'Rejected' },
];

const statusStyle = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Approved:  'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Rejected:  'bg-red-100 text-red-700',
};

const urgencyStyle = {
  Normal:   'bg-gray-100 text-gray-600',
  Urgent:   'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const OrgHospitalRequests = () => {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const init = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await getCurrentUser();
      if (fresh) setUser(fresh);
    };
    init();
  }, []);

  const filtered = filter === 'All' ? hospitalData : hospitalData.filter((r) => r.status === filter);

  return (
    <OrgDashboardLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hospital Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">Blood requests from hospitals and clinics</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Request</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-5">
        {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${
              filter === s
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Request ID', 'Hospital', 'Blood Group', 'Units', 'Urgency', 'Date', 'Status', 'Action'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-red-50/40 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{r.id}</td>
                <td className="px-5 py-3 font-semibold text-gray-800">{r.hospital}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-orange-50 text-orange-700 font-bold text-xs">{r.group}</span>
                </td>
                <td className="px-5 py-3 text-gray-700">{r.units}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyStyle[r.urgency]}`}>{r.urgency}</span>
                </td>
                <td className="px-5 py-3 text-gray-600">{r.date}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-green-600 hover:underline">Approve</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-xs text-red-600 hover:underline">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </OrgDashboardLayout>
  );
};

export default OrgHospitalRequests;
