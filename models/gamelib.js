'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameLib extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameLib.init({
    key: DataTypes.STRING,
    lib: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameLib',
  });
  return GameLib;
};