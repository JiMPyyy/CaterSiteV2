'use client';           // 👈  **MUST be the first line**

import React from 'react';

export default function Login() {
  const vegasBackground =
    'https://images.pexels.com/photos/450054/pexels-photo-450054.jpeg?cs=srgb&dl=pexels-tirachard-kumtanom-112571-450054.jpg&fm=jpg'; // royalty-free Vegas image

  return (
    <div
      /* full-screen Vegas backdrop */
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${vegasBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f2937', // fallback grey
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          Welcome to CaterVegas 🎲
        </h2>

        <form style={{ display: 'grid', gap: '1.25rem' }}>
          <label>
            <span style={{ fontSize: '.875rem', fontWeight: 500 }}>Username</span>
            <input
              type="text"
              name="username"
              required
              style={{
                width: '100%',
                marginTop: '.25rem',
                padding: '.6rem 1rem',
                borderRadius: '.75rem',
                border: '1px solid #d1d5db',
              }}
              placeholder="Enter your username"
            />
          </label>

          <label>
            <span style={{ fontSize: '.875rem', fontWeight: 500 }}>Password</span>
            <input
              type="password"
              name="password"
              required
              style={{
                width: '100%',
                marginTop: '.25rem',
                padding: '.6rem 1rem',
                borderRadius: '.75rem',
                border: '1px solid #d1d5db',
              }}
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '.6rem 1rem',
              fontWeight: 600,
              borderRadius: '.75rem',
              background: '#facc15',
              color: '#000',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#fbbf24')}
            onMouseOut={e => (e.currentTarget.style.background = '#facc15')}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
