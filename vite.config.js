import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포를 위한 설정
export default defineConfig({
  plugins: [react()],
  // GitHub Pages의 저장소 경로 설정 (/{repo-name}/ 형식)
  base: '/number-baseball/',
})
