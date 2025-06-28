
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [language, setLanguage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState('');
  const [data, setData] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data.json').then(res => res.json()).then(setData);
  }, []);

  const handleLogin = () => {
    if (name && branch && language) {
      setLoggedIn(true);
    }
  };

  const handleSearch = () => {
    const entry = data.find(e => e.ACCOUNT === account);
    if (!entry) return setError('Account not found');
    const sameCIF = data.filter(e => e.CIF_ID === entry.CIF_ID);
    const maxPct = Math.max(...sameCIF.map(e => e.PERCENTAGE));
    const minSettle = (Math.abs(entry.PRINCIPAL_AMOUNT) * maxPct) / 100;
    const others = sameCIF.filter(e => e.ACCOUNT !== account).map(e => e.ACCOUNT);
    setResult({ ...entry, maxPct, minSettle, others });
    setError('');
  };

  const goBack = () => {
    setResult(null);
    setAccount('');
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 20, fontFamily: 'Arial' }}>
        <h2>OTS Settlement App Login</h2>
        <input placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} style={{ margin: 5, padding: 10 }} />
        <br />
        <input placeholder="Enter Branch" value={branch} onChange={e => setBranch(e.target.value)} style={{ margin: 5, padding: 10 }} />
        <br />
        <select value={language} onChange={e => setLanguage(e.target.value)} style={{ margin: 5, padding: 10 }}>
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <br />
        <button onClick={handleLogin} style={{ padding: 10 }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      {!result ? (
        <>
          <h2>Search Account</h2>
          <input
            placeholder="Enter Account Number"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            style={{ padding: 10 }}
          />
          <button onClick={handleSearch} style={{ marginLeft: 10, padding: 10 }}>Search</button>
          <button onClick={() => setLoggedIn(false)} style={{ marginLeft: 10, padding: 10 }}>Back</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      ) : (
        <>
          <h3>OTS Details</h3>
          <p><b>Borrower Name:</b> {result.NAME}</p>
          <p><b>CIF ID:</b> {result.CIF_ID}</p>
          <p><b>Number of Accounts:</b> {result.NO_OF_ACCOUNTS}</p>
          <p><b>Other Accounts:</b> {result.others.join(', ') || 'None'}</p>
          <p><b>CIF Current Balance:</b> ₹{result.CIF_BALANCE}</p>
          <p><b>CIF Principal Amount:</b> ₹{result.PRINCIPAL_AMOUNT}</p>
          <p><b>Minimum Settlement Amount:</b> ₹{result.minSettle.toFixed(2)} (based on {result.maxPct}%)</p>
          <p><b>Entry Date:</b> {result.NPA_DATE}</p>
          <button onClick={goBack} style={{ padding: 10 }}>Back</button>
        </>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
