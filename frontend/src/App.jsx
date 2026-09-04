import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'
import ProtectedPage from './components/ProtectedPage'
import { UserProvider } from './components/UserProvider'

function App() {  
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/posts" element={<ProtectedPage><Posts/></ProtectedPage>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
