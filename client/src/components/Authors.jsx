import { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { AuthContext } from '../contexts/AuthProvider'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'

const Authors = () => {
	const { loading, error, data } = useQuery(ALL_AUTHORS)
	const [authors, setAuthors] = useState([])
	const { token } = useContext(AuthContext)
	const [author, setAuthor] = useState('')
	const [birthyear, setBirthyear] = useState()

	useEffect(() => {
		if (data) {
			setAuthors(data.allAuthors)
		}
	}, [data])

	const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: error => {
			console.error(error)
		}
	})

	const handleSubmit = event => {
		event.preventDefault()
		console.log(author, birthyear)
		editAuthor({
			variables: { name: author, born: parseInt(birthyear) }
		})
		setAuthor('')
		setBirthyear('')
	}

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>

	const renderBirthyearForm = () => {
		if (authors.length === 0) return null
		return (
			<div>
				<p>Set birthyear</p>
				<form onSubmit={handleSubmit}>
					<div className="form-field">
						<select
							onChange={e => setAuthor(e.target.value)}
							value={author}
						>
							{authors.map(author => (
								<option key={author.name} value={author.name}>
									{author.name}
								</option>
							))}
							<option value={''}>Select Author</option>
						</select>
					</div>
					<div className="form-field">
						<input
							type="number"
							value={birthyear || ''}
							onChange={e => setBirthyear(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						disabled={author === '' ? true : false}
					>
						Update author
					</button>
				</form>
			</div>
		)
	}

	return (
		<div>
			<div>
				<h1>Authors</h1>
			</div>
			<table>
				<tbody>
					<tr>
						<th>Author</th>
						<th>Born</th>
						<th>Books</th>
					</tr>
					{authors.map(author => (
						<tr key={author.name}>
							<td>{author.name}</td>
							<td>{author.born}</td>
							<td>{author.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			{token ? renderBirthyearForm() : null}
		</div>
	)
}

export default Authors
