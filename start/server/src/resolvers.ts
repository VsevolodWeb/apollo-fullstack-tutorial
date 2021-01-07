import UserAPI from './datasources/user'
import LaunchAPI, {LinksType} from './datasources/launch'
import {paginateResults} from './utils'

type QueryType = {
	[key: string]: (parent: any, args: any, context: { dataSources: { userAPI: UserAPI, launchAPI: LaunchAPI } }, info: any) => any
}

const resolvers: { [key: string]: QueryType } = {
	Query: {
		launches: async (_, {pageSize = 20, after}, {dataSources}) => {
			const allLaunches = await dataSources.launchAPI.getAllLaunches()
			// we want these in reverse chronological order
			allLaunches.reverse()
			const launches = paginateResults({
				after: Number(after),
				pageSize,
				results: allLaunches,
			})
			return {
				launches,
				cursor: launches.length ? launches[launches.length - 1].cursor : null,
				// if the cursor at the end of the paginated results is the same as the
				// last item in _all_ results, then there are no more results after this
				hasMore: launches.length
					? launches[launches.length - 1].cursor !==
					allLaunches[allLaunches.length - 1].cursor
					: false
			}
		},
		launch: (_, {id}, {dataSources}) => dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, {dataSources}) => dataSources.userAPI.findOrCreateUser(),
	},
	Mutation: {
		login: async (_, {email}, {dataSources}) => {
			const user = await dataSources.userAPI.findOrCreateUser({email})

			if (user) {
				user.token = Buffer.from(email).toString('base64')
			}

			return user
		},
		bookTrips: async (_, args, {dataSources}) => {
			const launchIds: number[] = args.launchIds
			const results = await dataSources.userAPI.bookTrips({launchIds})
			const launches = await dataSources.launchAPI.getLaunchesByIds({
				launchIds,
			})

			return {
				success: results && results.length === launchIds.length,
				message:
					results?.length === launchIds.length
						? 'trips booked successfully'
						: `the following launches couldn't be booked: ${launchIds.filter(
						//@ts-ignore
						(id: number) => !results?.includes(id),
						)}`,
				launches,
			}
		},
		cancelTrip: async (_, {launchId}, {dataSources}) => {
			const result = await dataSources.userAPI.cancelTrip({launchId})

			if (!result)
				return {
					success: false,
					message: 'failed to cancel trip',
				}

			const launch = await dataSources.launchAPI.getLaunchById({launchId})
			return {
				success: true,
				message: 'trip cancelled',
				launches: [launch],
			}
		},
	},
	Mission: {
		// The default size is 'LARGE' if not provided
		missionPatch: (mission: LinksType, {size} = {size: 'LARGE'}) => {
			return size === 'SMALL'
				? mission.mission_patch_small
				: mission.mission_patch_large
		},
	},
	Launch: {
		isBooked: async (launch, _, {dataSources}) =>
			dataSources.userAPI.isBookedOnLaunch({launchId: launch.id}),
	},
	User: {
		trips: async (_, __, {dataSources}) => {
			// get ids of launches by user
			const launchIds = await dataSources.userAPI.getLaunchIdsByUser()
			if (!launchIds.length) return []
			// look up those launches by their ids
			return (
				await dataSources.launchAPI.getLaunchesByIds({
					launchIds,
				}) || []
			)
		},
	},

}

export default resolvers