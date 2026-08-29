import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'
import { UserProvider } from './components/UserProvider'

function App() {  
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/posts" element={<Posts/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
