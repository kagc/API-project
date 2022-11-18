'use strict';

// NEW: add this code to each alter table migration file above up function
let options = {};
options.tableName = 'Users'; // define your table name in options object

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return [
      await queryInterface.addColumn(options, 'firstName', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      await queryInterface.addColumn(options, 'lastName', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return [
      await queryInterface.removeColumn(options, 'firstName'),
      await queryInterface.removeColumn(options, 'lastName')
      ]
  }
};
