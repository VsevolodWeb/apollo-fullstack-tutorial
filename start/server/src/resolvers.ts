import UserAPI from './datasources/user'
import LaunchAPI from './datasources/launch'

type ResolversType = {
	[key: string]: (parent: any, args: any, context: {dataSources: {userAPI: typeof UserAPI, launchAPI: typeof LaunchAPI}}, info: any) => any
}

const resolvers: { Query: ResolversType } = {
	Query: {
		launches: (_, __, {dataSources}) => dataSources.launchAPI.getAllLaunches(),
		launch: (_, {id}, {dataSources}) => dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, {dataSources}) => dataSources.userAPI.findOrCreateUser(),
	}
}

export default resolvers