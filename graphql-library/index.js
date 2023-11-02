require('dotenv').config()
const mongoose = require('mongoose')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const User = require('./models/user')
const Book = require('./models/book')
const Author = require('./models/author')
const typeDefs = require('./typedefs')
const jwt = require('jsonwebtoken')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments() ,
    bookCount: async () => Book.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      const { author, genre } = args
      if (author && genre) {
        const books = await Book
          .find({ author: author, genres: { $in: [genre] } })
          .populate('author', { name: 1, born: 1, id: 1 })
        return books
      }
      if (author) {
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
    addBook: async (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
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
          }
        })
      }
    },
    editBirthyear: async (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
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

    },
    createUser: async (root,args) => {
      const { username, favoriteGenre } = args
      const user = new User({ username, favoriteGenre })
      try {
        const savedUser = await user.save()
      } catch {
        throw new GraphQLError('User could not be saved', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
    }
      return user
    },
    login: async (root, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })
      if (password !== 'pass' || !user) {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userFortoken = { username, id: user._id }
      const token = jwt.sign(userFortoken, process.env.JWT_SECRET)
      return { value: token }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})