/**
 * Products.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

 tableName: 'products',
  attributes: {

    name: {
      type: 'string'
    },
    qty: {
      type: 'integer'
    },
    price : {
      type :'float'
    },
     product_orders : {
     collection:'productorder',
     via:'product'
    }
  }
};

