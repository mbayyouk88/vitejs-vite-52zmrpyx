import React, { useState, useEffect, useRef } from 'react';



const ROOMS = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Garage', 'Basement', 'ADU', 'Other'];
const GLA_EXCLUDED = ['Garage', 'Basement', 'ADU'];
const COLORS = {
  'Living Room': '#BFDBFE', Kitchen: '#BBF7D0', Bedroom: '#FDE68A',
  Bathroom: '#DDD6FE', Garage: '#E5E7EB', Basement: '#FECACA',
  ADU: '#FED7AA', Other: '#F9A8D4',
};

const CHECKLIST = [
  { id: 1, section: 'VII', label: 'Types & quality of construction noted' },
  { id: 2, section: 'VII', label: 'Floor plan issues & room count determined' },
  { id: 3, section: 'VII', label: 'Condition factors & upgrades documented' },
  { id: 4, section: 'VII', label: 'Adverse influences identified' },
  { id: 5, section: 'VII', label: 'Virtual inspection completed' },
  { id: 6, section: 'VII', label: 'Description of improvements written' },
  { id: 7, section: 'VIII', label: 'Basement area measured' },
  { id: 8, section: 'VIII', label: 'Stairways & vaulted ceilings measured' },
  { id: 9, section: 'VIII', label: 'Below-grade / split-level area measured' },
  { id: 10, section: 'VIII', label: 'ADUs & outbuildings measured' },
  { id: 11, section: 'VIII', label: 'Special assignment conditions noted' },
  { id: 12, section: 'VIII', label: 'Rounding practices applied' },
  { id: 13, section: 'IX', label: 'Sketch completed' },
  { id: 14, section: 'IX', label: 'Final GLA determined & exclusions noted' },
];

const SECTION_LABELS = {
  VII: 'Section VII – Improvements Inspection',
  VIII: 'Section VIII – Measuring',
  IX: 'Section IX – Sketch Completion',
};

function App() {
  const [tab, setTab] = useState('dashboard');
  const [checklist, setChecklist] = useState(CHECKLIST.map(c => ({ ...c, checked: false })));
  const [rooms, setRooms] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt] = useState(null);
  const [currentPt, setCurrentPt] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [notes, setNotes] = useState('');
  const [improvements, setImprovements] = useState('');
  const [property, setProperty] = useState({
    address: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', zip: '62701',
    type: 'Single Family', year: '1998', style: 'Ranch', beds: '3', baths: '2',
    quality: '', condition: '', adverse: '',
  });
  const canvasRef = useRef(null);

  const gla = rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).reduce((s, r) => s + r.area, 0);
  const excludedArea = rooms.filter(r => GLA_EXCLUDED.includes(r.type)).reduce((s, r) => s + r.area, 0);
  const completedCount = checklist.filter(c => c.checked).length;
  const progress = Math.round((completedCount / CHECKLIST.length) * 100);

  const toggle = (id) => setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

  const getPos = (e, el) => {
    const rect = el.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.round((cx - rect.left) / 20) * 20, y: Math.round((cy - rect.top) / 20) * 20 };
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">

      {/* Header */}
      <header className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">ApexSketch</h1>
            <p className="text-blue-300 text-xs">PAREA Training Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200 hidden sm:block">Trainee: Jordan Ellis</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">JE</div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b shadow-sm px-4 flex gap-1 overflow-x-auto">
        {[
          { key: 'dashboard', label: '🏠 Overview' },
          { key: 'property', label: '📋 Property Info' },
          { key: 'inspection', label: '🔍 Inspection Notes' },
          { key: 'sketch', label: '✏️ Sketch Tool' },
          { key: 'gla', label: '📐 GLA Summary' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-1">

        {/* Sidebar Checklist */}
        <aside className="w-64 bg-white border-r shadow-inner overflow-y-auto flex-shrink-0 hidden md:flex flex-col">
          <div className="px-4 py-3 border-b bg-gray-50 sticky top-0 z-10">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">PAREA Checklist</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{completedCount}/{CHECKLIST.length} complete</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {['VII', 'VIII', 'IX'].map(s => (
            <div key={s} className="border-b">
              <p className="px-4 pt-3 pb-1 text-xs font-bold text-blue-800 uppercase tracking-wide">{SECTION_LABELS[s]}</p>
              {checklist.filter(c => c.section === s).map(item => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className="w-full flex items-start gap-2 px-4 py-2 text-left hover:bg-blue-50 transition">
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold transition ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}>
                    ✓
                  </span>
                  <span className={`text-xs leading-snug ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {progress === 100 && (
            <div className="m-3 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-700 text-xs font-semibold">✅ Ready for Mentor Review!</p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* OVERVIEW */}
          {tab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Assignment Overview</h2>
              <p className="text-gray-500 text-sm mb-5">Licensed Residential — PAREA Training Module</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-600">
                  <p className="text-xs text-gray-500 uppercase mb-1">Subject Property</p>
                  <p className="font-bold text-gray-800">{property.address}</p>
                  <p className="text-gray-500 text-sm">{property.city}, {property.state} {property.zip}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                  <p className="text-xs text-gray-500 uppercase mb-1">Inspection Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{progress}%</p>
                  <p className="text-xs text-gray-500">{completedCount}/{CHECKLIST.length} items checked off</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 uppercase mb-1">Current GLA</p>
                  <p className="text-2xl font-bold text-gray-800">{gla.toLocaleString()} <span className="text-sm font-normal text-gray-500">sq ft</span></p>
                  <p className="text-xs text-gray-500">{rooms.length} room(s) sketched</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">📌 PAREA Section Progress</h3>
                  {['VII', 'VIII', 'IX'].map(s => {
                    const items = checklist.filter(c => c.section === s);
                    const done = items.filter(c => c.checked).length;
                    return (
                      <div key={s} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-sm text-gray-600">{SECTION_LABELS[s]}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${done === items.length ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{done}/{items.length}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">📝 Mentor Notes</h3>
                  <textarea rows={5} value={notes} onChange={e => setNotes(e.target.value)}
                    className="w-full border rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add notes for mentor review..." />
                </div>
              </div>
            </div>
          )}

          {/* PROPERTY INFO */}
          {tab === 'property' && (
            <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Property Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Street Address', key: 'address' }, { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' }, { label: 'ZIP Code', key: 'zip' },
                  { label: 'Property Type', key: 'type' }, { label: 'Year Built', key: 'year' },
                  { label: 'Architectural Style', key: 'style' }, { label: 'Bedrooms', key: 'beds' },
                  { label: 'Bathrooms', key: 'baths' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}</label>
                    <input type="text" value={property[f.key]}
                      onChange={e => setProperty(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ))}
              </div>
              <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
                Save Property Info
              </button>
            </div>
          )}

          {/* INSPECTION NOTES */}
          {tab === 'inspection' && (
            <div className="max-w-2xl space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-1">🔍 Inspection Notes</h2>
              <p className="text-gray-500 text-sm mb-2">Document your findings from the virtual inspection. These notes will carry into the appraisal report.</p>

              <div className="bg-white rounded-xl shadow p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quality Rating</label>
                <select value={property.quality} onChange={e => setProperty(p => ({ ...p, quality: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3">
                  <option value="">Select quality rating...</option>
                  {['Q1 – Minimum quality', 'Q2 – Fair quality', 'Q3 – Average quality', 'Q4 – Good quality', 'Q5 – High quality', 'Q6 – Exceptional quality'].map(q => <option key={q}>{q}</option>)}
                </select>

                <label className="block text-sm font-semibold text-gray-700 mb-1">Condition Rating</label>
                <select value={property.condition} onChange={e => setProperty(p => ({ ...p, condition: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select condition rating...</option>
                  {['C1 – New', 'C2 – Nearly new', 'C3 – Well maintained', 'C4 – Adequately maintained', 'C5 – Poor condition', 'C6 – Severe deterioration'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Adverse Influences</label>
                <p className="text-xs text-gray-400 mb-2">Note any external factors that negatively affect value (e.g., power lines, traffic, industrial use nearby).</p>
                <textarea rows={3} value={property.adverse} onChange={e => setProperty(p => ({ ...p, adverse: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Describe any adverse influences observed..." />
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description of Improvements</label>
                <p className="text-xs text-gray-400 mb-2">Write a thorough narrative for the appraisal report — include style, construction, condition, room count, and notable features.</p>
                <textarea rows={7} value={improvements} onChange={e => setImprovements(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="The subject is a 1-story ranch-style home of average quality (Q3)..." />
              </div>

              <button className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
                Save Inspection Notes
              </button>
            </div>
          )}

          {/* SKETCH TOOL */}
          {tab === 'sketch' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">✏️ Floor Plan Sketch Tool</h2>
              <p className="text-gray-500 text-sm mb-4">Select a room type, then click and drag on the canvas to draw. Each grid square = 1 sq ft.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ROOMS.map(r => (
                  <button key={r} onClick={() => setSelectedRoom(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${selectedRoom === r ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="relative bg-white border-2 border-gray-300 rounded-xl overflow-hidden cursor-crosshair select-none"
                  style={{ width: 580, height: 400 }}
                  ref={canvasRef}
                  onMouseDown={e => { const p = getPos(e, canvasRef.current); setDrawing(true); setStartPt(p); setCurrentPt(p); }}
                  onMouseMove={e => { if (!drawing) return; setCurrentPt(getPos(e, canvasRef.current)); }}
                  onMouseUp={() => {
                    if (!drawing || !startPt || !currentPt) return;
                    setDrawing(false);
                    const x = Math.min(startPt.x, currentPt.x), y = Math.min(startPt.y, currentPt.y);
                    const w = Math.abs(currentPt.x - startPt.x), h = Math.abs(currentPt.y - startPt.y);
                    if (w > 20 && h > 20) setRooms(prev => [...prev, { id: Date.now(), type: selectedRoom, x, y, w, h, area: Math.round((w / 20) * (h / 20)) }]);
                    setStartPt(null); setCurrentPt(null);
                  }}
                  onMouseLeave={() => { setDrawing(false); setStartPt(null); setCurrentPt(null); }}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  {rooms.map(r => (
                    <div key={r.id} className="absolute border-2 border-blue-700 flex flex-col items-center justify-center text-center"
                      style={{ left: r.x, top: r.y, width: r.w, height: r.h, backgroundColor: COLORS[r.type] + 'cc' }}>
                      <span className="text-xs font-bold text-gray-800">{r.type}</span>
                      <span className="text-xs text-gray-600">{r.area} sq ft</span>
                      <button onMouseDown={e => { e.stopPropagation(); setRooms(prev => prev.filter(x => x.id !== r.id)); }}
                        className="absolute top-0.5 right-1 text-red-500 text-xs font-bold hover:text-red-700">×</button>
                    </div>
                  ))}
                  {drawing && startPt && currentPt && (
                    <div className="absolute border-2 border-dashed border-blue-500 opacity-60 pointer-events-none"
                      style={{ left: Math.min(startPt.x, currentPt.x), top: Math.min(startPt.y, currentPt.y), width: Math.abs(currentPt.x - startPt.x), height: Math.abs(currentPt.y - startPt.y), backgroundColor: COLORS[selectedRoom] + '66' }} />
                  )}
                </div>
                <div className="flex-1 min-w-40 bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Room List</h3>
                  {rooms.length === 0 && <p className="text-gray-400 text-xs">No rooms drawn yet.</p>}
                  <ul className="space-y-2">
                    {rooms.map(r => (
                      <li key={r.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[r.type] }} />
                          <span className="text-gray-700">{r.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{r.area} sf</span>
                          {GLA_EXCLUDED.includes(r.type) && <span className="text-red-400 italic">excl.</span>}
                          <button onClick={() => setRooms(prev => prev.filter(x => x.id !== r.id))} className="text-red-400 hover:text-red-600">×</button>
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
              <h2 className="text-xl font-bold text-gray-800 mb-1">📐 GLA Summary</h2>
              <p className="text-gray-500 text-sm mb-5">ANSI-compliant — Garage, Basement, and ADU are excluded from GLA.</p>
              <div className="bg-white rounded-xl shadow p-5 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Included in GLA</p>
                {rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).length === 0
                  ? <p className="text-gray-400 text-sm">No GLA rooms sketched yet.</p>
                  : rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).map(r => (
                    <div key={r.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                      <span className="text-gray-700">{r.type}</span>
                      <span className="font-medium text-gray-800">{r.area.toLocaleString()} sq ft</span>
                    </div>
                  ))}
                <div className="flex justify-between font-bold text-blue-800 text-base mt-3 pt-3 border-t-2">
                  <span>Total GLA</span><span>{gla.toLocaleString()} sq ft</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Excluded from GLA</p>
                {rooms.filter(r => GLA_EXCLUDED.includes(r.type)).length === 0
                  ? <p className="text-gray-400 text-sm">No excluded areas added.</p>
                  : rooms.filter(r => GLA_EXCLUDED.includes(r.type)).map(r => (
                    <div key={r.id} className="flex justify-between text-sm py-1.5 border-b last:border-0 text-gray-500">
                      <span>{r.type}</span><span>{r.area.toLocaleString()} sq ft</span>
                    </div>
                  ))}
                <div className="flex justify-between text-gray-500 text-sm mt-3 pt-3 border-t">
                  <span>Total Excluded</span><span>{excludedArea.toLocaleString()} sq ft</span>
                </div>
              </div>
              <div className="bg-blue-900 text-white rounded-xl p-5 flex justify-between items-center">
                <div>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Final GLA (ANSI-Compliant)</p>
                  <p className="text-3xl font-bold">{gla.toLocaleString()} sq ft</p>
                </div>
                <button className="bg-white text-blue-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                  Export Report
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
