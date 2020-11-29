import {Sequelize} from 'sequelize-typescript'
import User from './Models/User'
import Trip from './models/Trip'

export type StoreType = { users: typeof User, trips: typeof Trip }

export function paginateResults({
	                                // @ts-ignore
	                                after: cursor,
	                                pageSize = 20,
	                                // @ts-ignore
	                                results,
	                                // can pass in a function to calculate an item's cursor
	                                // @ts-ignore
	                                getCursor,
                                }) {
	if (pageSize < 1) return []

	if (!cursor) return results.slice(0, pageSize)
	const cursorIndex = results.findIndex((item: any) => {
		// if an item has a `cursor` on it, use that, otherwise try to generate one
		let itemCursor = item.cursor ? item.cursor : getCursor(item)

		// if there's still not a cursor, return false by default
		return itemCursor ? cursor === itemCursor : false
	})

	return cursorIndex >= 0
		? cursorIndex === results.length - 1 // don't let us overflow
			? []
			: results.slice(
				cursorIndex + 1,
				Math.min(results.length, cursorIndex + 1 + pageSize),
			)
		: results.slice(0, pageSize)
}

export function createStore(): StoreType {
	new Sequelize({
		database: 'database',
		username: 'username',
		password: 'password',
		dialect: 'sqlite',
		storage: './store.sqlite',
		logging: false,
		models: [__dirname + '/models']
	})

	return {users: User, trips: Trip}
}
