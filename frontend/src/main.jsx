import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./context/AuthContext.jsx"
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './lib/queryClient.js'
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools"
console.log("MAIN UPDATED 123");

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <App />
    {/* <ReactQueryDevtoolsPanel initialIsOpen = {false}/> */}
    </ QueryClientProvider>
   </ AuthProvider>
  </StrictMode>,
)
