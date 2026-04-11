import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStoredUser } from '../../services/userService';
import OrgDashboardLayout from '../../components/OrgDashboardLayout';

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

const initialInventory = [
  { id: 1, group: 'A+',  units: 320, expiry: '2026-05-10', status: 'Good' },
  { id: 2, group: 'A−',  units: 80,  expiry: '2026-04-28', status: 'Low' },
  { id: 3, group: 'B+',  units: 280, expiry: '2026-05-15', status: 'Good' },
  { id: 4, group: 'B−',  units: 60,  expiry: '2026-04-20', status: 'Critical' },
  { id: 5, group: 'AB+', units: 200, expiry: '2026-05-18', status: 'Good' },
  { id: 6, group: 'AB−', units: 40,  expiry: '2026-04-25', status: 'Critical' },
  { id: 7, group: 'O+',  units: 220, expiry: '2026-05-12', status: 'Good' },
  { id: 8, group: 'O−',  units: 48,  expiry: '2026-04-22', status: 'Low' },
];

const statusStyle = {
  Good:     'bg-green-100 text-green-700',
  Low:      'bg-yellow-100 text-yellow-700',
  Critical: 'bg-red-100 text-red-700',
};

const OrgInventory = () => {
  const [user, setUser] = useState(null);
  const [inventory] = useState(initialInventory);
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await getCurrentUser();
      if (fresh) setUser(fresh);
    };
    init();
  }, []);

  const filtered = inventory.filter((item) => {
    const matchGroup = filterGroup === 'All' || item.group === filterGroup;
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchSearch = item.group.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchStatus && matchSearch;
  });

  const total = inventory.reduce((s, i) => s + i.units, 0);
  const critical = inventory.filter((i) => i.status === 'Critical').length;
  const low = inventory.filter((i) => i.status === 'Low').length;

  return (
    <OrgDashboardLayout user={user}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your blood stock levels</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Stock</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Units</p>
          <p className="text-3xl font-bold text-gray-900">{total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm">
          <p className="text-xs text-yellow-600 uppercase tracking-wide mb-1">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600">{low}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
          <p className="text-xs text-red-600 uppercase tracking-wide mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-600">{critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search blood group…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <option value="All">All Groups</option>
          {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <option value="All">All Status</option>
          <option>Good</option>
          <option>Low</option>
          <option>Critical</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['#', 'Blood Group', 'Units', 'Expiry Date', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-red-50/40 transition-colors">
                <td className="px-5 py-3 text-gray-400 font-mono text-xs">{row.id}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-red-50 text-red-700 font-bold text-sm">
                    {row.group}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800">{row.units}</td>
                <td className="px-5 py-3 text-gray-600">{row.expiry}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </OrgDashboardLayout>
  );
};

export default OrgInventory;
