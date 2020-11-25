require('dotenv').config()

import {ApolloServer} from 'apollo-server'
import typeDefs from './schema'

const {createStore} = require('./utils')

import LaunchAPI from './datasources/launch'
import UserAPI from './datasources/user'

const store = createStore()

const server = new ApolloServer({
	typeDefs,
	dataSources: () => ({
		launchAPI: new LaunchAPI(),
		userAPI: new UserAPI({ store })
	})
})

server.listen().then(() => {
	console.log(`
	    Server is running!
	    Listening on port 4000
	    Explore at https://studio.apollographql.com/dev
	`)
})