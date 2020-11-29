import {AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from 'sequelize-typescript'

@Table
class User extends Model<User> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id!: number

	@Column
	@CreatedAt
	creationDate!: Date;

	@Column
	@UpdatedAt
	updatedOn!: Date;

	@Column
	email!: string

	@Column
	token!: string

}

export default User