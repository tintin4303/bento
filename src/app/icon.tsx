import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F43F5E',
          borderRadius: '12px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589c-.26 0-.52.025-.776.073a5 5 0 0 0-9.634 0c-.256-.048-.516-.073-.776-.073a4 4 0 0 0-2.134 7.589c.411.197.727.584.727 1.041V20a1 1 0 0 0 1 1Z"/>
          <path d="M6 17h12"/>
        </svg>
      </div>
    ),
    { ...size }
  )
}
