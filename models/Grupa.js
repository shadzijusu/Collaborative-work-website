const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

 
module.exports = function (sequelize, DataTypes) {
    const Grupa = sequelize.define('Grupa', {
        naziv: {
            type: Sequelize.STRING,
            field: 'naziv'
        },
        termin: {
            type: Sequelize.DATE,
            field: 'termin'
        }
   });
   return Grupa;
}

