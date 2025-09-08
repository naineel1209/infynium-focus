import React, { useState, useEffect } from 'react';
import { SHA256 } from 'crypto-js';

interface PinComponentProps {
  onUnlock: () => void;
}

const PinComponent: React.FC<PinComponentProps> = ({ onUnlock }) => {
  const [mode, setMode] = useState<'setup' | 'entry'>('entry');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedPin = localStorage.getItem('app_pin');
    if (!storedPin) {
      setMode('setup');
    }
  }, []);

  // Auto-submit when PIN is complete in login mode
  useEffect(() => {
    if (mode === 'entry' && pin.length === 4) {
      const timeoutId = setTimeout(() => {
        handleLogin();
      }, 200); // Small delay for better UX
      return () => clearTimeout(timeoutId);
    }
  }, [pin, mode]);

  // Auto-submit when both PINs are complete in setup mode
  useEffect(() => {
    if (mode === 'setup' && pin.length === 4 && confirmPin.length === 4) {
      const timeoutId = setTimeout(() => {
        handleSetup();
      }, 200); // Small delay for better UX
      return () => clearTimeout(timeoutId);
    }
  }, [pin, confirmPin, mode]);

  const handleSetup = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    const hashedPin = SHA256(pin).toString();
    localStorage.setItem('app_pin', hashedPin);
    setError('');
    onUnlock();
  };

  const handleLogin = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    const storedPin = localStorage.getItem('app_pin');
    const hashedPin = SHA256(pin).toString();
    if (hashedPin === storedPin) {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-emerald-100">
        {/* Header with App Branding */}
        <div className="text-center mb-8">
          <div className="bg-emerald-600 text-white text-2xl font-bold py-3 px-6 rounded-xl shadow-lg mb-4 mx-auto w-fit">
            🔒 InfySec
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {mode === 'setup' ? 'Set Your PIN' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-sm">
            {mode === 'setup'
              ? 'Create a secure 4-digit PIN to protect your focus sessions'
              : 'Enter your PIN to access InfyBlock & InfyDoro'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* PIN Input */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {mode === 'setup' ? 'Create PIN' : 'Enter PIN'}
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="••••"
              className="w-full p-4 text-center text-2xl font-mono tracking-widest border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              maxLength={4}
            />
          </div>

          {mode === 'setup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder="••••"
                className="w-full p-4 text-center text-2xl font-mono tracking-widest border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={mode === 'setup' ? handleSetup : handleLogin}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 transform hover:scale-[1.02] transition-all duration-200"
          >
            {mode === 'setup'
              ? '🛡️ Create Security PIN'
              : '🚀 Access Dashboard'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {mode === 'setup'
              ? 'Your PIN will be securely encrypted and stored locally'
              : 'Stay focused with InfyBlock & InfyDoro'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinComponent;
