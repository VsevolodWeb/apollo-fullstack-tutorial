import {RESTDataSource} from 'apollo-datasource-rest'

export type LinksType = {
	mission_patch_small: string
	mission_patch_large: string
}

export type LaunchAPIType = {
	flight_number: number
	launch_date_unix: number
	launch_site: string & { site_name: string }
	mission_name: string
	links: LinksType
	rocket: {
		rocket_id: number
		rocket_name: string
		rocket_type: string
	}
	cursor: string
}

export type LaunchType = {
	id: number
	cursor: number
	site: string
	mission: {
		name: string
		missionPatchSmall: string
		missionPatchLarge: string
	}
	rocket: {
		id: number
		name: string
		type: string
	}
}

class LaunchAPI extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = 'https://api.spacexdata.com/v2/'
	}

	launchReducer(launch: LaunchAPIType): LaunchType {
		return {
			id: launch.flight_number || 0,
			cursor: launch.launch_date_unix,
			site: launch.launch_site && launch.launch_site.site_name,
			mission: {
				name: launch.mission_name,
				missionPatchSmall: launch.links.mission_patch_small,
				missionPatchLarge: launch.links.mission_patch_large,
			},
			rocket: {
				id: launch.rocket.rocket_id,
				name: launch.rocket.rocket_name,
				type: launch.rocket.rocket_type,
			},
		}
	}

	async getAllLaunches() {
		const response = await this.get<LaunchAPIType[]>('launches')

		return Array.isArray(response)
			? response.map(launch => this.launchReducer(launch))
			: []
	}

	async getLaunchById({launchId}: { launchId: number }) {
		const [response] = await this.get<LaunchAPIType[]>('launches', {flight_number: launchId})
		return this.launchReducer(response)
	}

	getLaunchesByIds({launchIds}: { launchIds: number[] }) {
		return Promise.all(
			launchIds.map(launchId => this.getLaunchById({launchId})),
		)
	}
}

export default LaunchAPI