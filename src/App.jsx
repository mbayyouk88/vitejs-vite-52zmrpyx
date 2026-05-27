import React, { useState, useEffect, useRef } from 'react';

const ROOMS = [
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Garage',
  'Basement',
  'ADU',
  'Other',
];

const initialChecklist = [
  {
    id: 1,
    section: 'VII',
    label: 'Types/quality of construction',
    checked: false,
  },
  {
    id: 2,
    section: 'VII',
    label: 'Floor plan issues & room count determination',
    checked: false,
  },
  {
    id: 3,
    section: 'VII',
    label: 'Observable condition factors and upgrades',
    checked: false,
  },
  {
    id: 4,
    section: 'VII',
    label: 'Recognition of adverse influences',
    checked: false,
  },
  {
    id: 5,
    section: 'VII',
    label: 'Virtual physical inspection completed',
    checked: false,
  },
  {
    id: 6,
    section: 'VII',
    label: 'Thorough description of improvements',
    checked: false,
  },
  { id: 7, section: 'VIII', label: 'Basements measured', checked: false },
  {
    id: 8,
    section: 'VIII',
    label: 'Stairways & vaulted ceiling areas measured',
    checked: false,
  },
  {
    id: 9,
    section: 'VIII',
    label: 'Below-grade living area (split level) measured',
    checked: false,
  },
  {
    id: 10,
    section: 'VIII',
    label: 'ADUs and outbuildings measured',
    checked: false,
  },
  {
    id: 11,
    section: 'VIII',
    label: 'Special assignment conditions noted',
    checked: false,
  },
  {
    id: 12,
    section: 'VIII',
    label: 'Common rounding practices applied',
    checked: false,
  },
  { id: 13, section: 'IX', label: 'Sketch completed', checked: false },
  {
    id: 14,
    section: 'IX',
    label: 'Final GLA determined (exclusions noted)',
    checked: false,
  },
];

const COLORS = {
  'Living Room': '#BFDBFE',
  Kitchen: '#BBF7D0',
  Bedroom: '#FDE68A',
  Bathroom: '#DDD6FE',
  Garage: '#E5E7EB',
  Basement: '#FECACA',
  ADU: '#FED7AA',
  Other: '#F9A8D4',
};

const GLA_EXCLUDED = ['Garage', 'Basement', 'ADU'];

function App() {
  const [tab, setTab] = useState('dashboard');
  const [property, setProperty] = useState({
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    type: 'Single Family',
    year: '1998',
    style: 'Ranch',
    beds: '3',
    baths: '2',
  });
  const [checklist, setChecklist] = useState(initialChecklist);
  const [rooms, setRooms] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt] = useState(null);
  const [currentPt, setCurrentPt] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [notes, setNotes] = useState('');
  const canvasRef = useRef(null);

  const gla = rooms
    .filter((r) => !GLA_EXCLUDED.includes(r.type))
    .reduce((sum, r) => sum + r.area, 0);

  const excludedArea = rooms
    .filter((r) => GLA_EXCLUDED.includes(r.type))
    .reduce((sum, r) => sum + r.area, 0);

  const completedCount = checklist.filter((c) => c.checked).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  const getCanvasPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) / 20) * 20,
      y: Math.round((clientY - rect.top) / 20) * 20,
    };
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const pos = getCanvasPos(e, canvas);
    setDrawing(true);
    setStartPt(pos);
    setCurrentPt(pos);
  };

  const handleCanvasMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const pos = getCanvasPos(e, canvas);
    setCurrentPt(pos);
  };

  const handleCanvasMouseUp = (e) => {
    if (!drawing || !startPt || !currentPt) return;
    setDrawing(false);
    const x = Math.min(startPt.x, currentPt.x);
    const y = Math.min(startPt.y, currentPt.y);
    const w = Math.abs(currentPt.x - startPt.x);
    const h = Math.abs(currentPt.y - startPt.y);
    if (w > 20 && h > 20) {
      const area = Math.round((w / 20) * (h / 20));
      setRooms((prev) => [
        ...prev,
        { id: Date.now(), type: selectedRoom, x, y, w, h, area },
      ]);
    }
    setStartPt(null);
    setCurrentPt(null);
  };

  const removeRoom = (id) =>
    setRooms((prev) => prev.filter((r) => r.id !== id));

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const sectionLabel = (s) =>
    ({
      VII: 'Section VII – Improvements Inspection',
      VIII: 'Section VIII – Measuring',
      IX: 'Section IX – Sketch Completion',
    }[s]);

  const sections = ['VII', 'VIII', 'IX'];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">ApexSketch</h1>
            <p className="text-blue-300 text-xs">PAREA Training Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200">Trainee: Jordan Ellis</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            JE
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="bg-white border-b shadow-sm px-6 flex gap-1 overflow-x-auto">
        {[
          { key: 'dashboard', label: '🏠 Dashboard' },
          { key: 'property', label: '📋 Property Info' },
          { key: 'checklist', label: '✅ Inspection Checklist' },
          { key: 'sketch', label: '✏️ Sketch Tool' },
          { key: 'gla', label: '📐 GLA Summary' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.key
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Assignment Overview
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Licensed Residential — PAREA Training Module
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-600">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Subject Property
                </p>
                <p className="font-bold text-gray-800">{property.address}</p>
                <p className="text-gray-500 text-sm">
                  {property.city}, {property.state} {property.zip}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Inspection Progress
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-gray-800">
                    {progress}%
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    {completedCount}/{checklist.length} items
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Current GLA
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {gla.toLocaleString()}{' '}
                  <span className="text-base font-normal text-gray-500">
                    sq ft
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {rooms.length} room(s) sketched
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold text-gray-700 mb-3">
                  📌 PAREA Sections Required
                </h3>
                <ul className="space-y-2 text-sm">
                  {sections.map((s) => {
                    const items = checklist.filter((c) => c.section === s);
                    const done = items.filter((c) => c.checked).length;
                    return (
                      <li key={s} className="flex items-center justify-between">
                        <span className="text-gray-600">{sectionLabel(s)}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            done === items.length
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {done}/{items.length}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold text-gray-700 mb-3">
                  📝 Mentor Notes
                </h3>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={5}
                  placeholder="Add notes for mentor review..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* PROPERTY INFO */}
        {tab === 'property' && (
          <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📋 Property Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Street Address', key: 'address' },
                { label: 'City', key: 'city' },
                { label: 'State', key: 'state' },
                { label: 'ZIP Code', key: 'zip' },
                { label: 'Property Type', key: 'type' },
                { label: 'Year Built', key: 'year' },
                { label: 'Style', key: 'style' },
                { label: 'Bedrooms', key: 'beds' },
                { label: 'Bathrooms', key: 'baths' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={property[field.key]}
                    onChange={(e) =>
                      setProperty((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
            <button className="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
              Save Property Info
            </button>
          </div>
        )}

        {/* CHECKLIST */}
        {tab === 'checklist' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              ✅ Inspection Checklist
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              PAREA Sections VII, VIII & IX — check off each item as completed
            </p>
            {sections.map((s) => (
              <div key={s} className="bg-white rounded-xl shadow p-5 mb-4">
                <h3 className="font-bold text-blue-800 mb-3">
                  {sectionLabel(s)}
                </h3>
                <ul className="space-y-3">
                  {checklist
                    .filter((c) => c.section === s)
                    .map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                        />
                        <span
                          className={`text-sm ${
                            item.checked
                              ? 'line-through text-gray-400'
                              : 'text-gray-700'
                          }`}
                        >
                          {item.label}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-blue-800 font-semibold">
                {completedCount} of {checklist.length} items complete —{' '}
                {progress}%
              </p>
              {progress === 100 && (
                <p className="text-green-600 text-sm mt-1">
                  ✅ Ready for Mentor Review (Section X)
                </p>
              )}
            </div>
          </div>
        )}

        {/* SKETCH TOOL */}
        {tab === 'sketch' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              ✏️ Floor Plan Sketch Tool
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Select a room type, then click and drag on the canvas to draw.
              Grid = 1 ft per unit.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {ROOMS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoom(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    selectedRoom === r
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              <div
                className="relative bg-white border-2 border-gray-300 rounded-xl overflow-hidden cursor-crosshair select-none"
                style={{ width: 600, height: 420 }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={() => {
                  setDrawing(false);
                  setStartPt(null);
                  setCurrentPt(null);
                }}
                ref={canvasRef}
              >
                {/* Grid */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Drawn Rooms */}
                {rooms.map((r) => (
                  <div
                    key={r.id}
                    className="absolute border-2 border-blue-700 flex flex-col items-center justify-center text-center"
                    style={{
                      left: r.x,
                      top: r.y,
                      width: r.w,
                      height: r.h,
                      backgroundColor: COLORS[r.type] + 'cc',
                    }}
                  >
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      {r.type}
                    </span>
                    <span className="text-xs text-gray-600">
                      {r.area} sq ft
                    </span>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeRoom(r.id);
                      }}
                      className="absolute top-0.5 right-1 text-red-500 text-xs font-bold hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Preview while drawing */}
                {drawing && startPt && currentPt && (
                  <div
                    className="absolute border-2 border-dashed border-blue-500 opacity-60 pointer-events-none"
                    style={{
                      left: Math.min(startPt.x, currentPt.x),
                      top: Math.min(startPt.y, currentPt.y),
                      width: Math.abs(currentPt.x - startPt.x),
                      height: Math.abs(currentPt.y - startPt.y),
                      backgroundColor: COLORS[selectedRoom] + '66',
                    }}
                  />
                )}
              </div>

              {/* Room List */}
              <div className="flex-1 min-w-48 bg-white rounded-xl shadow p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                  Room List
                </h3>
                {rooms.length === 0 && (
                  <p className="text-gray-400 text-xs">No rooms drawn yet.</p>
                )}
                <ul className="space-y-2">
                  {rooms.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: COLORS[r.type] }}
                        />
                        <span className="text-gray-700">{r.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{r.area} sq ft</span>
                        {GLA_EXCLUDED.includes(r.type) && (
                          <span className="text-red-400 text-xs italic">
                            excl.
                          </span>
                        )}
                        <button
                          onClick={() => removeRoom(r.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* GLA SUMMARY */}
        {tab === 'gla' && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              📐 GLA Summary
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              ANSI-compliant GLA calculation — Garage, Basement, and ADU are
              excluded from GLA.
            </p>

            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h3 className="font-semibold text-gray-600 text-sm uppercase mb-3">
                Included in GLA
              </h3>
              {rooms.filter((r) => !GLA_EXCLUDED.includes(r.type)).length ===
              0 ? (
                <p className="text-gray-400 text-sm">
                  No GLA rooms sketched yet.
                </p>
              ) : (
                rooms
                  .filter((r) => !GLA_EXCLUDED.includes(r.type))
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between text-sm py-1.5 border-b last:border-0"
                    >
                      <span className="text-gray-700">{r.type}</span>
                      <span className="font-medium text-gray-800">
                        {r.area.toLocaleString()} sq ft
                      </span>
                    </div>
                  ))
              )}
              <div className="flex justify-between font-bold text-blue-800 text-base mt-3 pt-3 border-t-2">
                <span>Total GLA</span>
                <span>{gla.toLocaleString()} sq ft</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h3 className="font-semibold text-gray-600 text-sm uppercase mb-3">
                Excluded from GLA
              </h3>
              {rooms.filter((r) => GLA_EXCLUDED.includes(r.type)).length ===
              0 ? (
                <p className="text-gray-400 text-sm">
                  No excluded areas added.
                </p>
              ) : (
                rooms
                  .filter((r) => GLA_EXCLUDED.includes(r.type))
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between text-sm py-1.5 border-b last:border-0"
                    >
                      <span className="text-gray-600">{r.type}</span>
                      <span className="text-gray-500">
                        {r.area.toLocaleString()} sq ft
                      </span>
                    </div>
                  ))
              )}
              <div className="flex justify-between text-gray-500 text-sm mt-3 pt-3 border-t">
                <span>Total Excluded</span>
                <span>{excludedArea.toLocaleString()} sq ft</span>
              </div>
            </div>

            <div className="bg-blue-900 text-white rounded-xl p-5 flex justify-between items-center">
              <div>
                <p className="text-blue-300 text-xs uppercase tracking-wide">
                  Final GLA (ANSI-Compliant)
                </p>
                <p className="text-3xl font-bold">
                  {gla.toLocaleString()} sq ft
                </p>
              </div>
              <button className="bg-white text-blue-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                Export Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
