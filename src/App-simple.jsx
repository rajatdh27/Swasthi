import { useState } from 'react';

function SimpleApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Simple Test App</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h2>Test Status: ✅ WORKING</h2>
        <p>Server is running at: http://localhost:5173/</p>
      </div>
    </div>
  );
}

export default SimpleApp;