'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Spots';
   return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '1 Place St',
      city: 'Placeville',
      state: 'California',
      country: 'USA',
      lat: '123.321',
      lng: '123.321',
      name: 'Nameyplace',
      description: 'A place',
      price: '5',
    },
    {
      ownerId: 2,
      address: '2 Comfeyspot',
      city: 'Comfeytown',
      state: 'California',
      country: 'USA',
      lat: '123.321',
      lng: '123.321',
      name: 'The Comfiest Spot',
      description: 'So comfey, for real.',
      price: '10',
    },
    {
      ownerId: 3,
      address: '3 Box Box',
      city: 'Boxington',
      state: 'California',
      country: 'USA',
      lat: '123.321',
      lng: '123.321',
      name: 'Just a Box',
      description: 'Literally just a box, totally great.',
      price: '46,853',
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in] : ['1 place st', '2 place st', '3 place st']}
    }, {})
  }
};
