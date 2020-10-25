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
      url: `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from("SB-Mid-server-dlFIEODNAA1jrFgY8lsnZQE7").toString("base64")
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
      const { booking } = ctx.request.body;

      const bookingDetail = await strapi.services.booking.findOne({ id: booking.id });
      let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'SB-Mid-server-dlFIEODNAA1jrFgY8lsnZQE7',
        clientKey : 'SB-Mid-client-hYuZ3Vv3EOGDvsP8'
      });
      const orderId = "order-trip-" + Math.round(new Date().getTime() / 1000);
      let parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: Number(bookingDetail.trip.price)
        },
      };
      await snap.createTransaction(parameter)
      .then((transaction)=>{
          // transaction token
          let transactionToken = transaction.token;
          ctx.request.body.transactionToken = transactionToken;
          ctx.request.body.orderId = orderId;
      })
      entity = await strapi.services.transaction.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.transaction });
  },
};