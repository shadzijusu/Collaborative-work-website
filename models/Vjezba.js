const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

 
module.exports = function (sequelize, DataTypes) {
    const Vjezba = sequelize.define('Vjezba', {
        naziv: {
            type: Sequelize.STRING,
            field: 'naziv'
        }
   });
   return Vjezba;
}

