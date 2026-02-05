import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TiMax - Video und Audio Transkription'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Accent line at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #C19A6B 0%, #D4AF7A 50%, #C19A6B 100%)',
          }}
        />

        {/* Logo/Brand name */}
        <div
          style={{
            color: '#C19A6B',
            fontFamily: 'serif',
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '-2px',
            marginBottom: 24,
          }}
        >
          timax
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 42,
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
            fontWeight: 400,
          }}
        >
          Transformiere Videos und Audios in kraftvolle Texte
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#888888',
            fontSize: 28,
            marginTop: 24,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          KI-gestützte Transkription & Textgenerierung
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#C19A6B',
            }}
          />
          <div
            style={{
              color: '#666666',
              fontSize: 20,
            }}
          >
            timax.xyz
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
