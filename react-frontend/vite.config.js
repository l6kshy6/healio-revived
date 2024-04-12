import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import http from "https";

// https://vitejs.dev/config/
export default defineConfig({
  // server:{
  //   proxy:{
  //     '/test':{
  //     target: 'http://localhost:5000',
  //     changeOrigin:true,
  //     secure:false,
  //   }
  //   }
  // },
  plugins: [react()],
})
