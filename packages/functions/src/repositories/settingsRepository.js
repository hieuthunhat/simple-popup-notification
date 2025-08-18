const {formatDateFields} = require('@avada/firestore-utils');
const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
const collection = firestore.collection('settings');

const getAllSettings = async shopId => {
  try {
    console.log(shopId);
    const docs = await collection.where('shopId', '==', shopId).get();
    return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
  } catch (error) {
    console.error(error);
  }
};

module.exports = {getAllSettings};
