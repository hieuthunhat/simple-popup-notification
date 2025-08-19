const {formatDateFields} = require('@avada/firestore-utils');
const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
const collection = firestore.collection('settings');

const getAllSettings = async shopId => {
  try {
    const docs = await collection.where('shopId', '==', shopId).get();
    return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
  } catch (error) {
    console.error(error);
  }
};

const updateAllSettings = async ({id, settingsData}) => {
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
    }
  } catch (error) {
    console.error('Error updating settings:', error);
  }
};

module.exports = {getAllSettings, updateAllSettings};
