import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'

function App() {
  useEffect(() => {
    async function fetchTest () {
      const response = await fetch(`/api/videoupdates?max=1800&key=youtube:ac bf resynced`)
      console.log(await response.json())
    }
    fetchTest()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/posts" element={<Posts/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
