import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const { error, loading, data} = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }

  if (loading)  {
    return <div>loading...</div>
  }

  if (error) {  
    console.log(error)
    return <div>Something went wrong :( </div>
  }

  const books = data.allBooks
  console.log(books)

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Published in</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
