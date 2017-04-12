/**
 * Orders.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

tableName: 'orders',
  attributes: {

    orderNumber : {
      type  : 'integer'
    },
    product_orders : {
     collection:'productorder',
     via:'order'
    }

  }
};

