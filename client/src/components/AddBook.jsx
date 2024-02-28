import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const AddBook = () => {
	const title = useField('text')
	const author = useField('text')
	const published = useField('number')
	const genre = useField('text')
	const [genres, setGenres] = useState([])

	const navigate = useNavigate()

	const [addBook] = useMutation(ADD_BOOK, {
		refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
		onError: error => {
			console.log(error)
		}
	})

	const handleSubmit = event => {
		event.preventDefault()
		addBook({
			variables: {
				title: title.value,
				author: author.value,
				published: Number(published.value),
				genres
			},
			refetchQueries: [
				{ query: ALL_BOOKS },
				{ query: ALL_AUTHORS },
				genres.map(g => ({ query: ALL_BOOKS, variables: { genre: g } }))
			].flat(),
			onError: error => {
				console.log(error)
			},
			onCompleted: () => {
				title.onChange({ target: { value: '' } })
				author.onChange({ target: { value: '' } })
				published.onChange({ target: { value: '' } })
				genre.onChange({ target: { value: '' } })
				setGenres([])
				navigate('/books')
			}
		})
	}

	const handleAddGenre = event => {
		event.preventDefault()
		setGenres([...genres, genre.value])
		genre.onChange({ target: { value: '' } })
	}

	return (
		<div>
			<h1>Add Book</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-field">
					<label>Title</label>
					<input {...title} />
				</div>
				<div className="form-field">
					<label>Author</label>
					<input {...author} />
				</div>
				<div className="form-field">
					<label>Published</label>
					<input {...published} />
				</div>
				<div>
					<div className="form-field">
						<label>Genres</label>
						<input {...genre} />
						<div>
							<button className="small" onClick={handleAddGenre}>
								Add Genre
							</button>
						</div>
					</div>
					<hr></hr>
					<p>Added genres</p>
					<ul>
						{genres.map(g => {
							return <li key={g}>{g}</li>
						})}
					</ul>
				</div>
				<div className="flex flex-end">
					<button className="primary" type="submit">
						Add Book
					</button>
				</div>
			</form>
		</div>
	)
}

export default AddBook
