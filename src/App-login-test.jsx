import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { BodyPartProvider } from './context/BodyPartContext-simple';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gym Growth</h1>
          <p className="text-gray-600">Test Login Page</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="test@example.com"
            />
          </div>
          
          <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Test Button
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">✅ Contexts Loading Test</p>
          <p className="text-green-600 text-sm">Theme + User + BodyPart Providers working</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <BodyPartProvider>
          <SimpleLogin />
        </BodyPartProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;