import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. 추가

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 추가
  ],
  server: {
	port: 5173,        // 8888에서 5173으로 변경하세요!
	strictPort: true,    
	allowedHosts: true // 모든 호스트 접속 허용 (개발 단계에서 편리함)
  }
})