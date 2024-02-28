import { useState, useEffect, useContext } from 'react'
import { useLazyQuery } from '@apollo/client'
import { AuthContext } from '../contexts/AuthProvider'

import { ALL_BOOKS } from '../queries'

import BooksList from './BooksList'

const Recommendations = () => {
	const [books, setBooks] = useState([])
	const { user } = useContext(AuthContext)
	const [getBooks, { loading, error, data: bookData }] =
		useLazyQuery(ALL_BOOKS)

	useEffect(() => {
		if (user) {
			getBooks({ variables: { genre: user.favoriteGenre } })
		}
	}, [user, getBooks])

	useEffect(() => {
		if (bookData) {
			setBooks(bookData.allBooks)
		}
	}, [bookData])

	if (!user) return <div>Please login to see recommendations</div>
	if (loading) return <div>Loading...</div>
	if (error) return <div>Error</div>

	return (
		<div>
			<h1>Recommendations</h1>
			<BooksList books={books} />
		</div>
	)
}

export default Recommendations
