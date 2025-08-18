const {getAllSettings} = require('../repositories/settingsRepository');
const {getCurrentShopData} = require('../helpers/auth');

const getSettings = async ctx => {
  try {
    const shopData = getCurrentShopData(ctx);
    if (!shopData) {
      ctx.status = 403;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    const data = await getAllSettings(shopData.id);
    console.log(data);
    if (!data) {
      ctx.status = 404;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    ctx.status = 200;
    ctx.body = {success: true, data: data[0]};
  } catch (error) {}
};

module.exports = {getSettings};
