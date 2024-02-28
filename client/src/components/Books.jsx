import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

import BooksList from './BooksList'

const Books = () => {
	const [books, setBooks] = useState([])
	const [getBooks, { data: bookData, loading, error }] =
		useLazyQuery(ALL_BOOKS)

	useEffect(() => {
		getBooks()
	}, [getBooks])

	useEffect(() => {
		if (bookData) {
			setBooks(bookData.allBooks)
		}
	}, [bookData])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error</div>

	const renderGenres = () => {
		if (!bookData) return null
		const genres = new Set(
			bookData.allBooks.map(book => book.genres).flat()
		)
		return (
			<div>
				{Array.from(genres).map(genre => (
					<button
						key={genre}
						className="chip"
						onClick={() => getBooks({ variables: { genre } })}
					>
						{genre}
					</button>
				))}
				<button className="chip" onClick={() => getBooks()}>
					all genres
				</button>
			</div>
		)
	}

	return (
		<div>
			<h1>Books</h1>
			<BooksList books={books} />
			{renderGenres()}
		</div>
	)
}

export default Books
