const {formatDateFields} = require('@avada/firestore-utils');
const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
const collection = firestore.collection('settings');

/**
 * Get settings from a specific shop
 * @param {String} shopId
 * @returns {Array{Object}} return array of documents found from Firestore
 */
const getOne = async shopId => {
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
const updateOne = async ({id, settingsData}) => {
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

const createOne = async ({data, shopId}) => {
  try {
    const settingsDocRef = await collection.add({...data, shopId: shopId});
    if (settingsDocRef.empty) {
      console.log('No data found');
    }
    console.log('Settings Document created with Id', settingsDocRef.id);
    return settingsDocRef.id;
  } catch (error) {
    console.error('Error when creating settings', error);
  }
};

// Bổ sung xoá theo shopId hoặc shopDomain
const dropCollection = async ({batchSize = 100}) => {
  try {
    const deleteCollection = async () => {
      const snapshot = await collection.limit(batchSize).get();

      if (snapshot.empty) {
        console.log('All documents deleted.');
        return;
      }

      const batch = firestore.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();

      setImmediate(deleteCollection);
    };

    await deleteCollection();
    console.log('Collection settings deleted completely.');
  } catch (err) {
    console.error('Error deleting collection:', err);
  }
};

module.exports = {getOne, updateOne, createOne, dropCollection};
