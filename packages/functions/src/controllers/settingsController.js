import * as settingsRepository from '../repositories/settingsRepository';
const {getCurrentUserInstance} = require('../helpers/auth');

/**
 * Get all settings data from Repository
 * @param {*} ctx
 * @returns
 */
const getSettings = async ctx => {
  try {
    const {shopID} = getCurrentUserInstance(ctx);

    if (!shopID) {
      ctx.status = 403;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    const data = await settingsRepository.getAll(shopID);
    console.log(data);
    if (!data) {
      ctx.status = 404;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    ctx.status = 200;
    ctx.body = {success: true, data: data[0]};
  } catch (error) {
    ctx.status = 500;
    ctx.body = {success: false, data: []};
  }
};

/**
 * Update all settings to the Repository
 * @param {*} ctx
 * @returns
 */
const updateSettings = async ctx => {
  try {
    const {shopID} = getCurrentUserInstance(ctx);
    const data = ctx.req.body;

    if (!shopID) {
      ctx.status = 403;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }
    const results = await settingsRepository.updateAll({id: shopID, settingsData: data});
    if (!results) {
      ctx.status = 404;
      ctx.body = {data: [], shopData: {}, success: false};
      return;
    }

    ctx.status = 200;
    ctx.body = {success: true};
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {success: false, data: []};
  }
};

module.exports = {getSettings, updateSettings};
