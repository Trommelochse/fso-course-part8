import { createContext, useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { LOGIN, ME } from '../queries'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(
		localStorage.getItem('library-user-token') || null
	)
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem('library-user')) || null
	)
	const [getUser, { data: userData }] = useLazyQuery(ME)

	const [login] = useMutation(LOGIN, {
		onError: error => {
			console.error(error)
		},
		onCompleted: data => {
			localStorage.setItem('library-user-token', data.login.value)
			setToken(data.login.value)
			getUser()
		}
	})

	useEffect(() => {
		if (userData) {
			localStorage.setItem('library-user', JSON.stringify(userData.me))
			setUser(userData.me)
		}
	}, [userData, token])

	const logout = () => {
		setToken(null)
		setUser(null)
		localStorage.clear()
	}

	return (
		<AuthContext.Provider value={{ login, logout, token, user }}>
			{children}
		</AuthContext.Provider>
	)
}

export default { AuthProvider, AuthContext }
