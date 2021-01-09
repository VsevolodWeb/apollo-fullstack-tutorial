require('dotenv').config()
import {ApolloServer} from 'apollo-server'
import isEmail from 'isemail'
import typeDefs from './schema'
import {createStore} from './utils'
import resolvers from './resolvers'

import LaunchAPI from './datasources/launch'
import UserAPI from './datasources/user'

const store = createStore()

const server = new ApolloServer({
	context: async ({req}) => {
		// simple auth check on every request
		const auth = req.headers && req.headers.authorization || ''
		const email = Buffer.from(auth, 'base64').toString('ascii')

		if (!isEmail.validate(email)) return {user: null}
		// find a user by their email
		const users = await store.users.findOrCreate({where: {email}})
		const user = users && users[0] || null
		return {user}
	},
	typeDefs,
	resolvers,
	dataSources: () => ({
		launchAPI: new LaunchAPI(),
		userAPI: new UserAPI(store)
	})
})

server.listen().then(() => {
	console.log(`
	    Server is running!
	    Listening on port 4000
	    Explore at https://studio.apollographql.com/dev
	`)
})