import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import Login from './login'
import Contract from './contract'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/contract" element={<Contract/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
