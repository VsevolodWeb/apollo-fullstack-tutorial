import UserAPI from './datasources/user'
import LaunchAPI, {LinksType} from './datasources/launch'

type QueryType = {
	[key: string]: (parent: any, args: any, context: {dataSources: {userAPI: UserAPI, launchAPI: LaunchAPI}}, info: any) => any
}

const resolvers: { Query: QueryType, Mission: any } = {
	Query: {
		launches: (_, __, {dataSources}) => dataSources.launchAPI.getAllLaunches(),
		launch: (_, {id}, {dataSources}) => dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, {dataSources}) => dataSources.userAPI.findOrCreateUser(),
	},
	Mission: {
		// The default size is 'LARGE' if not provided
		missionPatch: (mission: LinksType, { size } = { size: 'LARGE' }) => {
			return size === 'SMALL'
				? mission.mission_patch_small
				: mission.mission_patch_large
		},
	},
}

export default resolvers