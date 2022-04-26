const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

 
module.exports = function (sequelize, DataTypes) {
    const Student = sequelize.define('Student', {
        ime: {
            type: Sequelize.STRING,
            is: ["[a-z]", 'i'], // regex koji dozvoljava samo slova
            field: 'ime'
        },
        prezime: {
            type: Sequelize.STRING,
            is: ["[a-z]", 'i'], // regex koji dozvoljava samo slova
            field: 'prezime'
        },
        index: {
            type: Sequelize.STRING,
            field: 'index'
        }
   });
   return Student;
}


 