import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getStoredUser } from '../../services/userService';
import OrgDashboardLayout from '../../components/OrgDashboardLayout';

/* ─── Constants ─────────────────────────────────────────────────────── */
const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

const EMPTY_FORM = {
  name: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  capacity: '',
  description: '',
  contactPerson: '',
  contactPhone: '',
  requiredBloodGroups: [],
};

/* ─── Helpers ───────────────────────────────────────────────────────── */
/**
 * Auto-derive status from the camp date:
 *  Upcoming  → date is in the future
 *  Active    → date is today
 *  Completed → date is in the past
 */
const deriveStatus = (dateStr) => {
  if (!dateStr) return 'Upcoming';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const campDate = new Date(dateStr);
  campDate.setHours(0, 0, 0, 0);
  if (campDate.getTime() === today.getTime()) return 'Active';
  if (campDate > today) return 'Upcoming';
  return 'Completed';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

/* ─── Status config ─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Upcoming:  { label: 'Upcoming',  badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   icon: '🗓️' },
  Active:    { label: 'Active',    badge: 'bg-green-100 text-green-700', dot: 'bg-green-500',  icon: '🟢', pulse: true },
  Completed: { label: 'Completed', badge: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400',   icon: '✅' },
};

/* ─── Seed data scoped to org ───────────────────────────────────────── */
const makeSeedData = (orgId) => [
  {
    id: 'C001', orgId,
    name: 'Spring Donation Drive',
    location: 'Community Hall, Pune',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split('T')[0]; })(),
    startTime: '09:00', endTime: '15:00',
    capacity: 100, registered: 72,
    description: 'Annual spring blood donation event open to all.',
    contactPerson: 'Dr. Mehta', contactPhone: '9876543210',
    requiredBloodGroups: ['O+', 'O−', 'AB+'],
  },
  {
    id: 'C002', orgId,
    name: 'City Blood Camp',
    location: 'Town Square, Mumbai',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toISOString().split('T')[0]; })(),
    startTime: '08:00', endTime: '14:00',
    capacity: 150, registered: 0,
    description: 'Open blood donation camp for Mumbai citizens.',
    contactPerson: 'Ms. Sharma', contactPhone: '9765432100',
    requiredBloodGroups: ['B+', 'B−'],
  },
  {
    id: 'C003', orgId,
    name: 'University Camp',
    location: 'IIT Bombay Campus',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().split('T')[0]; })(),
    startTime: '10:00', endTime: '16:00',
    capacity: 200, registered: 198,
    description: 'Campus-wide blood donation drive.',
    contactPerson: 'Prof. Rao', contactPhone: '9654321098',
    requiredBloodGroups: [],
  },
  {
    id: 'C004', orgId,
    name: 'Corporate Blood Drive',
    location: 'Infosys Campus, Pune',
    date: new Date().toISOString().split('T')[0], // today → Active
    startTime: '09:00', endTime: '13:00',
    capacity: 80, registered: 45,
    description: 'In-office blood donation for corporate employees.',
    contactPerson: 'HR Team', contactPhone: '9543210987',
    requiredBloodGroups: ['A+', 'A−'],
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Upcoming;
  return (
    <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
      {cfg.pulse ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
        </span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      )}
      <span>{cfg.label}</span>
    </span>
  );
};

const ProgressBar = ({ value, max }) => {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const color = pct >= 90 ? 'from-green-400 to-green-600' : pct >= 50 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-red-600';
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Registrations</span>
        <span className="font-semibold text-gray-700">{value} / {max}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-500 font-semibold mt-0.5">{pct}%</p>
    </div>
  );
};

/* ─── Create Camp Modal ──────────────────────────────────────────────── */
const CreateCampModal = ({ onClose, onSave, orgId, orgName }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, name: orgName });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  // Trap focus / close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleBloodGroup = (bg) => {
    setForm((f) => ({
      ...f,
      requiredBloodGroups: f.requiredBloodGroups.includes(bg)
        ? f.requiredBloodGroups.filter((g) => g !== bg)
        : [...f.requiredBloodGroups, bg],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.startTime) e.startTime = 'Start time is required';
    if (!form.endTime) e.endTime = 'End time is required';
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
      e.capacity = 'Valid capacity is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newCamp = {
      id: `C${Date.now()}`,
      orgId,
      ...form,
      capacity: Number(form.capacity),
      registered: 0,
    };
    onSave(newCamp);
  };

  const today = new Date().toISOString().split('T')[0];

  const InputField = ({ label, id, required, error, children }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ animation: 'orgFadeDown 0.2s ease-out' }}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Schedule New Camp</h2>
            <p className="text-red-200 text-xs mt-0.5">Fill in the details to create a donation camp</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Section: Basic Info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic Information</p>
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Camp Name" id="campName" required>
                <div className="w-full text-sm border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                  <span className="font-semibold text-gray-800 truncate">{orgName}</span>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">Auto</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Camp is automatically named after your organisation</p>
              </InputField>

              <InputField label="Location" id="campLocation" required error={errors.location}>
                <input
                  id="campLocation"
                  type="text"
                  value={form.location}
                  onChange={(e) => field('location', e.target.value)}
                  placeholder="e.g. Community Hall, Pune"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>

              <InputField label="Description" id="campDesc">
                <textarea
                  id="campDesc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => field('description', e.target.value)}
                  placeholder="Brief description of the camp…"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent resize-none"
                />
              </InputField>
            </div>
          </div>

          {/* Section: Date & Time */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Date & Time</p>
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Date" id="campDate" required error={errors.date}>
                <input
                  id="campDate"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => field('date', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>
              <InputField label="Start Time" id="startTime" required error={errors.startTime}>
                <input
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => field('startTime', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>
              <InputField label="End Time" id="endTime" required error={errors.endTime}>
                <input
                  id="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => field('endTime', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>
            </div>
          </div>

          {/* Section: Capacity */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Capacity</p>
            <InputField label="Max Donors" id="campCapacity" required error={errors.capacity}>
              <input
                id="campCapacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => field('capacity', e.target.value)}
                placeholder="e.g. 100"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
              />
            </InputField>
          </div>

          {/* Section: Contact (optional) */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Person <span className="font-normal normal-case text-gray-400">(optional)</span></p>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Contact Name" id="contactPerson">
                <input
                  id="contactPerson"
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => field('contactPerson', e.target.value)}
                  placeholder="e.g. Dr. Mehta"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>
              <InputField label="Contact Phone" id="contactPhone">
                <input
                  id="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => field('contactPhone', e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                />
              </InputField>
            </div>
          </div>

          {/* Section: Required Blood Groups (optional) */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Required Blood Groups <span className="font-normal normal-case text-gray-400">(optional)</span></p>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const selected = form.requiredBloodGroups.includes(bg);
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => toggleBloodGroup(bg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-150 ${
                      selected
                        ? 'bg-red-600 border-red-600 text-white shadow-sm scale-105'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview status badge */}
          {form.date && (
            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 font-medium">Camp status will be:</span>
              <StatusBadge status={deriveStatus(form.date)} />
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow"
            >
              Create Camp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Camp Detail Modal ──────────────────────────────────────────────── */
const CampDetailModal = ({ camp, onClose, onDelete }) => {
  const status = deriveStatus(camp.date);
  const modalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: 'orgFadeDown 0.2s ease-out' }}
      >
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{camp.name}</h2>
            <p className="text-red-200 text-xs mt-0.5">{camp.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={status} />
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">📍 Location</p>
              <p className="font-semibold text-gray-800">{camp.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">🗓️ Date</p>
              <p className="font-semibold text-gray-800">{formatDate(camp.date)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">⏰ Time</p>
              <p className="font-semibold text-gray-800">{camp.startTime} – {camp.endTime}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">👥 Capacity</p>
              <p className="font-semibold text-gray-800">{camp.registered} / {camp.capacity}</p>
            </div>
            {camp.contactPerson && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">👤 Contact</p>
                <p className="font-semibold text-gray-800">{camp.contactPerson}</p>
              </div>
            )}
            {camp.contactPhone && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">📞 Phone</p>
                <p className="font-semibold text-gray-800">{camp.contactPhone}</p>
              </div>
            )}
          </div>

          {camp.description && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="text-xs text-gray-400 font-medium mb-0.5">📋 Description</p>
              <p className="text-gray-700">{camp.description}</p>
            </div>
          )}

          {camp.requiredBloodGroups?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">🩸 Required Blood Groups</p>
              <div className="flex flex-wrap gap-2">
                {camp.requiredBloodGroups.map((bg) => (
                  <span key={bg} className="px-3 py-1 rounded-xl bg-red-50 text-red-700 font-bold text-xs border border-red-100">
                    {bg}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ProgressBar value={camp.registered} max={camp.capacity} />

          <div className="flex items-center space-x-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Close
            </button>
            {status !== 'Completed' && (
              <button
                onClick={() => { onDelete(camp.id); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium border border-red-200 transition-colors">
                Cancel Camp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────── */
const OrgCamps = () => {
  const [user, setUser] = useState(null);
  const [camps, setCamps] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      const cached = getStoredUser();
      if (cached) {
        setUser(cached);
        setCamps(makeSeedData(cached._id || cached.id || 'org-1'));
      }
      const fresh = await getCurrentUser();
      if (fresh) {
        setUser(fresh);
        setCamps(makeSeedData(fresh._id || fresh.id || 'org-1'));
      }
    };
    init();
  }, []);

  const handleCreate = (newCamp) => {
    setCamps((prev) => [newCamp, ...prev]);
    setShowCreate(false);
  };

  const handleDelete = (id) => {
    setCamps((prev) => prev.filter((c) => c.id !== id));
  };

  // Enrich each camp with its derived status
  const enriched = camps.map((c) => ({ ...c, status: deriveStatus(c.date) }));

  const filterTabs = ['All', 'Upcoming', 'Active', 'Completed'];

  const filtered = enriched.filter((c) => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = filterTabs.reduce((acc, tab) => {
    acc[tab] = tab === 'All' ? enriched.length : enriched.filter((c) => c.status === tab).length;
    return acc;
  }, {});

  return (
    <OrgDashboardLayout user={user}>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blood Donation Camps</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.organisationName || user?.name || 'Your organisation'}'s camps
          </p>
        </div>
        <button
          id="schedule-camp-btn"
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Schedule Camp</span>
        </button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: counts.All, color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Upcoming', value: counts.Upcoming, color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: 'Active', value: counts.Active, color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Completed', value: counts.Completed, color: 'bg-gray-50 border-gray-200 text-gray-500' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="flex space-x-2 flex-wrap gap-y-2">
          {filterTabs.map((s) => (
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
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === s ? 'bg-white/25' : 'bg-gray-100'}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search camps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 w-48"
          />
        </div>
      </div>

      {/* Camp Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">{camp.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{camp.id}</p>
              </div>
              <StatusBadge status={camp.status} />
            </div>

            {/* Info rows */}
            <div className="space-y-1.5 mb-4 flex-1">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{camp.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(camp.date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{camp.startTime} – {camp.endTime}</span>
              </div>
              {camp.requiredBloodGroups?.length > 0 && (
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 pt-0.5">
                  <span className="text-xs text-gray-400 flex-shrink-0">🩸</span>
                  {camp.requiredBloodGroups.map((bg) => (
                    <span key={bg} className="text-xs px-1.5 py-0.5 rounded-lg bg-red-50 text-red-700 font-bold">
                      {bg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <ProgressBar value={camp.registered} max={camp.capacity} />

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={() => setSelectedCamp(camp)}
                className="flex-1 text-xs font-semibold py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              {camp.status !== 'Completed' && (
                <button
                  onClick={() => handleDelete(camp.id)}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Cancel Camp
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">No camps found</p>
            <p className="text-gray-400 text-xs mt-1">Try a different filter or schedule a new camp</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 text-xs font-semibold text-red-600 hover:underline"
            >
              + Schedule your first camp
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCampModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
          orgId={user?._id || user?.id || 'org-1'}
        />
      )}
      {selectedCamp && (
        <CampDetailModal
          camp={selectedCamp}
          onClose={() => setSelectedCamp(null)}
          onDelete={handleDelete}
        />
      )}
    </OrgDashboardLayout>
  );
};

export default OrgCamps;
