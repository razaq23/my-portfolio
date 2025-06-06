import { defineConfig } from 'vite'; // ✅ Import this!
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/my-portfolio/', // ✅ Your GitHub repo name
  plugins: [react()],
});
