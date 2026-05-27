const { useState, useRef } = React;

const SCALE_FT = 0.05;

const PROPERTY = {
  address: '2847 Maple Ridge Drive',
  city: 'Raleigh, NC 27609',
  type: 'Single Family | 2-Story | Built 1998',
  sqft: '1,950 sq ft',
  brief: 'Navigate each room, switch to Observe mode and click the highlighted hotspots to log your findings. Then complete the inspection forms using your observations.'
};

const ROOMS = ['exterior','living','kitchen','bedroom','bathroom'];
const ROOM_META = {
  exterior: { label:'Exterior / Front',  color:'#4a90d9', prev:null,       next:'living'   },
  living:   { label:'Living Room',       color:'#5ba85a', prev:'exterior',  next:'kitchen'  },
  kitchen:  { label:'Kitchen',           color:'#e8a020', prev:'living',    next:'bedroom'  },
  bedroom:  { label:'Master Bedroom',    color:'#9b59b6', prev:'kitchen',   next:'bathroom' },
  bathroom: { label:'Bathroom',          color:'#e74c3c', prev:'bedroom',   next:null       },
};

const ROOM_HOTSPOTS = {
  exterior:[
    {id:'e1',x:190,y:155,label:'Brick Exterior Walls',                  tag:'improvement'},
    {id:'e2',x:215,y:58, label:'Asphalt Shingle Roof — Good Condition', tag:'improvement'},
    {id:'e3',x:370,y:240,label:'Concrete Driveway & 2-Car Garage',       tag:'site'       },
    {id:'e4',x:80, y:220,label:'Level Lot / Adequate Drainage',          tag:'site'       },
    {id:'e5',x:80, y:250,label:'Mature Landscaping & Shrubs',            tag:'site'       },
  ],
  living:[
    {id:'l1',x:300,y:280,label:'Hardwood Floors — Good Condition',      tag:'improvement'},
    {id:'l2',x:80, y:185,label:'Painted Drywall — No Defects',          tag:'improvement'},
    {id:'l3',x:460,y:155,label:'Stone Fireplace — Functional',          tag:'improvement'},
    {id:'l4',x:190,y:14, label:'Recessed Lighting — Updated',           tag:'improvement'},
  ],
  kitchen:[
    {id:'k1',x:98, y:65, label:'Cherry Wood Cabinetry — Updated',       tag:'improvement'},
    {id:'k2',x:98, y:178,label:'Granite Countertops',                   tag:'improvement'},
    {id:'k3',x:420,y:148,label:'SS Appliances — Good Condition',        tag:'improvement'},
    {id:'k4',x:280,y:285,label:'Porcelain Tile Floor',                  tag:'improvement'},
    {id:'k5',x:98, y:210,label:'⚠ Grout Discoloration at Sink Base',   tag:'adverse'    },
  ],
  bedroom:[
    {id:'b1',x:300,y:285,label:'Carpet — Average / Worn Condition',     tag:'improvement'},
    {id:'b2',x:505,y:142,label:'Walk-In Closet',                        tag:'improvement'},
    {id:'b3',x:280,y:90, label:'Double-Pane Windows — Good Condition',  tag:'improvement'},
    {id:'b4',x:60, y:185,label:'Drywall Walls — Good Condition',        tag:'improvement'},
  ],
  bathroom:[
    {id:'ba1',x:280,y:28, label:'⚠ Water Stain on Ceiling — Investigate',tag:'adverse'    },
    {id:'ba2',x:90, y:138,label:'Tile Surround — Good Condition',         tag:'improvement'},
    {id:'ba3',x:285,y:168,label:'Vanity Updated ~5 Years Ago',            tag:'improvement'},
    {id:'ba4',x:285,y:290,label:'Tile Floor — Good Condition',            tag:'improvement'},
  ],
};

// ─── SVG Room Scenes ───────────────────────────────────────────
function ExteriorScene() {
  return (
    <g>
      <defs>
        <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#87CEEB"/><stop offset="100%" stopColor="#d0e8f8"/></linearGradient>
      </defs>
      <rect width="560" height="320" fill="url(#sk)"/>
      <rect y="210" width="560" height="110" fill="#5a8f3c"/>
      {/* Driveway */}
      <polygon points="330,320 420,320 400,210 352,210" fill="#999"/>
      <line x1="376" y1="210" x2="385" y2="320" stroke="#888" strokeWidth="1" strokeDasharray="8,6"/>
      {/* House body brick */}
      <rect x="80" y="100" width="260" height="140" fill="#c8917a"/>
      {[0,1,2,3,4,5,6,7,8,9].map(i=>(
        <g key={i}>
          <line x1="80" y1={100+i*14} x2="340" y2={100+i*14} stroke="#b07060" strokeWidth="0.7"/>
          {[0,1,2,3,4,5].map(j=><line key={j} x1={80+(i%2===0?0:22)+j*44} y1={100+i*14} x2={80+(i%2===0?0:22)+j*44} y2={100+(i+1)*14} stroke="#b07060" strokeWidth="0.7"/>)}
        </g>
      ))}
      {/* Roof */}
      <polygon points="58,100 210,33 362,100" fill="#7a4a2a"/>
      {/* Chimney */}
      <rect x="278" y="44" width="28" height="56" fill="#a07060"/>
      {/* Win L */}
      <rect x="100" y="124" width="56" height="50" fill="#a8d8f0"/>
      <rect x="100" y="124" width="56" height="50" fill="none" stroke="#666" strokeWidth="2"/>
      <line x1="128" y1="124" x2="128" y2="174" stroke="#666" strokeWidth="1.5"/>
      <line x1="100" y1="149" x2="156" y2="149" stroke="#666" strokeWidth="1.5"/>
      {/* Win R */}
      <rect x="261" y="124" width="56" height="50" fill="#a8d8f0"/>
      <rect x="261" y="124" width="56" height="50" fill="none" stroke="#666" strokeWidth="2"/>
      <line x1="289" y1="124" x2="289" y2="174" stroke="#666" strokeWidth="1.5"/>
      <line x1="261" y1="149" x2="317" y2="149" stroke="#666" strokeWidth="1.5"/>
      {/* Door */}
      <rect x="183" y="164" width="54" height="76" fill="#6B4C1E" rx="2"/>
      <rect x="193" y="174" width="15" height="23" fill="#5a4010" rx="1"/>
      <rect x="215" y="174" width="15" height="23" fill="#5a4010" rx="1"/>
      <circle cx="234" cy="204" r="4" fill="#FFD700"/>
      {/* Garage */}
      <rect x="350" y="174" width="88" height="66" fill="#ddd" stroke="#aaa" strokeWidth="2"/>
      {[184,196,208,220,232].map(y=><line key={y} x1="350" y1={y} x2="438" y2={y} stroke="#ccc" strokeWidth="1"/>)}
      {[350,368,387,406,420,438].map(x=><line key={x} x1={x} y1="174" x2={x} y2="240" stroke="#ccc" strokeWidth="0.8"/>)}
      {/* Shrubs */}
      <ellipse cx="78" cy="248" rx="36" ry="23" fill="#3a7a25"/>
      <ellipse cx="338" cy="248" rx="36" ry="23" fill="#3a7a25"/>
      <ellipse cx="56" cy="254" rx="22" ry="15" fill="#4a8a30"/>
      {/* Sidewalk */}
      <rect x="207" y="240" width="22" height="80" fill="#ccc"/>
    </g>
  );
}

function LivingRoomScene() {
  return (
    <g>
      <defs>
        <linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8e0d0"/><stop offset="100%" stopColor="#d5cdc0"/></linearGradient>
        <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8a870"/><stop offset="100%" stopColor="#b89060"/></linearGradient>
      </defs>
      <rect width="560" height="232" fill="url(#lw)"/>
      <rect y="0" width="560" height="8" fill="#f0ebe0"/>
      <rect y="224" width="560" height="8" fill="#f0ebe0"/>
      <polygon points="0,232 560,232 560,320 0,320" fill="url(#lf)"/>
      {[237,252,267,282,297,312].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#a88050" strokeWidth="0.8"/>)}
      {[80,160,240,320,400,480].map(x=><line key={x} x1={x} y1="232" x2={x+(x-280)*0.2} y2="320" stroke="#a88050" strokeWidth="0.5"/>)}
      {/* Window */}
      <rect x="215" y="40" width="130" height="115" fill="#c0e0f0"/>
      <rect x="215" y="40" width="130" height="115" fill="none" stroke="#888" strokeWidth="3"/>
      <line x1="280" y1="40" x2="280" y2="155" stroke="#888" strokeWidth="2"/>
      <line x1="215" y1="97" x2="345" y2="97" stroke="#888" strokeWidth="2"/>
      <rect x="200" y="35" width="20" height="125" fill="#8090a0" opacity="0.65"/>
      <rect x="340" y="35" width="20" height="125" fill="#8090a0" opacity="0.65"/>
      {/* TV */}
      <rect x="30" y="54" width="122" height="76" fill="#111" rx="3"/>
      <rect x="35" y="59" width="112" height="66" fill="#1a2a3a"/>
      <rect x="70" y="130" width="52" height="6" fill="#8B6914"/>
      {/* Fireplace */}
      <rect x="390" y="68" width="142" height="164" fill="#c0c0c0"/>
      {[68,86,104,122,140,158,176,194,210,226].map(y=>y<=232&&<line key={y} x1="390" y1={y} x2="532" y2={y} stroke="#aaa" strokeWidth="0.8"/>)}
      <rect x="402" y="78" width="118" height="98" fill="#333"/>
      <rect x="386" y="174" width="148" height="12" fill="#8B6914"/>
      {/* Sofa */}
      <rect x="90" y="250" width="292" height="56" fill="#5a6f90" rx="3"/>
      <rect x="90" y="240" width="292" height="16" fill="#6a7fa0" rx="2"/>
      <rect x="90" y="250" width="24" height="56" fill="#6a7fa0" rx="2"/>
      <rect x="358" y="250" width="24" height="56" fill="#6a7fa0" rx="2"/>
      {[104,192,272].map(x=><rect key={x} x={x} y="253" width="80" height="37" fill="#7a8fb0" rx="2"/>)}
      <rect x="172" y="310" width="178" height="10" fill="#8B6914" rx="2"/>
      {/* Lights */}
      {[90,190,280,370,470].map(x=>(
        <g key={x}>
          <circle cx={x} cy="14" r="7" fill="#ffe" stroke="#ddd" strokeWidth="1"/>
          <line x1={x} y1="21" x2={x} y2="232" stroke="#fffacc" strokeWidth="1" opacity="0.12"/>
        </g>
      ))}
    </g>
  );
}

function KitchenScene() {
  return (
    <g>
      <defs>
        <linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5f0e8"/><stop offset="100%" stopColor="#e8e2d8"/></linearGradient>
      </defs>
      <rect width="560" height="320" fill="url(#kw)"/>
      <rect y="220" width="560" height="100" fill="#e8e4da"/>
      {[220,258,296].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#ccc" strokeWidth="1"/>)}
      {[0,56,112,168,224,280,336,392,448,504,560].map(x=><line key={x} x1={x} y1="220" x2={x} y2="320" stroke="#ccc" strokeWidth="1"/>)}
      {/* Upper cab L */}
      <rect x="0" y="20" width="195" height="108" fill="#c8956a" stroke="#b07050" strokeWidth="1"/>
      <rect x="5" y="25" width="88" height="98" fill="#d4a878"/>
      <rect x="100" y="25" width="90" height="98" fill="#d4a878"/>
      <circle cx="49" cy="74" r="4" fill="#888"/>
      <circle cx="145" cy="74" r="4" fill="#888"/>
      {/* Upper cab R */}
      <rect x="365" y="20" width="195" height="108" fill="#c8956a" stroke="#b07050" strokeWidth="1"/>
      <rect x="370" y="25" width="88" height="98" fill="#d4a878"/>
      <rect x="465" y="25" width="90" height="98" fill="#d4a878"/>
      <circle cx="414" cy="74" r="4" fill="#888"/>
      <circle cx="510" cy="74" r="4" fill="#888"/>
      {/* Hood */}
      <polygon points="215,20 345,20 325,138 235,138" fill="#b0b0b0"/>
      <rect x="237" y="128" width="86" height="12" fill="#999"/>
      {/* Stove */}
      <rect x="222" y="148" width="118" height="78" fill="#e0e0e0" stroke="#ccc" strokeWidth="1"/>
      {[242,277,307,342].map(x=><circle key={x} cx={x} cy="168" r="13" fill="#ccc" stroke="#aaa" strokeWidth="1"/>)}
      <rect x="228" y="198" width="106" height="24" fill="#d5d5d5"/>
      {/* Countertop */}
      <rect x="0" y="177" width="195" height="12" fill="#b0b0b0"/>
      <rect x="365" y="177" width="195" height="12" fill="#b0b0b0"/>
      {/* Lower cab L */}
      <rect x="0" y="189" width="195" height="78" fill="#c8956a" stroke="#b07050" strokeWidth="1"/>
      <rect x="5" y="194" width="88" height="68" fill="#d4a878"/>
      <rect x="100" y="194" width="90" height="68" fill="#d4a878"/>
      <circle cx="49" cy="228" r="4" fill="#888"/>
      <circle cx="145" cy="228" r="4" fill="#888"/>
      {/* Lower cab R */}
      <rect x="365" y="189" width="195" height="78" fill="#c8956a" stroke="#b07050" strokeWidth="1"/>
      <rect x="370" y="194" width="88" height="68" fill="#d4a878"/>
      <rect x="465" y="194" width="90" height="68" fill="#d4a878"/>
      <circle cx="414" cy="228" r="4" fill="#888"/>
      <circle cx="510" cy="228" r="4" fill="#888"/>
      {/* Sink */}
      <rect x="195" y="177" width="170" height="12" fill="#c0c0c0"/>
      <rect x="207" y="189" width="146" height="62" fill="#ccc"/>
      <circle cx="280" cy="174" r="10" fill="#aaa"/>
      <rect x="276" y="157" width="8" height="18" fill="#999"/>
      {/* Grout issue */}
      <ellipse cx="100" cy="216" rx="28" ry="18" fill="#c0a040" opacity="0.22"/>
      {/* Fridge */}
      <rect x="476" y="136" width="84" height="148" fill="#e8e8e8" stroke="#ccc" strokeWidth="1"/>
      <line x1="518" y1="136" x2="518" y2="284" stroke="#d0d0d0" strokeWidth="2"/>
      <rect x="508" y="206" width="3" height="18" fill="#aaa"/>
      <rect x="531" y="206" width="3" height="18" fill="#aaa"/>
    </g>
  );
}

function BedroomScene() {
  return (
    <g>
      <defs>
        <linearGradient id="bew" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ece8de"/><stop offset="100%" stopColor="#dcd8ce"/></linearGradient>
        <linearGradient id="bef" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c4b898"/><stop offset="100%" stopColor="#b4a888"/></linearGradient>
      </defs>
      <rect width="560" height="232" fill="url(#bew)"/>
      <rect y="0" width="560" height="8" fill="#f0ebe0"/>
      <rect y="224" width="560" height="8" fill="#f0ebe0"/>
      <polygon points="0,232 560,232 560,320 0,320" fill="url(#bef)"/>
      {[237,250,263,276,289,302,315].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#a89878" strokeWidth="0.5" opacity="0.6"/>)}
      {/* Window */}
      <rect x="205" y="30" width="150" height="122" fill="#b8e0f0"/>
      <rect x="205" y="30" width="150" height="122" fill="none" stroke="#888" strokeWidth="3"/>
      <line x1="280" y1="30" x2="280" y2="152" stroke="#888" strokeWidth="2"/>
      <line x1="205" y1="91" x2="355" y2="91" stroke="#888" strokeWidth="2"/>
      <rect x="188" y="22" width="180" height="5" fill="#888"/>
      <rect x="188" y="22" width="20" height="132" fill="#8090a0" opacity="0.65"/>
      <rect x="352" y="22" width="20" height="132" fill="#8090a0" opacity="0.65"/>
      {/* Headboard */}
      <rect x="120" y="158" width="242" height="28" fill="#7a5a3a" rx="4"/>
      {/* Bed */}
      <rect x="115" y="184" width="252" height="118" fill="#f0ece0"/>
      <rect x="115" y="184" width="252" height="78" fill="#7a8fa0"/>
      <rect x="128" y="188" width="90" height="34" fill="#f0f0ff" rx="4"/>
      <rect x="238" y="188" width="90" height="34" fill="#f0f0ff" rx="4"/>
      {/* Nightstand */}
      <rect x="28" y="200" width="72" height="66" fill="#8B6914"/>
      <rect x="33" y="216" width="62" height="22" fill="#7a5a10"/>
      <circle cx="64" cy="227" r="4" fill="#aaa"/>
      <rect x="59" y="184" width="5" height="18" fill="#888"/>
      <polygon points="43,184 87,184 80,174 50,174" fill="#ffe8b0"/>
      {/* Closet */}
      <rect x="470" y="55" width="90" height="177" fill="#d8d0c8" stroke="#bbb" strokeWidth="2"/>
      <line x1="515" y1="55" x2="515" y2="232" stroke="#bbb" strokeWidth="1.5"/>
      <circle cx="503" cy="142" r="4" fill="#999"/>
      <circle cx="527" cy="142" r="4" fill="#999"/>
      <text x="515" y="44" fontSize="11" fill="#999" textAnchor="middle">Walk-In Closet</text>
    </g>
  );
}

function BathroomScene() {
  return (
    <g>
      <defs>
        <linearGradient id="baw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2f2f2"/><stop offset="100%" stopColor="#e2e2e2"/></linearGradient>
      </defs>
      <rect width="560" height="320" fill="url(#baw)"/>
      {[0,40,80,120,160,200].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#d0d0d0" strokeWidth="1"/>)}
      {[0,56,112,168,224,280,336,392,448,504,560].map(x=><line key={x} x1={x} y1="0" x2={x} y2="220" stroke="#d0d0d0" strokeWidth="1"/>)}
      <rect y="220" width="560" height="100" fill="#e8e8e0"/>
      {[220,258,296].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#c8c8c0" strokeWidth="1"/>)}
      {[0,80,160,240,320,400,480,560].map(x=><line key={x} x1={x} y1="220" x2={x} y2="320" stroke="#c8c8c0" strokeWidth="1"/>)}
      {/* Stain */}
      <ellipse cx="280" cy="18" rx="68" ry="14" fill="#c8b07a" opacity="0.45"/>
      <ellipse cx="265" cy="22" rx="32" ry="8" fill="#c0a060" opacity="0.38"/>
      {/* Shower */}
      <rect x="0" y="55" width="192" height="165" fill="#e0eef8" stroke="#bbb" strokeWidth="2"/>
      {[55,75,95,115,135,155,175,195,215].map(y=>y<=220&&<line key={y} x1="0" y1={y} x2="192" y2={y} stroke="#c0d8e8" strokeWidth="1"/>)}
      {[0,38,76,114,152,192].map(x=><line key={x} x1={x} y1="55" x2={x} y2="220" stroke="#c0d8e8" strokeWidth="1"/>)}
      <rect x="157" y="55" width="35" height="165" fill="#e0f2f8" opacity="0.55" stroke="#aaa" strokeWidth="1.5"/>
      <rect x="126" y="70" width="6" height="22" fill="#aaa"/>
      <ellipse cx="129" cy="92" rx="14" ry="9" fill="#bbb"/>
      {/* Toilet */}
      <rect x="400" y="148" width="85" height="52" fill="#eee" rx="4" stroke="#d0d0d0" strokeWidth="1"/>
      <ellipse cx="442" cy="204" rx="52" ry="32" fill="#e8e8e8" stroke="#ccc" strokeWidth="1"/>
      <ellipse cx="442" cy="204" rx="42" ry="24" fill="#ddd"/>
      {/* Vanity */}
      <rect x="205" y="174" width="175" height="58" fill="#c8a878" stroke="#b09060" strokeWidth="1"/>
      <rect x="210" y="179" width="82" height="48" fill="#d4b888"/>
      <rect x="296" y="179" width="79" height="48" fill="#d4b888"/>
      <rect x="200" y="163" width="185" height="14" fill="#c8c8c8"/>
      <ellipse cx="285" cy="170" rx="42" ry="22" fill="#e8e8e8" stroke="#c8c8c8" strokeWidth="2"/>
      <rect x="282" y="153" width="6" height="14" fill="#aaa"/>
      <rect x="272" y="151" width="26" height="6" fill="#bbb" rx="2"/>
      {/* Mirror */}
      <rect x="205" y="44" width="175" height="112" fill="#c0e4f4" stroke="#aaa" strokeWidth="2"/>
      {/* Light bar */}
      <rect x="205" y="34" width="175" height="12" fill="#eee" stroke="#ccc" strokeWidth="1"/>
      {[225,255,285,315,345,370].map(x=>x<=380&&<circle key={x} cx={x} cy="40" r="6" fill="#ffe" stroke="#ddd" strokeWidth="1"/>)}
      <rect x="390" y="118" width="80" height="4" fill="#aaa" rx="2"/>
      <rect x="388" y="113" width="6" height="14" fill="#999" rx="1"/>
      <rect x="462" y="113" width="6" height="14" fill="#999" rx="1"/>
    </g>
  );
}

const ROOM_SCENES = { exterior:ExteriorScene, living:LivingRoomScene, kitchen:KitchenScene, bedroom:BedroomScene, bathroom:BathroomScene };

// ─── Shared Observations Context Panel ────────────────────────
function ObsPanel({ observations, filterTags, emptyMsg }) {
  const filtered = observations.filter(o => filterTags.includes(o.tag));
  return (
    <div style={{background:'#0f172a',borderRadius:8,padding:10,overflowY:'auto',maxHeight:360}}>
      <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:6}}>📋 FROM YOUR TOUR ({filtered.length})</div>
      {filtered.length===0
        ? <div style={{fontSize:11,color:'#475569',lineHeight:1.5}}>{emptyMsg}</div>
        : filtered.map(o=>(
          <div key={o.id} style={{background:'#1e293b',borderRadius:6,padding:'5px 8px',marginBottom:5,borderLeft:`3px solid ${o.tag==='adverse'?'#ef4444':o.tag==='site'?'#3b82f6':'#10b981'}`}}>
            <div style={{fontSize:9,color:'#64748b'}}>{o.room}</div>
            <div style={{fontSize:11,color:'#e2e8f0',lineHeight:1.4}}>{o.label}</div>
          </div>
        ))
      }
    </div>
  );
}

// ─── Tour Tab ─────────────────────────────────────────────────
function TourTab({ observations, setObservations }) {
  const [roomIdx, setRoomIdx] = useState(0);
  const [mode, setMode] = useState('observe');
  const [measurePts, setMeasurePts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [pending, setPending] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [visited, setVisited] = useState(new Set([ROOMS[0]]));
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const roomId = ROOMS[roomIdx];
  const meta = ROOM_META[roomId];
  const hotspots = ROOM_HOTSPOTS[roomId] || [];
  const SceneComp = ROOM_SCENES[roomId];

  const goTo = (id) => {
    const idx = ROOMS.indexOf(id);
    if (idx<0) return;
    setRoomIdx(idx);
    setVisited(v=>new Set([...v,id]));
    setMeasurePts([]);
    setPending(null);
    setTooltip(null);
  };

  const logObs = (h) => {
    if (observations.find(o=>o.id===h.id)) return;
    setObservations(prev=>[...prev,{...h,room:meta.label}]);
  };

  const getSVGPt = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(560/r.width), y:(e.clientY-r.top)*(320/r.height) };
  };

  const handleSVGClick = (e) => {
    if (e.target.dataset.hotspot) return;
    const {x,y} = getSVGPt(e);
    if (mode==='measure') {
      if (measurePts.length===0) { setMeasurePts([{x,y}]); }
      else {
        const p1=measurePts[0];
        const dist=Math.sqrt(Math.pow((x-p1.x)*SCALE_FT,2)+Math.pow((y-p1.y)*SCALE_FT,2)).toFixed(1);
        setMeasurements(m=>[...m,{id:Date.now(),room:meta.label,p1,p2:{x,y},dist}]);
        setMeasurePts([]);
      }
    } else if (mode==='annotate') {
      setPending({x,y}); setNoteText('');
    }
  };

  const saveNote = () => {
    if (!noteText.trim()) return;
    setAnnotations(a=>[...a,{id:Date.now(),room:meta.label,x:pending.x,y:pending.y,text:noteText}]);
    setPending(null); setNoteText('');
  };

  const roomAnns = annotations.filter(a=>a.room===meta.label);
  const roomMeas = measurements.filter(m=>m.room===meta.label);
  const obsLogged = observations.find;

  return (
    <div style={{display:'flex',gap:12,height:'100%',minHeight:420}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
        {/* Toolbar */}
        <div style={{display:'flex',gap:6,background:'#1e293b',padding:'8px 12px',borderRadius:8,alignItems:'center',flexWrap:'wrap'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#64748b'}}>MODE:</span>
          {[['observe','🔍 Observe'],['measure','📏 Measure'],['annotate','📝 Note']].map(([m,lbl])=>(
            <button key={m} onClick={()=>setMode(m)} style={{padding:'4px 12px',borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:mode===m?'#3b82f6':'#334155',color:mode===m?'#fff':'#94a3b8'}}>{lbl}</button>
          ))}
          <div style={{marginLeft:'auto',fontSize:10,color:'#64748b',maxWidth:220}}>
            {mode==='observe'&&'Click the glowing markers to log observations'}
            {mode==='measure'&&'Click 2 points on the scene to measure distance'}
            {mode==='annotate'&&'Click anywhere on the scene to add a field note'}
          </div>
        </div>

        {/* SVG Scene */}
        <div style={{position:'relative',flex:1,minHeight:260,background:'#111',borderRadius:10,overflow:'hidden',border:`2px solid ${meta.color}`}}>
          <svg ref={svgRef} viewBox="0 0 560 320" style={{width:'100%',height:'100%',display:'block',cursor:mode==='observe'?'default':'crosshair'}} onClick={handleSVGClick}>
            <SceneComp/>

            {/* Hotspots */}
            {mode==='observe' && hotspots.map(h=>{
              const logged=!!observations.find(o=>o.id===h.id);
              const isAdv=h.tag==='adverse';
              const fill=logged?'#22c55e':isAdv?'#ef4444':'#3b82f6';
              return (
                <g key={h.id} data-hotspot="1"
                  style={{cursor:'pointer'}}
                  onClick={e=>{e.stopPropagation();logObs(h);}}
                  onMouseEnter={()=>setTooltip(h)}
                  onMouseLeave={()=>setTooltip(null)}>
                  {!logged&&<circle cx={h.x} cy={h.y} r="18" fill={fill} opacity="0.2"><animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite"/></circle>}
                  <circle cx={h.x} cy={h.y} r="12" fill={fill} opacity={logged?0.9:0.85}/>
                  <text x={h.x} y={h.y+5} fontSize="12" textAnchor="middle" fill="#fff" fontWeight="bold" style={{pointerEvents:'none'}}>
                    {logged?'✓':isAdv?'!':'?'}
                  </text>
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip&&mode==='observe'&&(
              <g style={{pointerEvents:'none'}}>
                <rect x={Math.min(tooltip.x-90,370)} y={tooltip.y-38} width="190" height="24" rx="5" fill="rgba(15,23,42,0.92)"/>
                <text x={Math.min(tooltip.x-90,370)+95} y={tooltip.y-22} fontSize="10" textAnchor="middle" fill="#e2e8f0">{tooltip.label.substring(0,40)}</text>
              </g>
            )}

            {/* Measurement lines */}
            {roomMeas.map(m=>(
              <g key={m.id}>
                <line x1={m.p1.x} y1={m.p1.y} x2={m.p2.x} y2={m.p2.y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
                <circle cx={m.p1.x} cy={m.p1.y} r="5" fill="#f59e0b"/>
                <circle cx={m.p2.x} cy={m.p2.y} r="5" fill="#f59e0b"/>
                <rect x={(m.p1.x+m.p2.x)/2-22} y={(m.p1.y+m.p2.y)/2-10} width="44" height="16" rx="3" fill="rgba(0,0,0,0.75)"/>
                <text x={(m.p1.x+m.p2.x)/2} y={(m.p1.y+m.p2.y)/2+3} fontSize="10" textAnchor="middle" fill="#f59e0b">{m.dist} ft</text>
              </g>
            ))}
            {measurePts.length===1&&<circle cx={measurePts[0].x} cy={measurePts[0].y} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2"/>}

            {/* Annotation pins */}
            {roomAnns.map((a,i)=>(
              <g key={a.id}>
                <circle cx={a.x} cy={a.y} r="10" fill="#ef4444" opacity="0.9"/>
                <text x={a.x} y={a.y+4} fontSize="10" textAnchor="middle" fill="#fff" fontWeight="bold">{i+1}</text>
              </g>
            ))}
            {pending&&<circle cx={pending.x} cy={pending.y} r="9" fill="#ef4444" opacity="0.5" stroke="#fff" strokeWidth="2"/>}
          </svg>

          {/* Nav arrows */}
          {meta.prev&&<button onClick={()=>goTo(meta.prev)} style={{position:'absolute',left:6,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.65)',color:'#fff',border:'none',borderRadius:8,padding:'14px 10px',cursor:'pointer',fontSize:22,lineHeight:1}}>◀</button>}
          {meta.next&&<button onClick={()=>goTo(meta.next)} style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.65)',color:'#fff',border:'none',borderRadius:8,padding:'14px 10px',cursor:'pointer',fontSize:22,lineHeight:1}}>▶</button>}

          {/* Room label */}
          <div style={{position:'absolute',top:10,left:12,background:'rgba(0,0,0,0.65)',color:'#fff',padding:'4px 12px',borderRadius:20,fontSize:13,fontWeight:700}}>{meta.label}</div>
          <div style={{position:'absolute',bottom:10,left:12,background:'rgba(0,0,0,0.55)',color:'#94a3b8',padding:'3px 10px',borderRadius:12,fontSize:10}}>{ROOMS.indexOf(roomId)+1} of {ROOMS.length}</div>

          {/* Note popup */}
          {pending&&(
            <div style={{position:'absolute',top:'35%',left:'50%',transform:'translate(-50%,-50%)',background:'#1e293b',borderRadius:10,padding:12,zIndex:20,boxShadow:'0 4px 20px rgba(0,0,0,0.5)',minWidth:250}}>
              <div style={{fontSize:12,color:'#94a3b8',marginBottom:6}}>📝 Field Note — {meta.label}</div>
              <input autoFocus value={noteText} onChange={e=>setNoteText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveNote()} placeholder="Describe what you observe..." style={{width:'100%',padding:'6px 10px',borderRadius:6,border:'1px solid #475569',background:'#0f172a',color:'#fff',fontSize:12,boxSizing:'border-box'}}/>
              <div style={{display:'flex',gap:6,marginTop:8}}>
                <button onClick={saveNote} style={{flex:1,background:'#3b82f6',color:'#fff',border:'none',borderRadius:6,padding:'6px 0',cursor:'pointer',fontSize:12,fontWeight:700}}>Save</button>
                <button onClick={()=>setPending(null)} style={{flex:1,background:'#475569',color:'#fff',border:'none',borderRadius:6,padding:'6px 0',cursor:'pointer',fontSize:12}}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Room nav tabs */}
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {ROOMS.map(id=>{
            const m=ROOM_META[id]; const isActive=roomId===id; const isVisited=visited.has(id);
            return (
              <button key={id} onClick={()=>goTo(id)} style={{padding:'5px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:isActive?m.color:isVisited?'#1e293b':'#0f172a',color:isActive?'#fff':isVisited?'#94a3b8':'#475569',outline:isActive?`2px solid ${m.color}`:'none',outlineOffset:1}}>
                {isVisited?'✓ ':''}{m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right log panel */}
      <div style={{width:218,display:'flex',flexDirection:'column',gap:8,overflowY:'auto'}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:10}}>
          <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',marginBottom:6}}>INSPECTION SUMMARY</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
            {[['Rooms',ROOMS.length],['Visited',visited.size],['Found',observations.length],['Notes',annotations.length]].map(([l,v])=>(
              <div key={l} style={{background:'#0f172a',borderRadius:6,padding:'6px 8px'}}>
                <div style={{fontSize:18,fontWeight:700,color:'#3b82f6'}}>{v}</div>
                <div style={{fontSize:10,color:'#64748b'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:10,flex:1,overflowY:'auto'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',marginBottom:6}}>🔍 OBSERVATIONS LOG</div>
          {observations.length===0
            ?<div style={{fontSize:11,color:'#475569'}}>Switch to Observe mode and click the glowing markers.</div>
            :observations.map(o=>(
              <div key={o.id} style={{background:'#0f172a',borderRadius:6,padding:'5px 8px',marginBottom:4,borderLeft:`3px solid ${o.tag==='adverse'?'#ef4444':o.tag==='site'?'#3b82f6':'#10b981'}`}}>
                <div style={{fontSize:9,color:'#64748b'}}>{o.room}</div>
                <div style={{fontSize:11,color:'#e2e8f0',lineHeight:1.4}}>{o.label}</div>
              </div>
            ))
          }
          {annotations.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',marginTop:8,marginBottom:6}}>📝 FIELD NOTES</div>
            {annotations.map((a,i)=>(
              <div key={a.id} style={{background:'#0f172a',borderRadius:6,padding:'5px 8px',marginBottom:4}}>
                <div style={{fontSize:9,color:'#64748b'}}>{a.room}</div>
                <div style={{fontSize:11,color:'#e2e8f0'}}>#{i+1}: {a.text}</div>
                <button onClick={()=>setAnnotations(p=>p.filter(x=>x.id!==a.id))} style={{fontSize:9,color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:0,marginTop:2}}>✕ Remove</button>
              </div>
            ))}
          </>}
          {measurements.length>0&&<>
            <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',marginTop:8,marginBottom:6}}>📏 MEASUREMENTS</div>
            {measurements.map((m)=>(
              <div key={m.id} style={{background:'#0f172a',borderRadius:6,padding:'5px 8px',marginBottom:4}}>
                <div style={{fontSize:9,color:'#64748b'}}>{m.room}</div>
                <div style={{fontSize:12,fontWeight:700,color:'#f59e0b'}}>{m.dist} ft</div>
                <button onClick={()=>setMeasurements(p=>p.filter(x=>x.id!==m.id))} style={{fontSize:9,color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:0}}>✕ Remove</button>
              </div>
            ))}
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── Site Inspection Tab ───────────────────────────────────────
function SiteInspectionTab({ observations }) {
  const [form, setForm] = useState({ zoning:'',conforming:'',flood:'',env:'',envNotes:'',siteArea:'',usable:'',shape:'',topo:'',utilities:[],amenities:'',adverse:'' });
  const [saved, setSaved] = useState(false);
  const u = (k,v)=>{ setForm(f=>({...f,[k]:v})); setSaved(false); };

  const zoningOpts=['R-1 Single Family','R-2 Low Density','R-3 Multi-Family','C-1 Commercial','A-1 Agricultural','Mixed Use','Other'];
  const floodOpts=['Zone X (Minimal Risk)','Zone AE (High Risk)','Zone A (High Risk)','Zone VE (Coastal High Risk)','Zone D (Undetermined)'];
  const topoOpts=['Level','Gently Rolling','Sloping','Steep Slope','Below Street Grade','Above Street Grade'];
  const shapeOpts=['Rectangular','Irregular','Flag Lot','Corner Lot','Cul-de-sac','Other'];

  return (
    <div style={{display:'flex',gap:12,height:'100%',overflowY:'auto'}}>
      <div style={{width:220,flexShrink:0}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:10,marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:4}}>🏠 Property Brief</div>
          <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.5}}><b style={{color:'#e2e8f0'}}>{PROPERTY.address}</b><br/>{PROPERTY.city}<br/>{PROPERTY.type}</div>
        </div>
        <ObsPanel observations={observations} filterTags={['site']} emptyMsg="Complete the virtual tour first — log site observations (marked in blue) to see them here."/>
        <div style={{background:'#1e293b',borderRadius:8,padding:10,marginTop:8}}>
          <div style={{fontSize:11,color:'#64748b',lineHeight:1.5}}>💡 Use your observations from the tour to fill out this form. Site items are tagged in blue in your log.</div>
        </div>
      </div>
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,alignContent:'start'}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:8}}>🏛️ Zoning & Legal</div>
          {[['Zoning Classification','zoning',zoningOpts],['Legal Conforming?','conforming',['Legal Conforming','Legal Non-Conforming','Non-Legal Use','Unknown']]].map(([lbl,key,opts])=>(
            <div key={key} style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
              <select value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#ef4444',marginBottom:8}}>🌊 Flood & Environmental</div>
          <label style={{fontSize:11,color:'#94a3b8'}}>FEMA Flood Zone</label>
          <select value={form.flood} onChange={e=>u('flood',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginBottom:8,marginTop:2}}>
            <option value="">Select...</option>{floodOpts.map(o=><option key={o}>{o}</option>)}
          </select>
          <label style={{fontSize:11,color:'#94a3b8'}}>Environmental Issue?</label>
          <select value={form.env} onChange={e=>u('env',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginBottom:8,marginTop:2}}>
            <option value="">Select...</option><option>None Observed</option><option>Suspected — Needs Investigation</option><option>Confirmed — Client Notified</option>
          </select>
          <label style={{fontSize:11,color:'#94a3b8'}}>Notes</label>
          <textarea value={form.envNotes} onChange={e=>u('envNotes',e.target.value)} rows={2} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,resize:'none',boxSizing:'border-box'}} placeholder="Environmental findings..."/>
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#10b981',marginBottom:8}}>📐 Site Characteristics</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
            <div>
              <label style={{fontSize:11,color:'#94a3b8'}}>Total Site Area (sf)</label>
              <input type="number" value={form.siteArea} onChange={e=>u('siteArea',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,boxSizing:'border-box'}} placeholder="e.g. 8500"/>
            </div>
            <div>
              <label style={{fontSize:11,color:'#94a3b8'}}>Usable Area (sf)</label>
              <input type="number" value={form.usable} onChange={e=>u('usable',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,boxSizing:'border-box'}} placeholder="e.g. 7500"/>
            </div>
          </div>
          {[['Lot Shape','shape',shapeOpts],['Topography','topo',topoOpts]].map(([lbl,key,opts])=>(
            <div key={key} style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
              <select value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#f59e0b',marginBottom:8}}>⚡ Utilities & Site Amenities</div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Utilities Present</label>
          <textarea value={form.utilities} onChange={e=>u('utilities',e.target.value)} rows={2} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,resize:'none',boxSizing:'border-box'}} placeholder="Electric, Gas, Public Water, Sewer..."/>
          <label style={{fontSize:11,color:'#94a3b8',display:'block',marginTop:8}}>Site Amenities Observed</label>
          <textarea value={form.amenities} onChange={e=>u('amenities',e.target.value)} rows={2} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,resize:'none',boxSizing:'border-box'}} placeholder="Garage, driveway, landscaping, fence..."/>
          <label style={{fontSize:11,color:'#94a3b8',display:'block',marginTop:8}}>Adverse Site Conditions</label>
          <textarea value={form.adverse} onChange={e=>u('adverse',e.target.value)} rows={2} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,resize:'none',boxSizing:'border-box'}} placeholder="Drainage, easements, encroachments..."/>
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <button onClick={()=>setSaved(true)} style={{padding:'8px 24px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:13}}>{saved?'✅ Saved!':'Save Site Inspection'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Neighborhood Tab ─────────────────────────────────────────
function NeighborhoodTab({ observations }) {
  const [form, setForm] = useState({locType:'',builtUp:'',trend:'',marketing:'',priceRange:'',landUse:'',boundaries:'',influences:'',trendNotes:''});
  const [saved,setSaved] = useState(false);
  const u=(k,v)=>{setForm(f=>({...f,[k]:v}));setSaved(false);};
  const influenceList=['Employment / Economic','School Quality','Crime / Safety','Transportation Access','Proximity to Services','Environmental Hazard','Noise / Nuisance','View / Aesthetics','New Development Nearby'];
  const [selInf,setSelInf] = useState([]);
  const toggleInf=(v)=>{ setSelInf(s=>s.includes(v)?s.filter(x=>x!==v):[...s,v]); setSaved(false); };

  return (
    <div style={{display:'flex',gap:12,height:'100%',overflowY:'auto'}}>
      <div style={{width:220,flexShrink:0}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:10,marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:4}}>🌐 Neighborhood Context</div>
          <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.5}}>Document the market area and neighborhood characteristics for the subject property at <b style={{color:'#e2e8f0'}}>{PROPERTY.address}</b>.</div>
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:10}}>
          <div style={{fontSize:11,color:'#64748b',lineHeight:1.5}}>💡 Neighborhood data comes from market research, not just the property tour. Use your MLS data, public records, and the virtual tour's exterior observations.</div>
        </div>
        <ObsPanel observations={observations} filterTags={['site']} emptyMsg="Log site observations in the tour first."/>
      </div>
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,alignContent:'start'}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:8}}>🏘️ Overview</div>
          {[['Location Type','locType',['Urban','Suburban','Rural']],['Built-Up %','builtUp',['Over 75%','25–75%','Under 25%']],['Market Trend','trend',['Increasing','Stable','Declining']],['Typical Marketing Time','marketing',['Under 3 Months','3–6 Months','Over 6 Months']]].map(([lbl,key,opts])=>(
            <div key={key} style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
              <select value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#10b981',marginBottom:8}}>📊 Market Characteristics</div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Price Range</label>
          <input value={form.priceRange} onChange={e=>u('priceRange',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginBottom:8,marginTop:2,boxSizing:'border-box'}} placeholder="e.g. $250,000 – $450,000"/>
          <label style={{fontSize:11,color:'#94a3b8'}}>Predominant Land Use</label>
          <select value={form.landUse} onChange={e=>u('landUse',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginBottom:8,marginTop:2}}>
            <option value="">Select...</option><option>Single Family</option><option>2–4 Units</option><option>Commercial</option><option>Industrial</option><option>Vacant Land</option>
          </select>
          <label style={{fontSize:11,color:'#94a3b8'}}>Neighborhood Boundaries</label>
          <textarea value={form.boundaries} onChange={e=>u('boundaries',e.target.value)} rows={3} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,resize:'none',boxSizing:'border-box'}} placeholder="N: Hwy 40  S: River Rd  E: Oak Ave  W: Pine St"/>
        </div>
        <div style={{background:'#1e293b',borderRadius:8,padding:12,gridColumn:'1 / -1'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#f59e0b',marginBottom:8}}>⚠️ Neighborhood Influences</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
            {influenceList.map(inf=>(
              <button key={inf} onClick={()=>toggleInf(inf)} style={{padding:'4px 10px',borderRadius:12,border:'none',cursor:'pointer',fontSize:11,background:selInf.includes(inf)?'#f59e0b':'#334155',color:selInf.includes(inf)?'#1e293b':'#94a3b8',fontWeight:selInf.includes(inf)?700:400}}>{inf}</button>
            ))}
          </div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Trend Notes & Additional Characteristics</label>
          <textarea value={form.trendNotes} onChange={e=>u('trendNotes',e.target.value)} rows={3} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:4,resize:'none',boxSizing:'border-box'}} placeholder="Describe neighborhood trends, nearby developments, school quality, demand drivers..."/>
          <button onClick={()=>setSaved(true)} style={{marginTop:10,padding:'8px 24px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:13}}>{saved?'✅ Saved!':'Save Neighborhood Data'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Improvements Tab ─────────────────────────────────────────
function ImprovementsTab({ observations }) {
  const [form, setForm] = useState({constructType:'',quality:'',condition:'',yearBuilt:'',stories:'',gla:'',totalRooms:'',bed:'',bath:'',halfBath:'',foundation:'',basementFin:'',roofMat:'',roofCond:'',extWalls:'',hvac:'',interiorFinish:'',adverseItems:[],adverseNotes:'',description:''});
  const [saved,setSaved]=useState(false);
  const u=(k,v)=>{setForm(f=>({...f,[k]:v}));setSaved(false);};
  const toggleAdv=(v)=>{setForm(f=>({...f,adverseItems:f.adverseItems.includes(v)?f.adverseItems.filter(x=>x!==v):[...f.adverseItems,v]});setSaved(false);};

  const adverseOpts=['Foundation Cracks','Water Damage / Staining','Mold / Mildew','Roof Damage','Deferred Maintenance','Pest Infestation','Structural Issues','Electrical Hazards','Plumbing Issues','Code Violations'];
  const qualityOpts=['Q1 - Exceptional','Q2 - Excellent','Q3 - Good','Q4 - Average','Q5 - Fair','Q6 - Low'];
  const condOpts=['C1 - New','C2 - Near New','C3 - Average','C4 - Below Average','C5 - Poor','C6 - Severely Distressed'];
  const foundOpts=['Concrete Slab','Crawl Space','Full Basement','Partial Basement','Pier & Beam','Other'];
  const roofOpts=['Asphalt Shingle','Metal','Tile','Wood Shake','Flat/Built-Up','Other'];
  const hvacOpts=['Central A/C + Forced Air','Heat Pump','Radiant / Baseboard','Window Units','None','Other'];
  const extWallOpts=['Vinyl Siding','Brick','Stucco','Wood Siding','Fiber Cement','EIFS','Other'];

  const improvObs = observations.filter(o=>o.tag==='improvement'||o.tag==='adverse');

  return (
    <div style={{display:'flex',gap:12,height:'100%',overflowY:'auto'}}>
      <div style={{width:220,flexShrink:0}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:10,marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:4}}>🔍 What You Observed</div>
          <div style={{fontSize:11,color:'#64748b',lineHeight:1.5}}>Use your tour observations below to complete this form. Items marked ⚠ are adverse conditions.</div>
        </div>
        <ObsPanel observations={observations} filterTags={['improvement','adverse']} emptyMsg="Navigate the tour rooms and click the observation hotspots to populate your findings here."/>
      </div>
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,alignContent:'start'}}>
        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#3b82f6',marginBottom:8}}>🏗️ Construction & Quality</div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Construction Type</label>
          <select value={form.constructType} onChange={e=>u('constructType',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginBottom:8,marginTop:2}}>
            <option value="">Select...</option>
            {['Wood Frame','Masonry / Brick','Steel Frame','Log','Modular','Manufactured','Other'].map(o=><option key={o}>{o}</option>)}
          </select>
          {[['Quality Rating (UAD)','quality',qualityOpts],['Condition Rating (UAD)','condition',condOpts]].map(([lbl,key,opts])=>(
            <div key={key} style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
              <select value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            <div>
              <label style={{fontSize:11,color:'#94a3b8'}}>Year Built</label>
              <input value={form.yearBuilt} onChange={e=>u('yearBuilt',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,boxSizing:'border-box'}} placeholder="e.g. 1998"/>
            </div>
            <div>
              <label style={{fontSize:11,color:'#94a3b8'}}>Stories</label>
              <select value={form.stories} onChange={e=>u('stories',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Sel.</option><option>1</option><option>1.5</option><option>2</option><option>2.5</option><option>3+</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#10b981',marginBottom:8}}>🚪 Room Count & GLA</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
            {[['Total Rooms','totalRooms'],['Bedrooms','bed'],['Full Baths','bath'],['Half Baths','halfBath']].map(([lbl,key])=>(
              <div key={key}>
                <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
                <input type="number" value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,boxSizing:'border-box'}} placeholder="0"/>
              </div>
            ))}
          </div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Above-Grade GLA (sq ft)</label>
          <input type="number" value={form.gla} onChange={e=>u('gla',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,marginBottom:8,boxSizing:'border-box'}} placeholder="e.g. 1950"/>
          <label style={{fontSize:11,color:'#94a3b8'}}>Foundation Type</label>
          <select value={form.foundation} onChange={e=>u('foundation',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2,marginBottom:8}}>
            <option value="">Select...</option>{foundOpts.map(o=><option key={o}>{o}</option>)}
          </select>
          {(form.foundation==='Full Basement'||form.foundation==='Partial Basement')&&<>
            <label style={{fontSize:11,color:'#94a3b8'}}>Basement Finished %</label>
            <select value={form.basementFin} onChange={e=>u('basementFin',e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
              <option value="">Select...</option><option>0% Unfinished</option><option>25%</option><option>50%</option><option>75%</option><option>100% Finished</option>
            </select>
          </>}
        </div>

        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#f59e0b',marginBottom:8}}>🔧 Systems & Materials</div>
          {[['Roof Material','roofMat',roofOpts],['Roof Condition','roofCond',['Good','Average','Fair','Poor','Replace Soon']],['Exterior Walls','extWalls',extWallOpts],['HVAC','hvac',hvacOpts],['Interior Finish','interiorFinish',['Standard','Updated','Upgraded','Custom / High-End','Below Average','Dated']]].map(([lbl,key,opts])=>(
            <div key={key} style={{marginBottom:8}}>
              <label style={{fontSize:11,color:'#94a3b8'}}>{lbl}</label>
              <select value={form[key]} onChange={e=>u(key,e.target.value)} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:2}}>
                <option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{background:'#1e293b',borderRadius:8,padding:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#ef4444',marginBottom:8}}>⚠️ Adverse Conditions</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:10}}>
            {adverseOpts.map(a=>(
              <button key={a} onClick={()=>toggleAdv(a)} style={{padding:'3px 8px',borderRadius:12,border:'none',cursor:'pointer',fontSize:10,background:form.adverseItems.includes(a)?'#ef4444':'#334155',color:form.adverseItems.includes(a)?'#fff':'#94a3b8',fontWeight:form.adverseItems.includes(a)?700:400}}>{a}</button>
            ))}
          </div>
          <label style={{fontSize:11,color:'#94a3b8'}}>Adverse Condition Notes</label>
          <textarea value={form.adverseNotes} onChange={e=>u('adverseNotes',e.target.value)} rows={2} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:4,resize:'none',boxSizing:'border-box'}} placeholder="Describe adverse conditions observed in the tour..."/>
          <label style={{fontSize:11,color:'#94a3b8',display:'block',marginTop:8}}>Overall Improvement Description</label>
          <textarea value={form.description} onChange={e=>u('description',e.target.value)} rows={4} style={{width:'100%',padding:'5px 8px',borderRadius:6,border:'1px solid #334155',background:'#0f172a',color:'#e2e8f0',fontSize:12,marginTop:4,resize:'none',boxSizing:'border-box'}} placeholder="Provide a thorough description — quality, updates, upgrades, notable features, overall condition..."/>
        </div>

        <div style={{gridColumn:'1 / -1'}}>
          <button onClick={()=>setSaved(true)} style={{padding:'8px 24px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:13}}>{saved?'✅ Saved!':'Save Improvements Data'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────
function App() {
  const [tab,setTab] = useState('tour');
  const [observations,setObservations] = useState([]);
  const tabs=[{id:'tour',label:'🏠 Virtual Tour'},{id:'site',label:'🏡 Site Inspection'},{id:'neighborhood',label:'🌐 Neighborhood'},{id:'improvements',label:'🔍 Improvements'}];

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#0f172a',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{background:'#1e293b',padding:'10px 16px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #334155'}}>
        <div style={{background:'#3b82f6',borderRadius:8,padding:'5px 10px',fontWeight:900,fontSize:16,color:'#fff',letterSpacing:2}}>VISTA</div>
        <div>
          <div style={{fontSize:12,color:'#e2e8f0',fontWeight:600}}>{PROPERTY.address} · {PROPERTY.city}</div>
          <div style={{fontSize:10,color:'#64748b'}}>{PROPERTY.type} · {PROPERTY.sqft}</div>
        </div>
        <div style={{marginLeft:'auto',background:'#0f172a',borderRadius:12,padding:'3px 10px',fontSize:10,color:'#475569'}}>PAREA LR Compliant</div>
      </div>
      {/* Tabs */}
      <div style={{display:'flex',background:'#1e293b',borderBottom:'1px solid #334155'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 18px',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:tab===t.id?'#0f172a':'transparent',color:tab===t.id?'#3b82f6':'#64748b',borderBottom:tab===t.id?'2px solid #3b82f6':'2px solid transparent'}}>{t.label}</button>
        ))}
        {observations.length>0&&<div style={{marginLeft:'auto',display:'flex',alignItems:'center',paddingRight:16,fontSize:11,color:'#22c55e'}}>✓ {observations.length} observations logged</div>}
      </div>
      {/* Content */}
      <div style={{flex:1,padding:14,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        {tab==='tour'&&<TourTab observations={observations} setObservations={setObservations}/>}
        {tab==='site'&&<SiteInspectionTab observations={observations}/>}
        {tab==='neighborhood'&&<NeighborhoodTab observations={observations}/>}
        {tab==='improvements'&&<ImprovementsTab observations={observations}/>}
      </div>
    </div>
  );
}
