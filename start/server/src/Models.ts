import {AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from 'sequelize-typescript'

@Table
class User extends Model<User> {

	@AutoIncrement
	@PrimaryKey
	id?: number

	// createdAt: DataTypes.DATE,
	// updatedAt: DataTypes.DATE,
	// email: DataTypes.STRING,
	// token: DataTypes.STRING,
	//
	// @CreatedAt
	// creationDate: Date;
	//
	// @UpdatedAt
	// updatedOn: Date;

}

export default [User]