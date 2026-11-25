import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { verifyAdminLogin } from '../app/actions/adminLoginAction';
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle, Unlock } from 'lucide-react';

const AdminPanel = dynamic(() => import('./AdminPanel').then(mod => mod.AdminPanel), { ssr: false });
import { creatorPhotoBase64 } from "../assets/creatorAsset";

export const AdminGate = (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('saqib_admin_auth') === 'true' : false;
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyAdminLogin(enteredPin.trim());
    
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('saqib_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (isAuthenticated) {
    return <AdminPanel {...props} />;
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#131915] border border-white/10 rounded-3xl p-7 shadow-2xl text-center relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A859] via-amber-400 to-[#84142D]" />
        
        {/* Admin Avatar Frame */}
        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="w-20 h-20 rounded-full ring-4 ring-[#00A859]/40 overflow-hidden mx-auto shadow-md">
            <img
              src={creatorPhotoBase64}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#00A859] text-white p-1.5 rounded-full ring-2 ring-[#131915] shadow-md flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A859]/20 border border-[#00A859]/40 text-[#4ADE80] text-[11px] font-extrabold mb-2 tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          System Admin Portal
        </div>

        <h2 className="text-xl font-extrabold tracking-tight">Security Verification</h2>
        <p className="text-xs text-gray-400 mt-1 mb-6">
          Enter master admin PIN to manage users, plans, coupons, quotas, broadcast banner, and engines.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN"
              autoFocus
              className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-center text-sm font-mono tracking-widest text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                pinError
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-white/20 focus:ring-[#00A859] focus:border-transparent'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {pinError && (
            <p className="text-xs font-semibold text-rose-400 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Incorrect Admin PIN.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00A859] to-[#007F43] hover:from-[#00BA63] hover:to-[#008F4C] text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
          <span>Powered by System</span>
          {props.onClose && (
            <button
              type="button"
              onClick={props.onClose}
              className="text-gray-400 hover:text-white underline cursor-pointer"
            >
              Return to Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

