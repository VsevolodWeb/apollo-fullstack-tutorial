import {Op} from 'sequelize'
import {Sequelize} from 'sequelize-typescript'

module.exports.paginateResults = ({
	                                  // @ts-ignore
	                                  after: cursor,
	                                  pageSize = 20,
	                                  // @ts-ignore
	                                  results,
	                                  // can pass in a function to calculate an item's cursor
                                      // @ts-ignore
	                                  getCursor,
                                  }) => {
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

module.exports.createStore = () => {
	const db = new Sequelize({
		database: 'database',
		username: 'username',
		password: 'password',
		dialect: 'sqlite',
		storage: './store.sqlite',
		operatorsAliases: {
			$in: Op.in
		},
		logging: false,
	})

	db.addModels([])
	const userAttributes: ModelAttributes<Model<UserAttributes, UserCreationAttributes>,
		{id: unknown, createdAt: unknown, updatedAt: unknown, email: unknown, token: unknown}> = {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
		email: DataTypes.STRING,
		token: DataTypes.STRING,
	}

	const users = db.define<UserInstance>('user', userAttributes)

	const trips = db.define('trip', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
		launchId: DataTypes.INTEGER,
		email: DataTypes.STRING,
		userId: DataTypes.INTEGER,
	})

	return {users, trips}
}
