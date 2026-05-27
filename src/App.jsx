import React, { useState, useEffect, useRef } from 'react';


const ROOMS = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Garage', 'Basement', 'ADU', 'Other'];
const GLA_EXCLUDED = ['Garage', 'Basement', 'ADU'];
const COLORS = {
  'Living Room': '#BFDBFE', Kitchen: '#BBF7D0', Bedroom: '#FDE68A',
  Bathroom: '#DDD6FE', Garage: '#E5E7EB', Basement: '#FECACA',
  ADU: '#FED7AA', Other: '#F9A8D4',
};

const ACTIVITIES = {
  1: {
    title: 'Types & Quality of Construction',
    body: () => {
      const [ans, setAns] = useState(null);
      const options = ['Q1 – Minimum quality', 'Q2 – Fair quality', 'Q3 – Average quality', 'Q4 – Good quality', 'Q5 – High quality', 'Q6 – Exceptional quality'];
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">A property has custom millwork, designer fixtures, and premium appliances throughout. Which quality rating applies?</p>
          {options.map((o, i) => (
            <button key={i} onClick={() => setAns(i)}
              className={`block w-full text-left px-4 py-2 rounded-lg mb-2 text-sm border transition ${ans === i ? (i === 4 ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-400 text-red-700') : 'bg-white border-gray-200 hover:border-blue-400'}`}>
              {o}
            </button>
          ))}
          {ans !== null && <p className="text-xs mt-2 font-semibold">{ans === 4 ? '✅ Correct! Q5 reflects high-quality construction.' : '❌ Not quite. Think premium custom finishes.'}</p>}
        </div>
      );
    }
  },
  2: {
    title: 'Floor Plan & Room Count',
    body: () => {
      const [val, setVal] = useState('');
      const correct = val === '3';
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">A 2-story home has: living room, dining room, kitchen, 3 bedrooms, 2 bathrooms, and a finished basement bedroom. How many <strong>above-grade</strong> bedrooms are counted?</p>
          <input type="number" min="0" max="10" value={val} onChange={e => setVal(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter #" />
          {val !== '' && <p className={`text-xs mt-2 font-semibold ${correct ? 'text-green-700' : 'text-red-600'}`}>{correct ? '✅ Correct! The basement bedroom is below-grade and excluded.' : '❌ Hint: Only count bedrooms above grade.'}</p>}
        </div>
      );
    }
  },
  3: {
    title: 'Observable Condition Factors',
    body: () => {
      const [ans, setAns] = useState(null);
      const options = ['C1 – New construction', 'C2 – Nearly new, no deferred maintenance', 'C3 – Well-maintained, minor wear', 'C4 – Adequately maintained, some deferred maintenance', 'C5 – Poor condition, significant deferred maintenance', 'C6 – Severe deterioration'];
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">During inspection you note: aging HVAC, worn carpet, peeling exterior paint, and a cracked driveway. What condition rating applies?</p>
          {options.map((o, i) => (
            <button key={i} onClick={() => setAns(i)}
              className={`block w-full text-left px-4 py-2 rounded-lg mb-2 text-sm border transition ${ans === i ? (i === 3 ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-400 text-red-700') : 'bg-white border-gray-200 hover:border-blue-400'}`}>
              {o}
            </button>
          ))}
          {ans !== null && <p className="text-xs mt-2 font-semibold">{ans === 3 ? '✅ Correct! C4 fits adequately maintained with some deferred maintenance.' : '❌ Review: multiple systems showing wear = C4.'}</p>}
        </div>
      );
    }
  },
  4: {
    title: 'Recognition of Adverse Influences',
    body: () => {
      const [selected, setSelected] = useState([]);
      const items = ['High-voltage power lines nearby', 'Mature landscaping', 'Active rail line 200 ft away', 'Proximity to industrial facility', 'Corner lot location', 'Adjacent to busy highway'];
      const correct = [0, 2, 3, 5];
      const toggle = (i) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      const checked = selected.length > 0;
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Select ALL items below that represent adverse influences on value:</p>
          {items.map((item, i) => (
            <label key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-sm border cursor-pointer transition ${selected.includes(i) ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
              <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="accent-blue-600" />
              {item}
            </label>
          ))}
          {checked && (
            <p className={`text-xs mt-2 font-semibold ${JSON.stringify(selected.sort()) === JSON.stringify(correct) ? 'text-green-700' : 'text-yellow-700'}`}>
              {JSON.stringify(selected.sort()) === JSON.stringify(correct) ? '✅ All correct! Power lines, rail, industrial, and highway are adverse.' : '⚠️ Review your selections — mature landscaping and corner lots are typically neutral or positive.'}
            </p>
          )}
        </div>
      );
    }
  },
  5: {
    title: 'Virtual Physical Inspection',
    body: () => {
      const steps = ['Reviewed MLS photos and listing remarks', 'Completed virtual walkthrough (video/photos)', 'Noted exterior features via street view', 'Confirmed room count and layout', 'Documented any items requiring follow-up'];
      const [checked, setChecked] = useState([]);
      const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Check off each step of the virtual inspection protocol:</p>
          {steps.map((s, i) => (
            <label key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-sm border cursor-pointer bg-white border-gray-200 hover:border-blue-300">
              <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} className="accent-blue-600" />
              {s}
            </label>
          ))}
          {checked.length === steps.length && <p className="text-green-700 text-xs font-semibold mt-2">✅ All steps complete — ready to proceed!</p>}
        </div>
      );
    }
  },
  6: {
    title: 'Thorough Description of Improvements',
    body: () => {
      const [val, setVal] = useState('');
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Write a brief description of the subject property improvements based on your virtual inspection. Include style, construction quality, condition, and notable features.</p>
          <textarea value={val} onChange={e => setVal(e.target.value)} rows={5}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="Example: The subject is a 1-story ranch-style home of average quality (Q3) and good condition (C3), featuring 3 bedrooms, 2 baths, updated kitchen with granite counters, and an attached 2-car garage..." />
          {val.length > 80 && <p className="text-green-700 text-xs mt-1 font-semibold">✅ Good detail level — make sure to mention quality, condition, and any upgrades.</p>}
        </div>
      );
    }
  },
  7: {
    title: 'Basements Measured',
    body: () => {
      const [l, setL] = useState('');
      const [w, setW] = useState('');
      const area = parseFloat(l) * parseFloat(w);
      const valid = l !== '' && w !== '' && !isNaN(area) && area > 0;
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Enter the basement dimensions below. The tool will calculate the area and confirm whether it is included in GLA.</p>
          <div className="flex gap-3 mb-3 items-end">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Length (ft)</label>
              <input type="number" value={l} onChange={e => setL(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <span className="text-gray-500 mb-2">×</span>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Width (ft)</label>
              <input type="number" value={w} onChange={e => setW(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          {valid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-700">Basement Area: {area.toLocaleString()} sq ft</p>
              <p className="text-xs text-red-600 mt-1">⚠️ Basements are <strong>excluded from GLA</strong> per ANSI standards, regardless of finish level.</p>
            </div>
          )}
        </div>
      );
    }
  },
  8: {
    title: 'Stairways & Vaulted Ceilings',
    body: () => {
      const scenarios = [
        { q: 'An open staircase connecting the main floor to the upper floor — is the stairwell area counted in GLA for both floors?', correct: 'No' },
        { q: 'A vaulted ceiling creates a 2-story open space in the living room. Is the "missing" upper floor area added to GLA?', correct: 'No' },
        { q: 'A split-level home has a 4-ft step-up to bedrooms — the bedrooms are fully above grade. Are they included in GLA?', correct: 'Yes' },
        { q: 'A stairway leads to a loft that is 8 ft × 10 ft above grade. Is the loft area included in GLA?', correct: 'Yes' },
      ];
      const [answers, setAnswers] = useState({});
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">For each scenario, select Yes or No:</p>
          {scenarios.map((s, i) => (
            <div key={i} className="mb-3 bg-gray-50 rounded-lg p-3 border">
              <p className="text-sm text-gray-700 mb-2">{s.q}</p>
              <div className="flex gap-2">
                {['Yes', 'No'].map(opt => (
                  <button key={opt} onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${answers[i] === opt ? (answers[i] === s.correct ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-400 text-red-700') : 'bg-white border-gray-300 hover:border-blue-400'}`}>
                    {opt}
                  </button>
                ))}
                {answers[i] && <span className="text-xs self-center font-semibold">{answers[i] === s.correct ? '✅' : '❌'}</span>}
              </div>
            </div>
          ))}
        </div>
      );
    }
  },
  9: {
    title: 'Below-Grade / Split-Level Living Area',
    body: () => {
      const [ans, setAns] = useState(null);
      const options = [
        'Include the full below-grade area in GLA',
        'Exclude all below-grade area from GLA',
        'Include only the above-grade portion based on exterior grade measurement',
        'Let the client decide what to include',
      ];
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">A split-level home has a lower level that is 40% below exterior grade. The lower level is finished and contains a family room and bathroom. What is the correct ANSI approach?</p>
          {options.map((o, i) => (
            <button key={i} onClick={() => setAns(i)}
              className={`block w-full text-left px-4 py-2 rounded-lg mb-2 text-sm border transition ${ans === i ? (i === 2 ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-400 text-red-700') : 'bg-white border-gray-200 hover:border-blue-400'}`}>
              {o}
            </button>
          ))}
          {ans !== null && <p className="text-xs mt-2 font-semibold">{ans === 2 ? '✅ Correct! Only the above-grade portion (60%) counts toward GLA.' : '❌ ANSI requires measuring only the above-grade portion using exterior grade.'}</p>}
        </div>
      );
    }
  },
  10: {
    title: 'ADUs & Outbuildings',
    body: () => {
      const items = ['Detached garage', 'Guest house with kitchen & bath (ADU)', 'Attached garage', 'Detached workshop/shed', 'Carport', 'Secondary dwelling unit above garage'];
      const correct = [1, 5];
      const [selected, setSelected] = useState([]);
      const toggle = (i) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Select which structures qualify as <strong>ADUs</strong> (Accessory Dwelling Units) that must be measured separately:</p>
          {items.map((item, i) => (
            <label key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-sm border cursor-pointer transition ${selected.includes(i) ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
              <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="accent-blue-600" />
              {item}
            </label>
          ))}
          {selected.length > 0 && (
            <p className={`text-xs mt-2 font-semibold ${JSON.stringify(selected.sort()) === JSON.stringify(correct) ? 'text-green-700' : 'text-yellow-700'}`}>
              {JSON.stringify(selected.sort()) === JSON.stringify(correct) ? '✅ Correct! ADUs are self-contained living units, not garages or sheds.' : '⚠️ ADUs must have living, sleeping, kitchen, and bath facilities — check your selections.'}
            </p>
          )}
        </div>
      );
    }
  },
  11: {
    title: 'Special Assignment Conditions',
    body: () => {
      const [ans, setAns] = useState(null);
      const options = ['Hypothetical Condition (HC)', 'Extraordinary Assumption (EA)', 'Limiting Condition', 'Scope of Work adjustment'];
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">You cannot visually confirm whether an addition was permitted. You proceed with the valuation assuming it was legally permitted. What type of special condition applies?</p>
          {options.map((o, i) => (
            <button key={i} onClick={() => setAns(i)}
              className={`block w-full text-left px-4 py-2 rounded-lg mb-2 text-sm border transition ${ans === i ? (i === 1 ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-400 text-red-700') : 'bg-white border-gray-200 hover:border-blue-400'}`}>
              {o}
            </button>
          ))}
          {ans !== null && <p className="text-xs mt-2 font-semibold">{ans === 1 ? '✅ Correct! An EA assumes something is true that cannot be confirmed — if false, it could change the value opinion.' : '❌ An HC would be used if the condition is known to be contrary to fact. Here you\'re assuming — that\'s an EA.'}</p>}
        </div>
      );
    }
  },
  12: {
    title: 'Common Rounding Practices',
    body: () => {
      const [ans, setAns] = useState('');
      const raw = 1423.67;
      const correct = '1424';
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2">You measure a home and the raw calculated area is <strong>{raw} sq ft</strong>.</p>
          <p className="text-sm text-gray-600 mb-3">Per ANSI rounding standards, what should the reported GLA be (rounded to the nearest square foot)?</p>
          <div className="flex items-center gap-3 mb-3">
            <input type="number" value={ans} onChange={e => setAns(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="sq ft" />
            <span className="text-sm text-gray-500">sq ft</span>
          </div>
          {ans !== '' && (
            <p className={`text-xs font-semibold ${ans === correct ? 'text-green-700' : 'text-red-600'}`}>
              {ans === correct ? '✅ Correct! 1,423.67 rounds up to 1,424 sq ft.' : `❌ Not quite. ANSI rounds to the nearest whole sq ft — try again.`}
            </p>
          )}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <strong>ANSI Rule:</strong> Round each linear dimension to the nearest foot before calculating area, OR round the final area to the nearest whole square foot. Never use half-feet in GLA reporting.
          </div>
        </div>
      );
    }
  },
  13: {
    title: 'Sketch Completed',
    body: (rooms) => {
      if (rooms.length === 0) {
        return (
          <div className="text-center py-4">
            <p className="text-yellow-700 font-semibold text-sm">⚠️ No rooms drawn yet.</p>
            <p className="text-gray-500 text-xs mt-1">Go to the Sketch Tool tab and draw at least one room before completing this step.</p>
          </div>
        );
      }
      return (
        <div>
          <p className="text-sm text-green-700 font-semibold mb-2">✅ You have {rooms.length} room(s) sketched.</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {rooms.map(r => <li key={r.id}>• {r.type} — {r.area} sq ft {GLA_EXCLUDED.includes(r.type) ? '(excluded)' : '(included)'}</li>)}
          </ul>
          <p className="text-xs text-gray-500 mt-3">Confirm all rooms are drawn and labeled correctly before marking complete.</p>
        </div>
      );
    }
  },
  14: {
    title: 'Final GLA Determined',
    body: (rooms) => {
      const included = rooms.filter(r => !GLA_EXCLUDED.includes(r.type));
      const excluded = rooms.filter(r => GLA_EXCLUDED.includes(r.type));
      const gla = included.reduce((s, r) => s + r.area, 0);
      return (
        <div>
          <p className="text-sm text-gray-600 mb-3">Review the GLA breakdown below. Confirm all exclusions are correct before finalizing.</p>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Included in GLA</p>
            {included.length === 0 ? <p className="text-gray-400 text-xs">None</p> : included.map(r => (
              <div key={r.id} className="flex justify-between text-sm py-1 border-b"><span>{r.type}</span><span className="font-medium">{r.area} sq ft</span></div>
            ))}
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Excluded from GLA</p>
            {excluded.length === 0 ? <p className="text-gray-400 text-xs">None</p> : excluded.map(r => (
              <div key={r.id} className="flex justify-between text-sm py-1 border-b text-gray-500"><span>{r.type}</span><span>{r.area} sq ft</span></div>
            ))}
          </div>
          <div className="bg-blue-900 text-white rounded-lg px-4 py-3 flex justify-between">
            <span className="font-semibold">Final GLA</span>
            <span className="font-bold">{gla.toLocaleString()} sq ft</span>
          </div>
        </div>
      );
    }
  },
};

const initialChecklist = [
  { id: 1, section: 'VII', label: 'Types/quality of construction' },
  { id: 2, section: 'VII', label: 'Floor plan issues & room count determination' },
  { id: 3, section: 'VII', label: 'Observable condition factors and upgrades' },
  { id: 4, section: 'VII', label: 'Recognition of adverse influences' },
  { id: 5, section: 'VII', label: 'Virtual physical inspection completed' },
  { id: 6, section: 'VII', label: 'Thorough description of improvements' },
  { id: 7, section: 'VIII', label: 'Basements measured' },
  { id: 8, section: 'VIII', label: 'Stairways & vaulted ceiling areas measured' },
  { id: 9, section: 'VIII', label: 'Below-grade living area (split level) measured' },
  { id: 10, section: 'VIII', label: 'ADUs and outbuildings measured' },
  { id: 11, section: 'VIII', label: 'Special assignment conditions noted' },
  { id: 12, section: 'VIII', label: 'Common rounding practices applied' },
  { id: 13, section: 'IX', label: 'Sketch completed' },
  { id: 14, section: 'IX', label: 'Final GLA determined (exclusions noted)' },
];

function App() {
  const [tab, setTab] = useState('dashboard');
  const [checklist, setChecklist] = useState(initialChecklist.map(c => ({ ...c, checked: false })));
  const [activeActivity, setActiveActivity] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt] = useState(null);
  const [currentPt, setCurrentPt] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [notes, setNotes] = useState('');
  const [property, setProperty] = useState({ address: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', zip: '62701', type: 'Single Family', year: '1998', style: 'Ranch', beds: '3', baths: '2' });
  const canvasRef = useRef(null);

  const gla = rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).reduce((s, r) => s + r.area, 0);
  const excludedArea = rooms.filter(r => GLA_EXCLUDED.includes(r.type)).reduce((s, r) => s + r.area, 0);
  const completedCount = checklist.filter(c => c.checked).length;
  const progress = Math.round((completedCount / checklist.length) * 100);
  const sections = ['VII', 'VIII', 'IX'];
  const sectionLabel = s => ({ VII: 'Section VII – Improvements Inspection', VIII: 'Section VIII – Measuring', IX: 'Section IX – Sketch Completion' }[s]);

  const getPos = (e, el) => {
    const rect = el.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.round((cx - rect.left) / 20) * 20, y: Math.round((cy - rect.top) / 20) * 20 };
  };

  const markComplete = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: true } : c));
    setActiveActivity(null);
  };

  const ActivityModal = () => {
    if (!activeActivity) return null;
    const act = ACTIVITIES[activeActivity];
    const item = checklist.find(c => c.id === activeActivity);
    const BodyComp = act.body;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
          <div className="bg-blue-900 text-white px-6 py-4 rounded-t-2xl flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-300 uppercase tracking-wide">Section {item.section} Activity</p>
              <h3 className="font-bold text-lg">{act.title}</h3>
            </div>
            <button onClick={() => setActiveActivity(null)} className="text-blue-300 hover:text-white text-2xl leading-none ml-4">×</button>
          </div>
          <div className="p-6">
            {typeof BodyComp === 'function' ? <BodyComp rooms={rooms} /> : null}
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => markComplete(activeActivity)}
              className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition">
              Mark Complete ✓
            </button>
            <button onClick={() => setActiveActivity(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
          { key: 'dashboard', label: '🏠 Dashboard' },
          { key: 'property', label: '📋 Property Info' },
          { key: 'sketch', label: '✏️ Sketch Tool' },
          { key: 'gla', label: '📐 GLA Summary' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Checklist */}
        <aside className="w-72 bg-white border-r shadow-inner overflow-y-auto flex-shrink-0 hidden md:block">
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">PAREA Checklist</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{completedCount}/{checklist.length} complete</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          {sections.map(s => (
            <div key={s} className="border-b">
              <p className="px-4 pt-3 pb-1 text-xs font-bold text-blue-800 uppercase tracking-wide">{sectionLabel(s)}</p>
              {checklist.filter(c => c.section === s).map(item => (
                <button key={item.id} onClick={() => setActiveActivity(item.id)}
                  className={`w-full flex items-start gap-2 px-4 py-2 text-left hover:bg-blue-50 transition ${item.checked ? 'opacity-60' : ''}`}>
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {item.checked ? '✓' : ''}
                  </span>
                  <span className={`text-xs leading-snug ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
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

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Assignment Overview</h2>
              <p className="text-gray-500 mb-4 text-sm">Licensed Residential — PAREA Training Module</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-600">
                  <p className="text-xs text-gray-500 uppercase mb-1">Subject Property</p>
                  <p className="font-bold text-gray-800">{property.address}</p>
                  <p className="text-gray-500 text-sm">{property.city}, {property.state}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                  <p className="text-xs text-gray-500 uppercase mb-1">Inspection Progress</p>
                  <p className="text-2xl font-bold text-gray-800">{progress}%</p>
                  <p className="text-xs text-gray-500">{completedCount}/{checklist.length} items</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 uppercase mb-1">Current GLA</p>
                  <p className="text-2xl font-bold text-gray-800">{gla.toLocaleString()} <span className="text-sm font-normal text-gray-500">sq ft</span></p>
                  <p className="text-xs text-gray-500">{rooms.length} room(s) sketched</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">📌 PAREA Sections</h3>
                  {sections.map(s => {
                    const items = checklist.filter(c => c.section === s);
                    const done = items.filter(c => c.checked).length;
                    return (
                      <div key={s} className="flex justify-between items-center py-1.5 border-b last:border-0">
                        <span className="text-sm text-gray-600">{sectionLabel(s)}</span>
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
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm font-semibold mb-1">💡 How to use the checklist</p>
                <p className="text-blue-700 text-xs">Click any item in the left sidebar to open its interactive activity. Complete the activity and click "Mark Complete" to check it off.</p>
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
                  { label: 'Style', key: 'style' }, { label: 'Bedrooms', key: 'beds' }, { label: 'Bathrooms', key: 'baths' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}</label>
                    <input type="text" value={property[f.key]}
                      onChange={e => setProperty(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ))}
              </div>
              <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">Save Property Info</button>
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
                  onMouseDown={e => { const p = getPos(e, canvasRef.current); setDrawing(true); setStartPt(p); setCurrentPt(p); }}
                  onMouseMove={e => { if (!drawing) return; setCurrentPt(getPos(e, canvasRef.current)); }}
                  onMouseUp={e => {
                    if (!drawing || !startPt || !currentPt) return;
                    setDrawing(false);
                    const x = Math.min(startPt.x, currentPt.x), y = Math.min(startPt.y, currentPt.y);
                    const w = Math.abs(currentPt.x - startPt.x), h = Math.abs(currentPt.y - startPt.y);
                    if (w > 20 && h > 20) setRooms(prev => [...prev, { id: Date.now(), type: selectedRoom, x, y, w, h, area: Math.round((w / 20) * (h / 20)) }]);
                    setStartPt(null); setCurrentPt(null);
                  }}
                  onMouseLeave={() => { setDrawing(false); setStartPt(null); setCurrentPt(null); }}
                  ref={canvasRef}>
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
              <p className="text-gray-500 text-sm mb-5">ANSI-compliant — Garage, Basement, and ADU are excluded.</p>
              <div className="bg-white rounded-xl shadow p-5 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Included in GLA</p>
                {rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).length === 0
                  ? <p className="text-gray-400 text-sm">No GLA rooms yet.</p>
                  : rooms.filter(r => !GLA_EXCLUDED.includes(r.type)).map(r => (
                    <div key={r.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                      <span>{r.type}</span><span className="font-medium">{r.area.toLocaleString()} sq ft</span>
                    </div>
                  ))}
                <div className="flex justify-between font-bold text-blue-800 text-base mt-3 pt-3 border-t-2">
                  <span>Total GLA</span><span>{gla.toLocaleString()} sq ft</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Excluded from GLA</p>
                {rooms.filter(r => GLA_EXCLUDED.includes(r.type)).length === 0
                  ? <p className="text-gray-400 text-sm">No excluded areas.</p>
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
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Final GLA (ANSI)</p>
                  <p className="text-3xl font-bold">{gla.toLocaleString()} sq ft</p>
                </div>
                <button className="bg-white text-blue-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition">Export Report</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <ActivityModal />
    </div>
  );
}
export default App;
