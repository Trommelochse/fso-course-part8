import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'

const httpLink = createHttpLink({
	uri: 'http://localhost:4000'
})

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('library-user-token')
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : null
		}
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={client}>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</ApolloProvider>
)
