import {AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from 'sequelize-typescript'

@Table
class User extends Model<User> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id!: number

	@Column
	@CreatedAt
	createdAt!: Date;

	@Column
	@UpdatedAt
	updatedAt!: Date;

	@Column
	email!: string

	@Column
	token!: string

}

export default User