import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ login }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()

	const handleLogin = async event => {
		event.preventDefault()
		await login({ variables: { username, password } })
		navigate('/')
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={({ target }) => setUsername(target.value)}
				></input>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={({ target }) => setPassword(target.value)}
				></input>
				<input type="submit" value="Login"></input>
			</form>
		</div>
	)
}

export default Login
