import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- GLOBAL CSS & ANIMATIONS ---
const globalCss = `
  body, html, #root {
    margin: 0; padding: 0; width: 100%; height: 100%;
    background-color: #000000; overflow-x: hidden;
  }
  
  /* Neon Pulse Animation for Button */
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(0, 255, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
  }
  .pulse-btn { animation: pulse 2s infinite; }

  /* Text Glow Animation */
  .glow-text { animation: glow 2s infinite alternate; }
  @keyframes glow {
    from { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
    to { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
  }
`;

// --- STYLES ---
const styles = {
  container: {
    minHeight: '100vh', width: '100%',
    background: 'linear-gradient(135deg, #050505, #1a1a1a)',
    color: '#00ff00', fontFamily: 'monospace',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '20px', boxSizing: 'border-box'
  },
  card: {
    background: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #333', borderRadius: '15px',
    padding: '25px', width: '100%', maxWidth: '400px',
    textAlign: 'center', boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)'
  },
  input: {
    background: '#000', border: '1px solid #444', color: '#FFD700',
    textAlign: 'center', fontSize: '1.5rem', width: '100%',
    padding: '10px', borderRadius: '5px', fontWeight: 'bold', letterSpacing: '3px'
  },
  btn: {
    background: 'linear-gradient(90deg, #00cc00, #006600)',
    border: 'none', color: 'white', fontWeight: 'bold',
    letterSpacing: '2px', marginTop: '15px', width: '100%',
    padding: '15px', borderRadius: '50px', cursor: 'pointer'
  },
  ball: {
    width: '70px', height: '70px',
    background: '#111', border: '2px solid #FFD700', color: '#FFD700',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 0 15px #FFD700'
  }
};

function App() {
  const [session, setSession] = useState('morning'); // 'morning' or 'evening'
  const [modern, setModern] = useState('');
  const [internet, setInternet] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Live Data States
  const [liveSet, setLiveSet] = useState("0.00");
  const [liveValue, setLiveValue] = useState("0.00");
  const [liveStatus, setLiveStatus] = useState("CONNECTING...");

  // --- 1. LIVE DATA FETCHING (PIPEDREAM) ---
  const fetchLiveData = async () => {
    try {
      // Pipedream URL (RapidAPI Data)
      const response = await fetch('https://eo3badgrms5p4o6.m.pipedream.net'); 
      const data = await response.json();
      
      if (data) {
        // Pipedream မှ data များကို ရယူခြင်း
        const setVal = data.set_index || "0.00";
        const valVal = data.value || "0.00";
        
        setLiveSet(setVal);
        setLiveValue(valVal);
        setLiveStatus("MARKET OPEN • LIVE DATA");
      }
    } catch (error) {
      console.error("Live Data Error:", error);
      setLiveStatus("OFFLINE MODE • MANUAL CALC");
    }
  };

  // 5 စက္ကန့်တစ်ခါ Data အသစ်ဆွဲမယ် (Auto Refresh)
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. ADVANCED AI LOGIC (MULTI-FORMULA) ---
  const calculatePrediction = () => {
    if (!modern || !internet || modern.length < 2 || internet.length < 2) {
      alert("ဂဏန်း ၂ လုံးစီ ပြည့်အောင် ရိုက်ထည့်ပါ (ဥပမာ: 55, 70)");
      return;
    }

    setLoading(true);
    setPrediction(null);

    // AI Analyzing Effect
    setTimeout(() => {
      const m1 = parseInt(modern[0]);
      const m2 = parseInt(modern[1]);
      const i1 = parseInt(internet[0]);
      const i2 = parseInt(internet[1]);

      // --- Logic A: Classic Sum (Main Formula) ---
      // (Modern ရှေ့ + Internet ရှေ့) -> ရှေ့
      // (Modern နောက် + Internet နောက်) -> နောက်
      const keyA_Front = (m1 + i1) % 10;
      const keyA_Back = (m2 + i2) % 10;
      const resA = `${keyA_Front}${keyA_Back}`;

      // --- Logic B: Cross Flow (Backup) ---
      // Modern ရှေ့ + Internet နောက် = ရှေ့
      // Internet ရှေ့ + Modern နောက် = နောက်
      const keyB_Front = (m1 + i2) % 10;
      const keyB_Back = (i1 + m2) % 10;
      const resB = `${keyB_Front}${keyB_Back}`;

      // --- Logic C: Power & Diff (Lucky) ---
      // Modern ပေါင်းလဒ်၏ Power (Rx + 5)
      const sumModern = (m1 + m2) % 10;
      const powerKey = (sumModern + 5) % 10; 
      // Internet ခြားနားချက်
      const diffInternet = Math.abs(i1 - i2);
      const keyC = `${powerKey}${diffInternet}`;

      setPrediction({ main: resA, backup: resB, lucky: keyC });
      setLoading(false);
    }, 2000); // 2 seconds thinking time
  };

  return (
    <>
      <style>{globalCss}</style>

      <div style={styles.container}>
        
        {/* Header & Live Data Section */}
        <div style={{marginBottom: '20px', textAlign: 'center', width: '100%'}}>
          <h1 className="glow-text" style={{fontWeight: '900', letterSpacing: '2px', fontSize: '2rem', margin: 0}}>
            AI 2D MASTER
          </h1>
          
          {/* Live Data Card */}
          <div style={{marginTop: '15px', padding: '15px', background: '#111', border: '1px solid #333', borderRadius: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
               <small style={{color: '#888', fontSize: '0.7rem'}}>STATUS: <span style={{color: '#00ff00'}}>{liveStatus}</span></small>
               <div className="spinner-grow text-success" role="status" style={{width: '10px', height: '10px'}}></div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '10px'}}>
              <div>
                <span style={{color: '#555', fontSize: '0.7rem', display: 'block'}}>SET INDEX</span>
                <span style={{color: '#00ff00', fontWeight: 'bold', fontSize: '1.2rem'}}>{liveSet}</span>
              </div>
              <div style={{borderLeft: '1px solid #333'}}></div>
              <div>
                <span style={{color: '#555', fontSize: '0.7rem', display: 'block'}}>VALUE</span>
                <span style={{color: '#00ff00', fontWeight: 'bold', fontSize: '1.2rem'}}>{liveValue}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          
          {/* Session Switcher */}
          <div className="d-flex mb-4 bg-dark rounded-pill p-1 border border-secondary">
            <button 
              className="btn flex-fill rounded-pill"
              style={{background: session==='morning'?'#FFD700':'transparent', color: session==='morning'?'black':'gray', fontWeight: 'bold', transition: '0.3s'}}
              onClick={() => { setSession('morning'); setPrediction(null); }}
            >
              ☀️ 12:01 PM
            </button>
            <button 
              className="btn flex-fill rounded-pill"
              style={{background: session==='evening'?'#FFD700':'transparent', color: session==='evening'?'black':'gray', fontWeight: 'bold', transition: '0.3s'}}
              onClick={() => { setSession('evening'); setPrediction(null); }}
            >
              🌙 4:30 PM
            </button>
          </div>

          {/* Inputs */}
          <div style={{marginBottom: '15px', textAlign: 'left'}}>
            <label style={{color: '#888', fontSize: '0.7rem', marginBottom: '5px', display: 'block'}}>
              MODERN ({session === 'morning' ? '9:30 AM' : '2:00 PM'})
            </label>
            <input type="number" style={styles.input} placeholder="00" 
                   value={modern} onChange={(e) => setModern(e.target.value)} />
          </div>

          <div style={{marginBottom: '15px', textAlign: 'left'}}>
            <label style={{color: '#888', fontSize: '0.7rem', marginBottom: '5px', display: 'block'}}>
              INTERNET ({session === 'morning' ? '9:30 AM' : '2:00 PM'})
            </label>
            <input type="number" style={styles.input} placeholder="00" 
                   value={internet} onChange={(e) => setInternet(e.target.value)} />
          </div>

          {/* Calculate Button */}
          <button className="pulse-btn" style={styles.btn} onClick={calculatePrediction}>
            {loading ? "AI ANALYZING PATTERNS..." : "CALCULATE RESULT"}
          </button>

          {/* Prediction Results */}
          {prediction && (
            <div style={{marginTop: '25px', borderTop: '1px dashed #333', paddingTop: '20px', animation: 'fadeIn 0.5s'}}>
              <p style={{color: '#FFD700', fontSize: '0.8rem', marginBottom: '10px'}}>HIGH PROBABILITY</p>
              <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                <div style={styles.ball}>{prediction.main}</div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 10px'}}>
                <div style={{textAlign: 'center'}}>
                  <small style={{color: '#555', fontSize: '0.7rem', display:'block', marginBottom:'5px'}}>BACKUP</small>
                  <div style={{...styles.ball, width: '50px', height: '50px', fontSize: '1.2rem', borderColor: '#333', color: '#aaa', boxShadow: 'none', margin: '0 auto'}}>{prediction.backup}</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <small style={{color: '#555', fontSize: '0.7rem', display:'block', marginBottom:'5px'}}>LUCKY</small>
                  <div style={{...styles.ball, width: '50px', height: '50px', fontSize: '1.2rem', borderColor: '#333', color: '#aaa', boxShadow: 'none', margin: '0 auto'}}>{prediction.lucky}</div>
                </div>
              </div>
            </div>
          )}

        </div>
        
        <div style={{marginTop: '30px', opacity: 0.5, fontSize: '0.6rem', color: '#444'}}>
          POWERED BY NEURAL NETWORK v5.0
        </div>
      </div>
    </>
  );
}

export default App;



