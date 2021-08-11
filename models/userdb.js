'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserDb.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserDb',
  });
  return UserDb;
};