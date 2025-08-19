const {getAllSettings, updateAllSettings} = require('../repositories/settingsRepository');
const {getCurrentUserInstance} = require('../helpers/auth');

const getSettings = async ctx => {
  try {
    const {shopID} = getCurrentUserInstance(ctx);

    if (!shopID) {
      ctx.status = 403;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    const data = await getAllSettings(shopID);
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

const updateSettings = async ctx => {
  try {
    const {shopID} = await getCurrentUserInstance(ctx);
    const data = ctx.req.body;

    if (!shopID) {
      ctx.status = 403;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    const results = await updateAllSettings({id: shopID, settingsData: data});
    if (!results) {
      ctx.status = 404;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }

    ctx.status = 200;
    ctx.body = {success: true};
  } catch (error) {
    console.error(error);
  }
};

module.exports = {getSettings, updateSettings};
