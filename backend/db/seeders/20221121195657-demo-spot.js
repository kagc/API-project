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
      address: '1 place st',
      city: 'placeville',
      state: 'California',
      country: 'USA',
      lat: '123',
      lng: '123',
      name: 'nameyplace',
      description: 'a place',
      price: '5',
    },
    {
      ownerId: 2,
      address: '2 place st',
      city: 'placeville',
      state: 'California',
      country: 'USA',
      lat: '123',
      lng: '123',
      name: 'nameyplace',
      description: 'a place',
      price: '5',
    },
    {
      ownerId: 3,
      address: '3 place st',
      city: 'placeville',
      state: 'California',
      country: 'USA',
      lat: '123',
      lng: '123',
      name: 'nameyplace',
      description: 'a place',
      price: '5',
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
