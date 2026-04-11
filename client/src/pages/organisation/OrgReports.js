import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStoredUser } from '../../services/userService';
import OrgDashboardLayout from '../../components/OrgDashboardLayout';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const donationsPerMonth = [120, 95, 140, 180, 160, 200, 175, 210, 190, 230, 215, 250];
const requestsPerMonth  = [80,  70,  110, 130, 120, 160, 140, 170, 150, 190, 175, 200];

const maxVal = Math.max(...donationsPerMonth, ...requestsPerMonth);

const bloodSummary = [
  { group: 'A+',  donated: 320, issued: 210 },
  { group: 'A−',  donated: 80,  issued: 60  },
  { group: 'B+',  donated: 280, issued: 190 },
  { group: 'B−',  donated: 60,  issued: 45  },
  { group: 'AB+', donated: 200, issued: 140 },
  { group: 'AB−', donated: 40,  issued: 30  },
  { group: 'O+',  donated: 220, issued: 160 },
  { group: 'O−',  donated: 48,  issued: 38  },
];

const OrgReports = () => {
  const [user, setUser] = useState(null);
  const [period, setPeriod] = useState('Yearly');

  useEffect(() => {
    const init = async () => {
      const cached = getStoredUser();
      if (cached) setUser(cached);
      const fresh = await getCurrentUser();
      if (fresh) setUser(fresh);
    };
    init();
  }, []);

  const totalDonated = donationsPerMonth.reduce((a, b) => a + b, 0);
  const totalIssued  = requestsPerMonth.reduce((a, b) => a + b, 0);

  return (
    <OrgDashboardLayout user={user}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of donations and blood distribution</p>
        </div>
        <button className="flex items-center space-x-2 border border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors bg-white shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Donated', value: totalDonated, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          { label: 'Total Issued',  value: totalIssued,  color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
          { label: 'Net Stock',     value: totalDonated - totalIssued, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'Camps Held',    value: 24,           color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 border ${s.border} ${s.bg}`}>
            <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${s.color} opacity-70`}>{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">units · {period.toLowerCase()}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-800">Donation vs Requests</h2>
            <p className="text-xs text-gray-500 mt-0.5">Monthly comparison – 2026</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
              <span className="text-gray-600">Donations</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" />
              <span className="text-gray-600">Requests</span>
            </span>
          </div>
        </div>

        {/* Chart bars */}
        <div className="flex items-end space-x-2 h-40">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center space-y-1">
              <div className="flex items-end space-x-0.5 w-full justify-center" style={{ height: '120px' }}>
                <div
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-red-500 to-red-400 max-w-[14px] transition-all duration-700"
                  style={{ height: `${(donationsPerMonth[i] / maxVal) * 100}%` }}
                  title={`Donations: ${donationsPerMonth[i]}`}
                />
                <div
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-orange-400 to-orange-300 max-w-[14px] transition-all duration-700"
                  style={{ height: `${(requestsPerMonth[i] / maxVal) * 100}%` }}
                  title={`Requests: ${requestsPerMonth[i]}`}
                />
              </div>
              <span className="text-xs text-gray-400 font-medium">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Group Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Blood Group Summary</h2>
          <p className="text-xs text-gray-500 mt-0.5">Total donations and issuance by blood group</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Blood Group', 'Units Donated', 'Units Issued', 'Net Balance', 'Utilisation'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bloodSummary.map((r) => {
              const net = r.donated - r.issued;
              const util = Math.round((r.issued / r.donated) * 100);
              return (
                <tr key={r.group} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-red-50 text-red-700 font-bold text-xs">{r.group}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-800 font-semibold">{r.donated}</td>
                  <td className="px-5 py-3 text-gray-700">{r.issued}</td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>{net >= 0 ? '+' : ''}{net}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[80px]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-red-400 to-red-600"
                          style={{ width: `${util}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{util}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </OrgDashboardLayout>
  );
};

export default OrgReports;
