require('dotenv').config()
const mongoose = require('mongoose')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book
    editBirthyear(
      name: String!
      born: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments() ,
    bookCount: async () => Book.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      const { author, genre } = args
      if (author && genre) {
        console.log('both')
        const books = await Book
          .find({ author: author, genres: { $in: [genre] } })
          .populate('author', { name: 1, born: 1, id: 1 })
        return books
      }
      if (author) {
        console.log('author')
        const authorObject = await Author.findOne({ name: author })
        if (!authorObject) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            }
          })
        }
        const books = await Book
          .find({ author: authorObject._id })
          .populate('author', { name: 1, born: 1, id: 1 })
        return books
      }
      if (genre) {
        const books = await Book
          .find({ genres: { $in: [genre] } })
          .populate('author', { name: 1, born: 1, id: 1 })
        return books
      }

      const books = await Book.find({}).populate('author', { name: 1, born: 1, id: 1 })
      return books
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const { author, ...rest } = args
      const book = new Book({ ...rest })
      const existingAuthor = await Author.findOne({ name: author })

      if (existingAuthor) {
        book.author = existingAuthor
      } else {
        const newAuthor = new Author({ name: author })
        try {
          const savedAuthor = await newAuthor.save()
          book.author = savedAuthor
        } catch (error) {
          throw new GraphQLError('Book could not be saved', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: author,
              error
            }
          })
        
        }
      }
      try {
        return await book.save()
      } catch (error) {
        throw new GraphQLError('Book could not be saved', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },
    editBirthyear: async (root, args) => {
      const { name, born } = args
      if ((born === undefined || !name )) {
        throw new GraphQLError('could not be edited', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      const author = await Author.findOne({ name: name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        })
      }

      author.born = born
      author.save()
      return author

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})