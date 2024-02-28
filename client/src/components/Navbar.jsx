import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'

const Navbar = () => {
	const { token, logout } = useContext(AuthContext)
	const navigate = useNavigate()
	const handleLogout = event => {
		event.preventDefault()
		logout()
		navigate('/login')
	}

	return (
		<nav>
			<ul>
				<li>{token ? <Link to="/">Recommendations</Link> : null}</li>
				<li>
					<Link to="/authors">Authors</Link>
				</li>
				<li>
					<Link to="/books">Books</Link>
				</li>
				{token ? (
					<li>
						<Link to="/add">Add Book</Link>
					</li>
				) : null}
				{token ? null : (
					<li>
						<Link to="/login">Login</Link>
					</li>
				)}
				{token ? (
					<li>
						<a onClick={handleLogout} href="#">
							Logout
						</a>
					</li>
				) : null}
			</ul>
		</nav>
	)
}

export default Navbar
