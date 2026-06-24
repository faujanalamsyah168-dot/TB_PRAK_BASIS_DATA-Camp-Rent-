// ============================================================
// INDEX.JS - ENTRY POINT APLIKASI
// ============================================================
// File ini merupakan titik masuk (entry point) utama aplikasi
// React. Bertanggung jawab untuk merender komponen App ke dalam
// DOM dan mengaktifkan Strict Mode untuk development.
// ============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Membuat root React DOM dan merender aplikasi
 * 
 * 1. createRoot: Membuat root React DOM di elemen dengan id 'root'
 * 2. render: Merender komponen App ke dalam root
 * 3. React.StrictMode: Mengaktifkan strict mode untuk mendeteksi
 *    masalah potensial dalam aplikasi selama development
 * 
 * @see {@link https://react.dev/reference/react-dom/client/createRoot}
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)