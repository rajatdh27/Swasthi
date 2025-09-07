import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '48px', margin: '20px 0' }}>🎉</h1>
        <h2>Gym Growth PWA</h2>
        <p style={{ fontSize: '24px', color: '#FFD700' }}>✅ REACT IS WORKING!</p>
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '20px',
          borderRadius: '10px',
          margin: '20px 0'
        }}>
          <p>Server: http://localhost:5173/</p>
          <p>Status: Online and Running</p>
        </div>
        <p>If you see this, React is successfully rendering!</p>
      </div>
    </div>
  );
}

export default App;