"use client";

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFF8F8', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <style>{`
        @keyframes custom-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes custom-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
      <div style={{ 
        width: '64px', 
        height: '64px', 
        borderRadius: '50%', 
        border: '4px solid rgba(132, 20, 45, 0.2)', 
        borderTopColor: '#84142D', 
        animation: 'custom-spin 1s linear infinite',
        marginBottom: '16px'
      }}></div>
      <span style={{ 
        color: '#84142D', 
        fontWeight: 'bold', 
        fontSize: '14px',
        animation: 'custom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        Loading System...
      </span>
    </div>
  )
});

export default function Home() {
  return <App />;
}
