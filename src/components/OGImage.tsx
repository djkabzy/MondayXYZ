"use client";

import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export default function OGImage() {
  useEffect(() => {
    try {
      // Generate static markup for OG image
      const markup = renderToStaticMarkup(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0000FF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 40%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, rgba(37, 99, 235, 0.2), transparent)',
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 120,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                color: 'white',
                marginBottom: 40,
              }}
            >
              M<span style={{ fontSize: 80, margin: '0 20px' }}>💰</span>NDAY
            </div>

            {/* .xyz Extension */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: '#F2A900',
                letterSpacing: '0.1em',
              }}
            >
              .XYZ
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.8)',
                marginTop: 40,
                letterSpacing: '0.2em',
              }}
            >
              TRADE • CONVERT • NEWS
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 75% 75%, rgba(242,169,0,0.1) 0%, transparent 40%)',
            }}
          />
        </div>
      ));

      // Use the markup as needed
      console.log('Generated OG image markup:', markup);
    } catch (error) {
      console.error(`Failed to generate OG image: ${error}`);
    }
  }, []);

  return null;
}
