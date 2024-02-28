const BooksList = ({ books }) => {
	if (books.length === 0) {
		return null
	}

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
						<th>Published</th>
					</tr>
				</thead>
				<tbody>
					{books.map(book => (
						<tr key={book.id}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default BooksList
