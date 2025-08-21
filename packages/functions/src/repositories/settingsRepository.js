const {formatDateFields} = require('@avada/firestore-utils');
const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
const collection = firestore.collection('settings');

/**
 * Get settings from a specific shop
 * @param {String} shopId
 * @returns {Array{Object}} return array of documents found from Firestore
 */
const getAll = async shopId => {
  try {
    const docs = await collection.where('shopId', '==', shopId).get();
    return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
  } catch (error) {
    console.error(error);
  }
};

/**
 * Update all settings from a specific id with data
 * @param {0} id Shop ID
 * @param {1} settingsData settings data sent from Controller
 * @returns {Object} return a message
 */
const updateAll = async ({id, settingsData}) => {
  try {
    const snapshot = await collection
      .where('shopId', '==', id)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.set(settingsData, {merge: true});
      return {msg: true};
    } else {
      console.log('Cannot find the document');
      return {msg: true};
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return {msg: false};
  }
};

module.exports = {getAll, updateAll};
