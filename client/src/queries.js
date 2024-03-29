import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
    query allBooks($genre: String) {
      allBooks(genre: $genre) {
        title
        author {
          name
        }
        published
        id
        genres
      }
    }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int, $genres: [String]){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthyear($name: String!, $born: Int!) {
    editBirthyear(
      name: $name,
      born: $born
    ) {
      name
      born
    }
  }
`