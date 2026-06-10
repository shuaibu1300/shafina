import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Lambobin sirri na Firebase
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

// Adsterra Ad Component
const AdBanner = () => {
  const bannerRef = useRef(null);
  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerText = `
        atOptions = {
          'key' : '34ff23d0cccf8ab433c8f1526824df48',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/34ff23d0cccf8ab433c8f1526824df48/invoke.js';
      bannerRef.current.appendChild(conf);
      bannerRef.current.appendChild(script);
    }
  }, []);
  return <div style={{ width: '100%', maxWidth: '468px', height: '60px', backgroundColor: '#f0f0f0', margin: '10px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} ref={bannerRef}></div>;
};

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPassword, setUploadPassword] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // MEDIA STATES
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaTitle, setMediaTitle] = useState('');

  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [audios, setAudios] = useState([]);
  const [images, setImages] = useState([]);

  // ATTENDANCE STATES
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [stdName, setStdName] = useState('');
  const [stdAge, setStdAge] = useState('');
  const [stdDate, setStdDate] = useState('');
  const [stdTime, setStdTime] = useState('');
  const [stdDesc, setStdDesc] = useState('');

  // SCHOOL MANAGEMENT STATES
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

  // EXPENSE TRACKER STATES
  const [transactions, setTransactions] = useState([]);
  const [transTitle, setTransTitle] = useState('');
  const [transAmount, setTransAmount] = useState('');
  const [transType, setTransType] = useState('income');
  const [transDate, setTransDate] = useState('');
  const [transDesc, setTransDesc] = useState('');

  const UPLOAD_SECRET_PASSWORD = "shafina2026"; 

  // Realtime Database Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });

    const qVideos = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubVideos = onSnapshot(qVideos, (snapshot) => setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qPdfs = query(collection(db, "pdfs"), orderBy("createdAt", "desc"));
    const unsubPdfs = onSnapshot(qPdfs, (snapshot) => setPdfs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qAudios = query(collection(db, "audios"), orderBy("createdAt", "desc"));
    const unsubAudios = onSnapshot(qAudios, (snapshot) => setAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qImages = query(collection(db, "images"), orderBy("createdAt", "desc"));
    const unsubImages = onSnapshot(qImages, (snapshot) => setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const unsubClasses = onSnapshot(collection(db, "classes"), (snapshot) => {
      const cls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(cls);
      if(cls.length > 0 && !selectedClassId) setSelectedClassId(cls.id);
    });

    const unsubStudents = onSnapshot(collection(db, "students"), (snapshot) => setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const unsubSchClasses = onSnapshot(collection(db, "school_classes"), (snapshot) => {
      const sCls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchoolClasses(sCls);
      if(sCls.length > 0 && !selectedSchoolClassId) setSelectedSchoolClassId(sCls.id);
    });

    const unsubSchStudents = onSnapshot(collection(db, "school_students"), (snapshot) => setSchoolStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qTrans = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsubTrans = onSnapshot(qTrans, (snapshot) => setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => {
      unsubscribeAuth(); unsubVideos(); unsubPdfs(); unsubAudios(); unsubImages();
      unsubClasses(); unsubStudents(); unsubSchClasses(); unsubSchStudents(); unsubTrans();
    };
  }, [selectedClassId, selectedSchoolClassId]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert("Don Allah cika duka akwatunan!"); return; }
    try {
      if (isLogin) { await signInWithEmailAndPassword(auth, email, password); alert("Ka shiga cikin nasara!"); }
      else { await createUserWithEmailAndPassword(auth, email, password); alert("An ƙirƙiri asusu cikin nasara!"); setIsLogin(true); }
    } catch (error) { alert("Kuskure ya faru: " + error.message); }
  };

  // INGANTACCEN TSARIN UPLOAD NA CLOUDINARY
  const handleStoreUpload = (e, folderName, collectionName) => {
    e.preventDefault();
    if (uploadPassword !== UPLOAD_SECRET_PASSWORD) { alert("Kuskure: Password na Upload ba daidai ba ne!"); return; }
    if (!selectedFile || !mediaTitle) { alert("Don Allah zaɓi fayil sannan ka saka suna!"); return; }

    setIsUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "shafina_preset"); 

    // Lissafin lodi daga 0% zuwa 100% daidai
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const downloadURL = data.secure_url;

          // Adana a Firebase Firestore
          await addDoc(collection(db, collectionName), {
            title: mediaTitle,
            url: downloadURL,
            createdAt: new Date()
          });

          setIsUploading(false); setUploadProgress(0); setSelectedFile(null); setMediaTitle(''); setUploadPassword('');
          alert("An adana fayil ɗinka a ma'ajiyar Cloudinary cikin nasara!");
        } catch (error) {
          alert("Error: An samu matsala wajen karanta amsar server.");
          setIsUploading(false); setUploadProgress(0);
        }
      } else {
        alert("Upload Error: Cloudinary server response failed");
        setIsUploading(false); setUploadProgress(0);
      }
    });

    xhr.addEventListener('error', () => {
      alert("Upload Failed: Duba hadin intanet dinka!");
      setIsUploading(false); setUploadProgress(0);
    });

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/djzaxvlus/upload', true);
    xhr.send(formData);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if(!selectedClassId || !stdName) return alert("Cika sunan ɗalibi da aji!");
    await addDoc(collection(db, "students"), { classId: selectedClassId, name: stdName, age: stdAge, date: stdDate, time: stdTime, description: stdDesc, status: 'Present' });
    setStdName(''); setStdAge(''); setStdDate(''); setStdTime(''); setStdDesc(''); alert("An ajiye halartar ɗalibi!");
  };

  const handleSchSubmit = async (e) => {
    e.preventDefault();
    if(!selectedSchoolClassId || !schName) return alert("Cika sunan ɗalibi!");
    await addDoc(collection(db, "school_students"), { classId: selectedSchoolClassId, name: schName, age: schAge, date: schDate, term: schTerm, amount: parseFloat(schAmount)||0, description: schDesc });
    setSchName(''); setSchAge(''); setSchDate(''); setSchAmount(''); setSchDesc(''); alert("An adana bayanin kuɗin makaranta!");
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "transactions"), { title: transTitle, amount: parseFloat(transAmount)||0, type: transType, date: transDate, description: transDesc });
    setTransTitle(''); setTransAmount(''); setTransDate(''); setTransDesc(''); alert("An ƙara bayanin kuɗi!");
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const dashboardItems = [
    { name: 'Video', icon: '▶️' }, { name: 'PDF', icon: '📄' }, { name: 'Image', icon: '🖼️' },
    { name: 'Audio', icon: '🎵' }, { name: 'Attendance', icon: '📅' }, { name: 'School Management', icon: '🏫' },
    { name: 'Expensive', icon: '💰' }
  ];

  const styles = {
    container: { backgroundColor: '#1a202c', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '10px' },
    card: { backgroundColor: '#2d3748', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '468px', textAlign: 'center', margin: '15px auto' },
    input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '4px', border: '1px solid #4a5568', backgroundColor: '#1a202c', color: '#fff', boxSizing: 'border-box' },
    searchBar: { width: '90%', maxWidth: '468px', padding: '12px', margin: '10px auto', borderRadius: '6px', border: '1px solid #4a5568', backgroundColor: '#2d3748', color: '#fff', display: 'block' },
    button: { width: '100%', padding: '10px', backgroundColor: '#319795', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '90%', maxWidth: '468px', marginTop: '10px' },
    gridBtn: { padding: '20px 10px', backgroundColor: '#2d3748', border: '1px solid #4a5568', color: '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    vCard: { backgroundColor: '#2d3748', borderRadius: '8px', padding: '15px', margin: '15px 0', width: '100%', boxSizing: 'border-box', textAlign: 'left' },
    progress: { backgroundColor: '#4a5568', borderRadius: '4px', overflow: 'hidden', margin: '10px 0', height: '10px' }
  };

  return (
    <div style={styles.container}>
      <div style={{ fontSize: '26px', fontWeight: 'bold', padding: '10px' }}>Shafina Platform</div>
      <AdBanner />

      {!user ? (
        <div style={styles.card}>
          <h2>{isLogin ? 'Shiga (Login)' : 'Ƙirƙiri Asusu'}</h2>
          <form onSubmit={handleAuth}>
            <input style={styles.input} type="email" placeholder="Saka Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Saka Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button style={styles.button} type="submit">{isLogin ? 'Shiga' : 'Yi Rajista'}</button>
          </form>
          <div style={{ color: '#4fd1c5', marginTop: '15px', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Ba ka da asusu? Ƙirƙiri sabo" : "Kuna da asusu? Shiga"}
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '90%', maxWidth: '468px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#a0aec0' }}>
            <span>📧 {user.email}</span>
            {currentScreen !== 'dashboard' && <button style={{ backgroundColor: '#4a5568', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setCurrentScreen('dashboard')}>⬅️ Menun Baya</button>}
          </div>

          <input type="text" placeholder="Nemo rubutu a nan..." style={styles.searchBar} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          {currentScreen === 'dashboard' && (
            <div style={styles.grid}>
              {dashboardItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <button key={item.name} style={styles.gridBtn} onClick={() => setCurrentScreen(item.name.toLowerCase())}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <span style={{ fontWeight: 'bold' }}>{item.name === 'Expensive' ? 'Expense Tracker' : item.name}</span>
                </button>
              ))}
            </div>
          )}

          {currentScreen === 'video' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>▶️ Sashin Bidiyo (Videos Folder)</h3>
              <form onSubmit={(e) => handleStoreUpload(e, 'videos', 'videos')} style={styles.vCard}>
                <input style={styles.input} placeholder="Sunan Bidiyo" value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} />
                <input style={{ ...styles.input, backgroundColor: 'transparent' }} type="file" accept="video/*" onChange={e => setSelectedFile(e.target.files)} />
                <input style={styles.input} type="password" placeholder="Upload Password" value={uploadPassword} onChange={e => setUploadPassword(e.target.value)} />
                {isUploading && (
                  <div>
                    <div style={styles.progress}><div style={{ width: `${uploadProgress}%`, backgroundColor: '#319795', height: '100%' }}></div></div>
                    <p style={{ fontSize: '12px', textAlign: 'center' }}>Ana ɗorawa: {uploadProgress}%</p>
                  </div>
                )}
                <button style={styles.button} type="submit" disabled={isUploading}>{isUploading ? 'Yana Tafiya...' : 'Ɗora Bidiyo ta Store'}</button>
              </form>
              {videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(v => (
                <div key={v.id} style={styles.vCard}>
                  <h4>{v.title}</h4>
                  <video src={v.url} controls style={{ width: '100%', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'pdf' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>📄 Sashin Littattafai (PDFs Folder)</h3>
              <form onSubmit={(e) => handleStoreUpload(e, 'pdfs', 'pdfs')} style={styles.vCard}>
                <input style={styles.input} placeholder="Sunan Littafi" value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} />
                <input style={{ ...styles.input, backgroundColor: 'transparent' }} type="file" accept="application/pdf" onChange={e => setSelectedFile(e.target.files)} />
                <input style={styles.input} type="password" placeholder="Upload Password" value={uploadPassword} onChange={e => setUploadPassword(e.target.value)} />
                {isUploading && (
                  <div>
                    <div style={styles.progress}><div style={{ width: `${uploadProgress}%`, backgroundColor: '#319795', height: '100%' }}></div></div>
                    <p style={{ fontSize: '12px', textAlign: 'center' }}>Ana ɗorawa: {uploadProgress}%</p>
                  </div>
                )}
                <button style={styles.button} type="submit" disabled={isUploading}>{isUploading ? 'Yana Tafiya...' : 'Ɗora PDF ta Store'}</button>
              </form>
              {pdfs.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <div key={p.id} style={styles.vCard}>
                  <h4>{p.title}</h4>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#4fd1c5', fontWeight: 'bold' }}>Buɗe Littafin PDF ↗️</a>
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'audio' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>🎵 Sashin Sauti (Audios Folder)</h3>
              <form onSubmit={(e) => handleStoreUpload(e, 'audios', 'audios')} style={styles.vCard}>
                <input style={styles.input} placeholder="Sunan Sauti" value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} />
                <input style={{ ...styles.input, backgroundColor: 'transparent' }} type="file" accept="audio/*" onChange={e => setSelectedFile(e.target.files)} />
                <input style={styles.input} type="password" placeholder="Upload Password" value={uploadPassword} onChange={e => setUploadPassword(e.target.value)} />
                {isUploading && (
                  <div>
                    <div style={styles.progress}><div style={{ width: `${uploadProgress}%`, backgroundColor: '#319795', height: '100%' }}></div></div>
                    <p style={{ fontSize: '12px', textAlign: 'center' }}>Ana ɗorawa: {uploadProgress}%</p>
                  </div>
                )}
                <button style={styles.button} type="submit" disabled={isUploading}>{isUploading ? 'Yana Tafiya...' : 'Ɗora Sauti ta Store'}</button>
              </form>
              {audios.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(a => (
                <div key={a.id} style={styles.vCard}>
                  <h4>{a.title}</h4>
                  <audio src={a.url} controls style={{ width: '100%' }} />
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'image' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>🖼️ Sashin Hoto (Images Folder)</h3>
              <form onSubmit={(e) => handleStoreUpload(e, 'images', 'images')} style={styles.vCard}>
                <input style={styles.input} placeholder="Sunan Hoto" value={mediaTitle} onChange={e => setMediaTitle(e.target.value)} />
                <input style={{ ...styles.input, backgroundColor: 'transparent' }} type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files)} />
                <input style={styles.input} type="password" placeholder="Upload Password" value={uploadPassword} onChange={e => setUploadPassword(e.target.value)} />
                {isUploading && (
                  <div>
                    <div style={styles.progress}><div style={{ width: `${uploadProgress}%`, backgroundColor: '#319795', height: '100%' }}></div></div>
                    <p style={{ fontSize: '12px', textAlign: 'center' }}>Ana ɗorawa: {uploadProgress}%</p>
                  </div>
                )}
                <button style={styles.button} type="submit" disabled={isUploading}>{isUploading ? 'Yana Tafiya...' : 'Ɗora Hoto ta Store'}</button>
              </form>
              {images.filter(img => img.title.toLowerCase().includes(searchQuery.toLowerCase())).map(img => (
                <div key={img.id} style={styles.vCard}>
                  <h4>{img.title}</h4>
                  <img src={img.url} alt={img.title} style={{ width: '100%', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'attendance' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>📅 Sashin Halarta (Attendance)</h3>
              <div style={styles.vCard}>
                <h4>Ƙirƙiri Aji</h4>
                <input style={styles.input} placeholder="Sunan Aji" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                <button style={styles.button} onClick={async () => { if(newClassName) { await addDoc(collection(db, "classes"), { className: newClassName }); setNewClassName(''); alert("An kirkiro aji!"); } }}>Ajiye Aji</button>
              </div>
              <form onSubmit={handleStudentSubmit} style={styles.vCard}>
                <h4>Rijistar Halartar Ɗalibi</h4>
                <select style={styles.input} value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                  <option value="">Zaɓi Aji</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                </select>
                <input style={styles.input} placeholder="Sunan Ɗalibi" value={stdName} onChange={e => setStdName(e.target.value)} />
                <input style={styles.input} placeholder="Shekaru" value={stdAge} onChange={e => setStdAge(e.target.value)} />
                <input style={styles.input} type="date" value={stdDate} onChange={e => setStdDate(e.target.value)} />
                <input style={styles.input} type="time" value={stdTime} onChange={e => setStdTime(e.target.value)} />
                <input style={styles.input} placeholder="Karin Bayani" value={stdDesc} onChange={e => setStdDesc(e.target.value)} />
                <button style={styles.button} type="submit">Ɗauki Halarta (Present)</button>
              </form>
              {students.filter(s => s.classId === selectedClassId && s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                <div key={s.id} style={styles.vCard}>
                  <h4>👤 {s.name} ({s.age} Yrs)</h4>
                  <p>📅 Rana: {s.date} - Lokaci: {s.time}</p>
                  <p>📝 Bayani: {s.description}</p>
                  <span style={{ padding: '4px 8px', backgroundColor: '#38a169', borderRadius: '4px', fontSize: '12px' }}>{s.status}</span>
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'school management' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>🏫 School Management System</h3>
              <div style={styles.vCard}>
                <h4>Ƙirƙiri Ajin Makaranta</h4>
                <input style={styles.input} placeholder="Misali: Primary 1" value={newSchoolClassName} onChange={e => setNewSchoolClassName(e.target.value)} />
                <button style={styles.button} onClick={async () => { if(newSchoolClassName) { await addDoc(collection(db, "school_classes"), { className: newSchoolClassName }); setNewSchoolClassName(''); alert("An kaddamar da aji!"); } }}>Kaddamar da Aji</button>
              </div>
              <form onSubmit={handleSchSubmit} style={styles.vCard}>
                <h4>Biyan Kuɗaɗen Makaranta</h4>
                <select style={styles.input} value={selectedSchoolClassId} onChange={e => setSelectedSchoolClassId(e.target.value)}>
                  <option value="">Zaɓi Ajin Makaranta</option>
                  {schoolClasses.map(sc => <option key={sc.id} value={sc.id}>{sc.className}</option>)}
                </select>
                <input style={styles.input} placeholder="Sunan Ɗalibi" value={schName} onChange={e => setSchName(e.target.value)} />
                <input style={styles.input} placeholder="Shekaru" value={schAge} onChange={e => setSchAge(e.target.value)} />
                <input style={styles.input} type="date" value={schDate} onChange={e => setSchDate(e.target.value)} />
                <select style={styles.input} value={schTerm} onChange={e => setSchTerm(e.target.value)}>
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
                <input style={styles.input} type="number" placeholder="Adadin Kuɗi (₦)" value={schAmount} onChange={e => setSchAmount(e.target.value)} />
                <input style={styles.input} placeholder="Karin bayani" value={schDesc} onChange={e => setSchDesc(e.target.value)} />
                <button style={styles.button} type="submit">Adana Biyan Kuɗi</button>
              </form>
              {schoolStudents.filter(ss => ss.classId === selectedSchoolClassId && ss.name.toLowerCase().includes(searchQuery.toLowerCase())).map(ss => (
                <div key={ss.id} style={styles.vCard}>
                  <h4>🎓 {ss.name} ({ss.age} Yrs)</h4>
                  <p>💰 Adadin Kuɗi: ₦{ss.amount.toLocaleString()}</p>
                  <p>📅 Zango: {ss.term} ({ss.date})</p>
                  <p>📝 Bayani: {ss.description}</p>
                </div>
              ))}
            </div>
          )}

          {currentScreen === 'expensive' && (
            <div style={{ width: '90%', maxWidth: '468px' }}>
              <h3>💰 Expense Tracker</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#234e52', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ color: '#a3e635', fontSize: '13px' }}>Income</span>
                  <h4 style={{ margin: '5px 0 0 0' }}>₦{totalIncome.toLocaleString()}</h4>
                </div>
                <div style={{ backgroundColor: '#742a2a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ color: '#fca5a5', fontSize: '13px' }}>Expense</span>
                  <h4 style={{ margin: '5px 0 0 0' }}>₦{totalExpense.toLocaleString()}</h4>
                </div>
              </div>
              <div style={{ backgroundColor: totalBalance >= 0 ? '#2b6cb0' : '#9b2c2c', padding: '10px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
                Balance: ₦{totalBalance.toLocaleString()}
              </div>
              <form onSubmit={handleTransactionSubmit} style={styles.vCard}>
                <h4>Ƙara Mu'amalar Kuɗi</h4>
                <input style={styles.input} placeholder="Abin da aka yi" value={transTitle} onChange={e => setTransTitle(e.target.value)} />
                <input style={styles.input} type="number" placeholder="Adadin Kuɗi (₦)" value={transAmount} onChange={e => setTransAmount(e.target.value)} />
                <select style={styles.input} value={transType} onChange={e => setTransType(e.target.value)}>
                  <option value="income">Kuɗi Ya Shigo (Income ✅)</option>
                  <option value="expense">Kuɗi Ya Fita (Expense ❌)</option>
                </select>
                <input style={styles.input} type="date" value={transDate} onChange={e => setTransDate(e.target.value)} />
                <input style={styles.input} placeholder="Karin bayani" value={transDesc} onChange={e => setTransDesc(e.target.value)} />
                <button style={styles.button} type="submit">Ajiye Bayani</button>
              </form>
              {transactions.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                <div key={t.id} style={{ ...styles.vCard, borderLeft: t.type === 'income' ? '5px solid #48bb78' : '5px solid #f56565' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>{t.title}</h4>
                    <span style={{ fontWeight: 'bold', color: t.type === 'income' ? '#48bb78' : '#f56565' }}>{t.type === 'income' ? '+' : '-'} ₦{t.amount.toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#a0aec0' }}>📅 {t.date} {t.description && `| 📝 ${t.description}`}</p>
                </div>
              ))}
            </div>
          )}

          <button style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }} onClick={() => { auth.signOut(); setCurrentScreen('dashboard'); }}>Fita (Logout)</button>
        </div>
      )}
    </div>
  );
}

export default App;
