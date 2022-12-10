'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://www.shutterstock.com/image-photo/two-cats-wooden-cat-house-600w-1365490964.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://www.shutterstock.com/image-photo/russian-blue-cat-cardboard-box-600w-2114953106.jpg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://www.shutterstock.com/image-photo/cute-grey-tabby-cat-cardboard-600w-1526963033.jpg',
        preview: true,
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
