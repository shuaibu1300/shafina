import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCtP-mYH8kLnu_UdfPwfOY1zDguvvfzMFw",
  authDomain: "shafina-platform.firebaseapp.com",
  projectId: "shafina-platform",
  storageBucket: "shafina-platform.appspot.com",
  messagingSenderId: "532233463263",
  appId: "1:532233463263:web:cd7a81ede2b7a0e3d1d06a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  bg:       '#0f1117',
  surface:  '#181c27',
  card:     '#1e2333',
  border:   '#2a3047',
  accent:   '#3b82f6',
  accentDim:'#1d4ed8',
  teal:     '#14b8a6',
  green:    '#22c55e',
  red:      '#ef4444',
  amber:    '#f59e0b',
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#475569',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.textPrimary}; font-family: 'Inter', sans-serif; }
  input, select, textarea { outline: none; }
  input:focus, select:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 2px ${C.accent}22; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }

  .logo-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, ${C.accent} 0%, ${C.teal} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }
  .logo-sub {
    font-size: 10px;
    color: ${C.textMuted};
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .grid-btn {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 20px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: all 0.2s ease;
    color: ${C.textPrimary};
  }
  .grid-btn:hover {
    border-color: ${C.accent};
    background: ${C.surface};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${C.accent}22;
  }
  .grid-btn .icon-wrap {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .grid-btn span.label {
    font-size: 13px;
    font-weight: 600;
    color: ${C.textPrimary};
  }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, ${C.accent}, ${C.accentDim});
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: opacity 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-danger {
    padding: 9px 20px;
    background: transparent;
    color: ${C.red};
    border: 1px solid ${C.red}44;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
  }
  .btn-danger:hover { background: ${C.red}11; }

  .btn-back {
    padding: 7px 14px;
    background: ${C.surface};
    color: ${C.textSecondary};
    border: 1px solid ${C.border};
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-back:hover { border-color: ${C.accent}; color: ${C.textPrimary}; }

  .field {
    width: 100%;
    padding: 11px 14px;
    margin: 6px 0;
    border-radius: 8px;
    border: 1px solid ${C.border};
    background: ${C.bg};
    color: ${C.textPrimary};
    font-size: 14px;
    transition: border-color 0.2s;
  }
  .field::placeholder { color: ${C.textMuted}; }

  .card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 14px;
    padding: 18px;
    margin: 10px 0;
  }

  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: ${C.textPrimary};
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 4px;
  }
  .section-sub {
    font-size: 12px;
    color: ${C.textMuted};
    margin-bottom: 16px;
    padding-left: 30px;
  }
.progress-bar-bg {
    background: ${C.border};
    border-radius: 6px;
    height: 8px;
    overflow: hidden;
    margin: 10px 0 4px;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${C.teal}, ${C.accent});
    border-radius: 6px;
    transition: width 0.3s ease;
  }

  .media-card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 14px;
    margin: 8px 0;
  }
  .media-card h4 {
    font-size: 14px;
    font-weight: 600;
    color: ${C.textPrimary};
    margin-bottom: 10px;
  }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .stat-card {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 14px;
    text-align: center;
  }

  .topbar {
    width: 90%;
    max-width: 468px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-bottom: 4px;
  }
  .user-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px;
    color: ${C.textSecondary};
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-wrap {
    width: 90%;
    max-width: 468px;
    position: relative;
    margin-bottom: 14px;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${C.textMuted};
    font-size: 14px;
  }
  .search-input {
    width: 100%;
    padding: 11px 14px 11px 36px;
    border-radius: 10px;
    border: 1px solid ${C.border};
    background: ${C.surface};
    color: ${C.textPrimary};
    font-size: 14px;
  }
  .search-input::placeholder { color: ${C.textMuted}; }
  .search-input:focus { border-color: ${C.accent}; outline: none; }

  .divider { height: 1px; background: ${C.border}; margin: 14px 0; }

  .upload-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: ${C.teal};
    font-weight: 500;
    margin: 4px 0 2px;
  }

  .file-input-wrap {
    border: 1px dashed ${C.border};
    border-radius: 8px;
    padding: 14px;
    text-align: center;
    margin: 6px 0;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .file-input-wrap:hover { border-color: ${C.accent}; }
  .file-input-wrap input { display: none; }
  .file-input-label {
    font-size: 13px;
    color: ${C.textSecondary};
    cursor: pointer;
    display: block;
  }
  .file-chosen {
    font-size: 12px;
    color: ${C.teal};
    margin-top: 4px;
    word-break: break-all;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pulse { animation: pulse 1.5s infinite; }
`;

// ─── AD BANNER ────────────────────────────────────────────────────
const AdBanner = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerText = `atOptions={'key':'34ff23d0cccf8ab433c8f1526824df48','format':'iframe','height':60,'width':468,'params':{}};`;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/34ff23d0cccf8ab433c8f1526824df48/invoke.js';
      ref.current.appendChild(conf);
      ref.current.appendChild(script);
    }
  }, []);
return (
    <div ref={ref} style={{
      width: '100%', maxWidth: '468px', height: '60px',
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '8px', margin: '8px auto',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden'
    }} />
  );
};

// ─── ICON COLORS PER SECTION ─────────────────────────────────────
const sectionMeta = {
  video:             { icon: '▶️', color: '#ef4444', bg: '#7f1d1d33', label: 'Video' },
  pdf:               { icon: '📄', color: '#f59e0b', bg: '#78350f33', label: 'PDF' },
  image:             { icon: '🖼️', color: '#8b5cf6', bg: '#4c1d9533', label: 'Image' },
  audio:             { icon: '🎵', color: '#22c55e', bg: '#14532d33', label: 'Audio' },
  attendance:        { icon: '📅', color: '#3b82f6', bg: '#1e3a5f33', label: 'Attendance' },
  'school management':{ icon: '🏫', color: '#14b8a6', bg: '#0f3d3833', label: 'School Mgmt' },
  expensive:         { icon: '💰', color: '#f59e0b', bg: '#78350f33', label: 'Expense Tracker' },
};

// ─── UPLOAD SECTION COMPONENT ────────────────────────────────────
const UploadSection = ({ sectionKey, collectionName, accept, placeholder, uploadState, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [pass, setPass] = useState('');
  const meta = sectionMeta[sectionKey];
  const isActive = uploadState.isUploading && uploadState.activeSection === sectionKey;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(e, file, title, pass, sectionKey, collectionName,
      () => setFile(null), () => setTitle(''), () => setPass(''));
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <input
        className="field"
        placeholder={placeholder}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Custom file picker */}
      <div className="file-input-wrap" onClick={() => document.getElementById(`file-${sectionKey}`).click()}>
        <label className="file-input-label">
          {file ? null : `📁 Danna don zaɓi fayil (${accept})`}
          <input
            id={`file-${sectionKey}`}
            type="file"
            accept={accept}
            onChange={e => setFile(e.target.files[0])}
          />
        </label>
        {file && <div className="file-chosen">✅ {file.name}</div>}
      </div>

      <input
        className="field"
        type="password"
        placeholder="🔐 Upload Password"
        value={pass}
        onChange={e => setPass(e.target.value)}
      />

      {isActive && (
        <div>
          <div className="upload-status">
            <span className="pulse">⬆️</span>
            <span>Ana ɗorawa... {uploadState.progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${uploadState.progress}%` }} />
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        type="submit"
        disabled={uploadState.isUploading}
        style={{ marginTop: '8px' }}
      >
        {isActive ? 'Yana Tafiya...' : `⬆️ Ɗora ${meta.label}`}
      </button>
    </form>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────
function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [uploadState, setUploadState] = useState({ activeSection: null, progress: 0, isUploading: false });

  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [audios, setAudios] = useState([]);
  const [images, setImages] = useState([]);

  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [stdName, setStdName] = useState('');
  const [stdAge, setStdAge] = useState('');
  const [stdDate, setStdDate] = useState('');
  const [stdTime, setStdTime] = useState('');
  const [stdDesc, setStdDesc] = useState('');

const [schoolClasses, setSchoolClasses] = useState([]);
  const [newSchoolClassName, setNewSchoolClassName] = useState('');
  const [selectedSchoolClassId, setSelectedSchoolClassId] = useState('');
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [schName, setSchName] = useState('');
  const [schAge, setSchAge] = useState('');
  const [schDate, setSchDate] = useState('');
  const [schTerm, setSchTerm] = useState('First Term');
  const [schAmount, setSchAmount] = useState('');
  const [schDesc, setSchDesc] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [transTitle, setTransTitle] = useState('');
  const [transAmount, setTransAmount] = useState('');
  const [transType, setTransType] = useState('income');
  const [transDate, setTransDate] = useState('');
  const [transDesc, setTransDesc] = useState('');

  const UPLOAD_SECRET_PASSWORD = "shafina2026";

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => setUser(u));

    const snap = (col, setter, ord) => {
      const q = ord ? query(collection(db, col), orderBy(ord, "desc")) : collection(db, col);
      return onSnapshot(q, s => setter(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    };

    const u1 = snap("videos", setVideos, "createdAt");
    const u2 = snap("pdfs", setPdfs, "createdAt");
    const u3 = snap("audios", setAudios, "createdAt");
    const u4 = snap("images", setImages, "createdAt");
    const u5 = snap("classes", setClasses, null);
    const u6 = snap("students", setStudents, null);
    const u7 = snap("school_classes", setSchoolClasses, null);
    const u8 = snap("school_students", setSchoolStudents, null);
    const u9 = snap("transactions", setTransactions, "date");

    return () => [u1,u2,u3,u4,u5,u6,u7,u8,u9,unsubAuth].forEach(u => u());
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert("Don Allah cika duka akwatunan!"); return; }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("An ƙirƙiri asusu cikin nasara!");
        setIsLogin(true);
      }
    } catch (err) { alert("Kuskure: " + err.message); }
  };


  const handlePdfUpload = async (e, file, title, pass, sectionName, collectionName, resetFile, resetTitle, resetPass) => {
    e.preventDefault();
    if (pass !== UPLOAD_SECRET_PASSWORD) { alert("Kuskure: Upload Password ba daidai ba ne!"); return; }
    if (!file || !title) { alert("Don Allah zaɓi fayil sannan ka saka suna!"); return; }

    setUploadState({ activeSection: sectionName, progress: 0, isUploading: true });

    try {
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, collectionName), {
        title,
        url,
        createdAt: new Date()
      });

      setUploadState({ activeSection: null, progress: 0, isUploading: false });
      resetFile(null); resetTitle(''); resetPass('');
      alert("✅ An adana PDF dinka cikin nasara!");
    } catch (err) {
      setUploadState({ activeSection: null, progress: 0, isUploading: false });
      alert("Kuskure: " + err.message);
    }
  };
  // ── FIXED UPLOAD: uses file directly (not FileList) ─────────────
  const handleStoreUpload = (e, file, title, pass, sectionName, collectionName, resetFile, resetTitle, resetPass) => {
    e.preventDefault();
    if (pass !== UPLOAD_SECRET_PASSWORD) { alert("Kuskure: Upload Password ba daidai ba ne!"); return; }
    if (!file || !title) { alert("Don Allah zaɓi fayil sannan ka saka suna!"); return; }

    setUploadState({ activeSection: sectionName, progress: 0, isUploading: true });

    const formData = new FormData();
    formData.append("file", file); // ✅ single File object
    formData.append("upload_preset", "shafina_preset");

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        setUploadState(prev => ({ ...prev, progress: Math.round((ev.loaded / ev.total) * 100) }));
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const finalURL = collectionName === "pdfs" ? data.secure_url.replace("/image/upload/", "/raw/upload/") : data.secure_url;
          await addDoc(collection(db, collectionName), {
            title,
            url: finalURL,
            createdAt: new Date()
          });
          resetFile(null); resetTitle(''); resetPass('');
          alert("✅ An adana fayil ɗinka cikin nasara!");
        } catch {
          alert("Error: Matsala wajen karanta amsar server.");
          setUploadState({ activeSection: null, progress: 0, isUploading: false });
        }
      } else {
        alert("Upload Error: Server ya kasa amsa daidai.");
        setUploadState({ activeSection: null, progress: 0, isUploading: false });
      }
    });

    xhr.addEventListener('error', () => {
      alert("Upload Failed: Duba hadin intanet ɗinka!");
      setUploadState({ activeSection: null, progress: 0, isUploading: false });
    });

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/djzaxvlus/auto/upload', true);
    xhr.send(formData);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !stdName) return alert("Cika sunan ɗalibi da aji!");
    await addDoc(collection(db, "students"), {
      classId: selectedClassId, name: stdName, age: stdAge,
      date: stdDate, time: stdTime, description: stdDesc, status: 'Present'
    });
    setStdName(''); setStdAge(''); setStdDate(''); setStdTime(''); setStdDesc('');
    alert("An ajiye halartar ɗalibi!");
  };

  const handleSchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchoolClassId || !schName) return alert("Cika sunan ɗalibi!");
    await addDoc(collection(db, "school_students"), {
      classId: selectedSchoolClassId, name: schName, age: schAge,
      date: schDate, term: schTerm, amount: parseFloat(schAmount) || 0, description: schDesc
    });
    setSchName(''); setSchAge(''); setSchDate(''); setSchAmount(''); setSchDesc('');
    alert("An adana bayanin kuɗin makaranta!");
  };

const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!transTitle || !transAmount) return alert("Cika abin da aka yi da adadin kuɗi!");
    await addDoc(collection(db, "transactions"), {
      title: transTitle, amount: parseFloat(transAmount) || 0,
      type: transType, date: transDate, description: transDesc
    });
    setTransTitle(''); setTransAmount(''); setTransDate(''); setTransDesc('');
    alert("An ƙara bayanin kuɗi!");
  };

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const nav = (screen) => { setCurrentScreen(screen); setSearchQuery(''); };

  const filterBySearch = (arr, key = 'title') =>
    arr.filter(i => (i[key] || '').toLowerCase().includes(searchQuery.toLowerCase()));

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div style={{ backgroundColor: C.bg, color: C.textPrimary, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 40px' }}>

        {/* ── HEADER ── */}
        <div style={{ width: '90%', maxWidth: '468px', padding: '10px 0 6px', textAlign: 'center' }}>
          <div className="logo-text">Shuaibu Design and Technology</div>
          <div className="logo-sub">SDAT Network (Shuaibu Design And Technology)</div>
        </div>

        <AdBanner />

        {/* ── AUTH ── */}
        {!user ? (
          <div className="card" style={{ width: '90%', maxWidth: '468px', marginTop: '20px' }}>
            <h2 style={{ marginBottom: '18px', fontSize: '18px', fontWeight: '700', color: C.textPrimary }}>
              {isLogin ? '👤 Shiga' : '✨ Sabon Asusu'}
            </h2>
            <form onSubmit={handleAuth}>
              <input className="field" type="email" placeholder="📧 Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="field" type="password" placeholder="🔐 Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '14px' }} />
              <button className="btn-primary" type="submit">
                {isLogin ? 'Shiga' : 'Yi Rajista'}
              </button>
            </form>
            <div
              style={{ color: C.teal, marginTop: '16px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Ba ka da asusu? → Ƙirƙiri sabo" : "Kuna da asusu? → Shiga"}
            </div>
          </div>

        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ── TOP BAR ── */}
            <div className="topbar">
              <div className="user-pill">
                <span>📧</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
              </div>
              {currentScreen !== 'dashboard' && (
                <button className="btn-back" onClick={() => nav('dashboard')}>
                  ← Baya
                </button>
              )}
            </div>

            {/* ── SEARCH ── */}
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Nemo rubutu a nan..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ════════════════════════════════════════════════
                DASHBOARD
            ════════════════════════════════════════════════ */}
            {currentScreen === 'dashboard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '90%', maxWidth: '468px' }}>
                {Object.entries(sectionMeta)
                  .filter(([key, m]) => m.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(([key, m]) => (
                    <button key={key} className="grid-btn" onClick={() => nav(key)}>
                      <div className="icon-wrap" style={{ background: m.bg }}>
                        <span>{m.icon}</span>
                      </div>
                      <span className="label">{m.label}</span>
                    </button>
                  ))
                }
              </div>
            )}

            {/* ════════════════════════════════════════════════
                VIDEO
            ════════════════════════════════════════════════ */}
            {currentScreen === 'video' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">▶️ Sashin Bidiyo</div>
                <div className="section-sub">Videos Folder</div>
                <UploadSection
                  sectionKey="video" collectionName="videos"
                  accept="video/*" placeholder="Sunan Bidiyo"
                  uploadState={uploadState} onUpload={handleStoreUpload}
                />
                <div className="divider" />
                {filterBySearch(videos).map(v => (
                  <div key={v.id} className="media-card">
                    <h4>▶️ {v.title}</h4>
                    <video src={v.url} controls style={{ width: '100%', borderRadius: '8px', background: '#000' }} />
                  </div>
                ))}
                {videos.length === 0 && <p style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Babu bidiyo da aka ɗora tukuna.</p>}
              </div>
            )}

            {/* ════════════════════════════════════════════════
               
 PDF
            ════════════════════════════════════════════════ */}
            {currentScreen === 'pdf' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">📄 Sashin Littattafai</div>
                <div className="section-sub">PDFs Folder</div>
                <UploadSection
                  sectionKey="pdf" collectionName="pdfs"
yy
                  accept="application/pdf" placeholder="Sunan Littafi"
                  uploadState={uploadState} onUpload={handlePdfUpload}
                />
                <div className="divider" />
                {filterBySearch(pdfs).map(p => (
                  <div key={p.id} className="media-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>📄</span>
                    <div>
                      <h4 style={{ margin: 0 }}>{p.title}</h4>
<a href={p.url} download target="_blank" rel="noopener noreferrer">                        Buɗe PDF 
                      </a>
                    </div>
                  </div>
                ))}
                {pdfs.length === 0 && <p style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Babu PDF da aka ɗora tukuna.</p>}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                AUDIO
            ════════════════════════════════════════════════ */}
            {currentScreen === 'audio' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">🎵 Sashin Sauti</div>
                <div className="section-sub">Audios Folder</div>
                <UploadSection
                  sectionKey="audio" collectionName="audios"
                  accept="audio/*" placeholder="Sunan Sauti"
                  uploadState={uploadState} onUpload={handleStoreUpload}
                />
<div className="divider" />
                {filterBySearch(audios).map(a => (
                  <div key={a.id} className="media-card">
                    <h4>🎵 {a.title}</h4>
                    <audio src={a.url} controls style={{ width: '100%' }} />
                  </div>
                ))}
                {audios.length === 0 && <p style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Babu sauti da aka ɗora tukuna.</p>}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                IMAGE
            ════════════════════════════════════════════════ */}
            {currentScreen === 'image' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">🖼️ Sashin Hoto</div>
                <div className="section-sub">Images Folder</div>
                <UploadSection
                  sectionKey="image" collectionName="images"
                  accept="image/*" placeholder="Sunan Hoto"
                  uploadState={uploadState} onUpload={handleStoreUpload}
                />
                <div className="divider" />
                {filterBySearch(images).map(img => (
                  <div key={img.id} className="media-card">
                    <h4>🖼️ {img.title}</h4>
                    <img src={img.url} alt={img.title} style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
                  </div>
                ))}
                {images.length === 0 && <p style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Babu hoto da aka ɗora tukuna.</p>}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                ATTENDANCE
            ════════════════════════════════════════════════ */}
            {currentScreen === 'attendance' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">📅 Sashin Halarta</div>
                <div className="section-sub">Attendance Management</div>

                <div className="card">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '10px' }}>➕ Ƙirƙiri Aji</p>
                  <input className="field" placeholder="Sunan Aji (e.g. JSS 1)" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                  <button className="btn-primary" style={{ marginTop: '8px' }} onClick={async () => {
                    if (newClassName) { await addDoc(collection(db, "classes"), { className: newClassName }); setNewClassName(''); alert("An ƙirƙiro aji!"); }
                  }}>Ajiye Aji</button>
                </div>

                <form onSubmit={handleStudentSubmit} className="card" style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '10px' }}>📝 Rijistar Halarta</p>
                  <select className="field" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                    <option value="">— Zaɓi Aji —</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                  </select>
                  <input className="field" placeholder="Sunan Ɗalibi" value={stdName} onChange={e => setStdName(e.target.value)} />
                  <input className="field" placeholder="Shekaru" value={stdAge} onChange={e => setStdAge(e.target.value)} />
                  <input className="field" type="date" value={stdDate} onChange={e => setStdDate(e.target.value)} />
                  <input className="field" type="time" value={stdTime} onChange={e => setStdTime(e.target.value)} />
                  <input className="field" placeholder="Karin Bayani" value={stdDesc} onChange={e => setStdDesc(e.target.value)} />
                  <button className="btn-primary" type="submit" style={{ marginTop: '8px' }}>✅ Ɗauki Halarta (Present)</button>
                </form>

                <div className="divider" />
                {students
                  .filter(s => s.classId === selectedClassId && (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => (
                    <div key={s.id} className="media-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4>👤 {s.name} <span style={{ fontSize: '11px', color: C.textMuted }}>({s.age} Yrs)</span></h4>
                        <span className="tag" style={{ background: '#14532d44', color: C.green }}>{s.status}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: C.textSecondary, marginTop: '6px' }}>📅 {s.date} · ⏰ {s.time}</p>
                      {s.description && <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>📝 {s.description}</p>}
                    </div>
                  ))}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                SCHOOL MANAGEMENT
            ════════════════════════════════════════════════ */}
            {currentScreen === 'school management' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">🏫 School Management</div>
                <div className="section-sub">Fee & Student Records</div>

                <div className="card">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '10px' }}>➕ Ƙirƙiri Aji</p>
                  <input className="field" placeholder="Misali: Primary 1" value={newSchoolClassName} onChange={e => setNewSchoolClassName(e.target.value)} />
                  <button className="btn-primary" style={{ marginTop: '8px' }} onClick={async () => {
                    if (newSchoolClassName) { await addDoc(collection(db, "school_classes"), { className: newSchoolClassName }); setNewSchoolClassName(''); alert("An ƙirƙiro aji!"); }
                  }}>Kaddamar da Aji</button>
                </div>

                <form onSubmit={handleSchSubmit} className="card" style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '10px' }}>💳 Biyan Kuɗaɗen Makaranta</p>
                  <select className="field" value={selectedSchoolClassId} onChange={e => setSelectedSchoolClassId(e.target.value)}>
                    <option value="">— Zaɓi Aji —</option>
                    {schoolClasses.map(sc => <option key={sc.id} value={sc.id}>{sc.className}</option>)}
                  </select>
                  <input className="field" placeholder="Sunan Ɗalibi" value={schName} onChange={e => setSchName(e.target.value)} />
                  <input className="field" placeholder="Shekaru" value={schAge} onChange={e => setSchAge(e.target.value)} />
                  <input className="field" type="date" value={schDate} onChange={e => setSchDate(e.target.value)} />
                  <select className="field" value={schTerm} onChange={e => setSchTerm(e.target.value)}>
                    <option value="First Term">First Term</option>
                    <option value="Second Term">Second Term</option>
                    <option value="Third Term">Third Term</option>
                  </select>
                  <input className="field" type="number" placeholder="Adadin Kuɗi (₦)" value={schAmount} onChange={e => setSchAmount(e.target.value)} />
                  <input className="field" placeholder="Karin bayani" value={schDesc} onChange={e => setSchDesc(e.target.value)} />
                  <button className="btn-primary" type="submit" style={{ marginTop: '8px' }}>Adana Biyan Kuɗi</button>
                </form>
 <div className="divider" />
                {schoolStudents
                  .filter(ss => ss.classId === selectedSchoolClassId && (ss.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(ss => (
                    <div key={ss.id} className="media-card">
                      <h4>🎓 {ss.name} <span style={{ fontSize: '11px', color: C.textMuted }}>({ss.age} Yrs)</span></h4>
                      <p style={{ fontSize: '13px', color: C.green, fontWeight: '600', marginTop: '6px' }}>₦{(ss.amount || 0).toLocaleString()}</p>
                      <p style={{ fontSize: '12px', color: C.textSecondary, marginTop: '4px' }}>📅 {ss.term} · {ss.date}</p>
                      {ss.description && <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>📝 {ss.description}</p>}
                    </div>
                  ))}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                EXPENSE TRACKER
            ════════════════════════════════════════════════ */}
            {currentScreen === 'expensive' && (
              <div style={{ width: '90%', maxWidth: '468px' }}>
                <div className="section-title">💰 Expense Tracker</div>
                <div className="section-sub">Kula da Kuɗi</div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div className="stat-card">
                    <div style={{ fontSize: '11px', color: C.green, fontWeight: '600', marginBottom: '4px' }}>INCOME ↑</div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>₦{totalIncome.toLocaleString()}</div>
                  </div>
                  <div className="stat-card">
                    <div style={{ fontSize: '11px', color: C.red, fontWeight: '600', marginBottom: '4px' }}>EXPENSE ↓</div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>₦{totalExpense.toLocaleString()}</div>
                  </div>
                </div>
                <div className="stat-card" style={{ marginBottom: '12px', border: `1px solid ${totalBalance >= 0 ? C.green + '44' : C.red + '44'}` }}>
                  <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '4px' }}>BALANCE</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: totalBalance >= 0 ? C.green : C.red }}>
                    {totalBalance >= 0 ? '+' : ''}₦{totalBalance.toLocaleString()}
                  </div>
                </div>

                <form onSubmit={handleTransactionSubmit} className="card">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: C.textSecondary, marginBottom: '10px' }}>➕ Ƙara Mu'amala</p>
                  <input className="field" placeholder="Abin da aka yi" value={transTitle} onChange={e => setTransTitle(e.target.value)} />
                  <input className="field" type="number" placeholder="Adadin Kuɗi (₦)" value={transAmount} onChange={e => setTransAmount(e.target.value)} />
                  <select className="field" value={transType} onChange={e => setTransType(e.target.value)}>
                    <option value="income">✅ Kuɗi Ya Shigo (Income)</option>
                    <option value="expense">❌ Kuɗi Ya Fita (Expense)</option>
                  </select>
                  <input className="field" type="date" value={transDate} onChange={e => setTransDate(e.target.value)} />
                  <input className="field" placeholder="Karin bayani" value={transDesc} onChange={e => setTransDesc(e.target.value)} />
                  <button className="btn-primary" type="submit" style={{ marginTop: '8px' }}>Ajiye Bayani</button>
                </form>

                <div className="divider" />
                {filterBySearch(transactions).map(t => (
                  <div key={t.id} className="media-card" style={{ borderLeft: `3px solid ${t.type === 'income' ? C.green : C.red}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{t.title}</span>
                      <span style={{ fontWeight: '700', color: t.type === 'income' ? C.green : C.red }}>
                        {t.type === 'income' ? '+' : '-'}₦{(t.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    {(t.date || t.description) && (
                      <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '6px' }}>
                        {t.date && `📅 ${t.date}`}{t.description && ` · 📝 ${t.description}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── LOGOUT ── */}
            <div style={{ marginTop: '28px' }}>
              <button className="btn-danger" onClick={() => { signOut(auth); nav('dashboard'); }}>
                Fita (Logout)
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default App;
