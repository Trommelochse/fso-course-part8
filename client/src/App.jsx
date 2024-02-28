import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

import { AuthContext } from './contexts/AuthProvider'

import Navbar from './components/Navbar.jsx'

import Recommendations from './components/Recommendations.jsx'
import Authors from './components/Authors.jsx'
import Books from './components/Books.jsx'
import AddBook from './components/AddBook.jsx'
import Login from './components/Login.jsx'

const App = () => {
	const { login } = useContext(AuthContext)

	return (
		<div className="App">
			<Navbar />
			<div className="container">
				<Routes>
					<Route path="/" element={<Recommendations />} />
					<Route path="/authors" element={<Authors />} />
					<Route path="/books" element={<Books />} />
					<Route path="/add" element={<AddBook />} />
					<Route path="/login" element={<Login login={login} />} />
				</Routes>
			</div>
		</div>
	)
}

export default App
