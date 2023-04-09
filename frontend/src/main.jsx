import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import Game from './game'
import Play from './play'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game/>}/>
        <Route path='/play'>
          <Route path=':id' element={<Play/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
