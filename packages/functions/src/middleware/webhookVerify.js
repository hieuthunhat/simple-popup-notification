// import crypto from 'crypto';

// const secret = '171562f088cf1efd15c2efd6bd79d5d3';

// export const verifyWebhook = async (ctx, next) => {
//   const shopifyHmac = ctx.headers['x-shopify-hmac-sha256'];
//   const rawBody = ctx.req.body;
//   const bodyString = rawBody.toString('utf8');

//   const calculatedHmacDigest = crypto
//     .createHmac('sha256', secret)
//     .update(rawBody)
//     .digest('base64');
//   const hmacValid = crypto.timingSafeEqual(
//     Buffer.from(calculatedHmacDigest),
//     Buffer.from(shopifyHmac)
//   );
//   if (!hmacValid) {
//     ctx.status = 401;
//     return (ctx.body = {message: 'invalid webhook request'});
//   }
//   next();
// };
