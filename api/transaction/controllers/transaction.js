'use strict';
const midtransClient = require('midtrans-client');
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const axios = require('axios');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { id } = ctx.params;
    let entity;
    let detailTrans = await strapi.services.transaction.findOne({ id });

    const { orderId } = detailTrans;
    await axios({
      method: "get",
      url: `${process.env.SERVER_URL_PAYMENT}/v2/${orderId}/status`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.SERVER_KEY_PAYMENT).toString("base64")
      },
    })
    .then(async response => {
      detailTrans.detailPayment = response.data;
      entity = await strapi.services.transaction.update({ id }, detailTrans);
    }).catch(() => {
      return sanitizeEntity(entity, { model: strapi.models.transaction });
    });
    return sanitizeEntity(entity, { model: strapi.models.transaction });
  },

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.transaction.create(data, { files });
    } else {

      // create transaction
      const orderId = "order-trip-" + Math.round(new Date().getTime() / 1000);
      ctx.request.body.transactionToken = orderId;
      ctx.request.body.orderId = orderId;
      entity = await strapi.services.transaction.create(ctx.request.body);
      sanitizeEntity(entity, { model: strapi.models.transaction })

      // create midtrans trans
      const { id: bookingId, participant = 1 } = entity.booking;
      const bookingDetail = await strapi.services.booking.findOne({ id: bookingId });
      let snap = new midtransClient.Snap({
        isProduction : process.env.NODE_ENV === 'production',
        serverKey : process.env.SERVER_KEY_PAYMENT,
        clientKey : process.env.CLIENT_KEY_PAYMENT
      });
      const orderIdMidtrans = orderId + '-' + entity.id;
      let parameter = {
        transaction_details: {
            order_id: orderIdMidtrans,
            gross_amount: Number(bookingDetail.trip.price) * participant
        },
      };
      const resMidtrans = await snap.createTransaction(parameter)
      let transactionToken = resMidtrans.token;
      ctx.request.body.transactionToken = transactionToken;
      ctx.request.body.orderId = orderIdMidtrans;

      // update transaction
      entity = await strapi.services.transaction.update({ id: entity.id }, ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.transaction });
  },
};
