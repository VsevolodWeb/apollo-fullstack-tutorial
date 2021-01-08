import {AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from 'sequelize-typescript'

@Table
class Trip extends Model<Trip> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id!: number

	@Column
	@CreatedAt
	createdAt!: Date

	@Column
	@UpdatedAt
	updatedAt!: Date

	@Column
	launchId!: string

	@Column
	userId!: number

}

export default Trip