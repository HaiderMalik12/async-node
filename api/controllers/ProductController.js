/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create(req, res) {

    const orderRequest = async () => {
      try {

        let resp = {};

        const product = await Product.create({
          name: 'MacbookPro',
          qty: 1232213,
          price: 10000.
        });
        resp.product = product;

        const order = await Order.findOne({
          orderNumber: 123
        });
        resp.order = order;

        if (order) {
          const productOrder = await ProductOrder.create({
            product: product.id,
            order: order.id
          });
          resp.product_order = productOrder;
        }

        return resp;
      }
      catch (err) {
        console.log(err);
        throw err;
      }
    };

    orderRequest()
      .then(res.ok)
      .catch(err => res.serverError(err));

  },
  awaitPromises(req, res){

    const makeRequest = async () => {

      //Run both promise in parallel
      const [product, order] = await Promise.all([
        Product.create({
          name: 'MacbookPro',
          qty: 1232213,
          price: 10000.
        }),
        Order.findOne({
          orderNumber: 123
        })
      ]);

      const productOrder = await ProductOrder.create({
        product: product.id,
        order: order.id
      });

      return {product, order, productOrder};

    };

    makeRequest()
      .then(res.ok)
      .catch(res.negotiate);
  },

  promiseVersion(req, res){

    let data = {};

    Product.create({
      name: 'MacbookPro',
      qty: 123,
      price: 10000.9
    })
      .then(_product => {

        data.product = _product;

        return Order.findOne({
          orderNumber: 123
        });

      })
      .then(_order => {

        data.order = _order;

        if (_order) {

          return ProductOrder.create({
            product: data.product.id,
            order: _order.id
          });
        }
        else {

          return data;
        }

      })
      .then((_prdocutData) => {
        if(_prdocutData) data.ProductOrder = _prdocutData;
        res.ok(data);
      })
      .catch(err => res.serverError(err));

  },
  callbackHell(req,res){

    Product.create({
      name: 'MacbookPro',
      qty: 123,
      price: 10000.9
    }, (err,_product) => {

      if(err) return res.serverError(err);

      Order.findOne({
        orderNumber: 123
      },(err,_order) => {

        if(err) return res.serverError(err);

        if (_order) {

          ProductOrder.create({
            product: _product.id,
            order: _order.id
          },(err,_productOrder) => {

            if(err) return res.serverError(err);

            res.ok({
              product: _product,
              order: _order,
              product_order:_productOrder
            });
          })
        }
        else {

          return res.ok({
            product: _product
          });
        }

      })

    });

  },
  asyncLib(req,res){

    const _async = require('async');

    const createProduct = cb => {

      Product.create({
        name: 'MacbookPro',
        qty: 123,
        price: 10000.9
      }, (err, _product) => {
        if (err) return cb(err);
        cb(null,_product);
      });
    };

    const createOrder = cb => {

      Order.findOne({
        orderNumber: 123
      },(err,_order) => {

        if (err) cb(err);
        cb(null,_order);
      });

      };

    _async
      .series([createProduct,createOrder],
        (err,[product,order]) => {

      if(err) return res.serverError(err);

      let resp = {product,order};

      if(order){
        ProductOrder.create({
          product: product.id,
          order: order.id
        },(err,productOrder) => {

          if (err) return res.serverError(err);
          resp.product_order = productOrder
          res.ok(resp);
        });

        }
        else{
        res.ok(resp);
      }

    })

  }

};

