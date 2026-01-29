import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   base: MODE === 'development' ? '/' : '/wall-openings/',
// })

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base: isProduction  ? '/wall-openings' : '/'
  }
});
