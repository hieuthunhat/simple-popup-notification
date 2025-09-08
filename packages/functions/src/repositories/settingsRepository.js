import {Firestore} from '@google-cloud/firestore';
import {formatDateFields} from '@avada/firestore-utils';

const firestore = new Firestore();
const collection = firestore.collection('settings');

/**
 * Get settings from a specific shop
 * @param {String} shopId
 * @returns {Array{Object}} return array of documents found from Firestore
 */
export const getOneById = async shopId => {
  const docs = await collection.where('shopId', '==', shopId).get();
  return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
};

/**
 * Get settings from a specific shop by domain
 *
 * @async
 * @param {*} shopDomain
 * @returns {Array{Object}} return array of documents found from Firestore
 */
export const getOneByDomain = async shopDomain => {
  const docs = await collection.where('shopDomain', '==', shopDomain).get();
  return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
};

/**
 * Update all settings from a specific id with data
 * @param {0} id Shop ID
 * @param {1} settingsData settings data sent from Controller
 * @returns {Object} return a message
 */
export const updateOne = async ({id, settingsData}) => {
  const snapshot = await collection
    .where('shopId', '==', id)
    .limit(1)
    .get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  await doc.ref.set(
    {
      ...settingsData,
      updatedAt: new Date()
    },
    {merge: true}
  );
  return {success: true};
};

/**
 * Create a new settings document
 *
 * @async
 * @param {{ data: any; shopId: any; shopDomain: any; }} param0
 * @param {*} param0.data
 * @param {*} param0.shopId
 * @param {*} param0.shopDomain
 * @returns {unknown}
 */
export const createOne = async ({data, shopId, shopDomain}) => {
  console.log('setting', shopId);
  const snapshot = await getOneById(shopId);

  if (!snapshot.empty) {
    console.log('get setting', existedOne);
    return;
  }
  const settingsDocRef = await collection.add({...data, shopId: shopId, shopDomain: shopDomain});
  return settingsDocRef.id;
};
