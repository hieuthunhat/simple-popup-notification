import {Firestore} from '@google-cloud/firestore';
import {paginateQuery} from './helper.js';
import {formatDateFields} from '@avada/firestore-utils';

const firestore = new Firestore();
const collection = firestore.collection('notifications');

/**
 * Get all notifications for a specific shop with pagination
 *
 * @async
 * @param {{ shopDomain: any; page: any; limit: any; sort: any; after: any; before: any; hasCount: any; }} param0
 * @param {*} param0.shopDomain
 * @param {*} param0.page
 * @param {*} param0.limit
 * @param {*} param0.sort
 * @param {*} param0.after
 * @param {*} param0.before
 * @param {*} param0.hasCount
 * @returns {Array{Object}} return array of documents found from Firestore
 */
export const getPaginated = async ({shopDomain, page, limit, sort, after, before, hasCount}) => {
  const requestOrderBy = sort.split(':');

  const queriedRef = collection
    .where('shopDomain', '==', shopDomain)
    .orderBy(requestOrderBy[0], requestOrderBy[1]);
  const results = await paginateQuery({
    queriedRef,
    collection,
    query: {page, limit, after, before, hasCount}
  });

  return results;
};

/**
 * Get all notifications for a specific shop
 *
 * @async
 * @param {{ shopDomain: any; limit?: number; sort?: string; }} param0
 * @param {*} param0.shopDomain
 * @param {number} [param0.limit=30]
 * @param {string} [param0.sort='desc']
 * @returns {unknown}
 */
export const getAll = async ({shopDomain, limit = 30, sort = 'desc'}) => {
  const snapshot = await collection
    .where('shopDomain', '==', shopDomain)
    .orderBy('timestamp', sort)
    .limit(limit)
    // .select('name', 'title')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...formatDateFields(doc.data())
  }));
};

/**
 * Description placeholder
 *
 * @async
 * @param {*} id
 * @returns {unknown}
 */
export const getOne = async id => {
  const snapshot = await collection
    .where('productId', '==', id)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {id: doc.id, ...formatDateFields(doc.data())};
};

/**
 * Create a new notification document if one with the same productId doesn't already exist
 *
 * @async
 * @param {{ shopDomain: any; firstName: any; city?: string; country?: string; productId: any; productImage: any; productName: any; timestamp: any; }} param0
 * @param {*} param0.shopDomain
 * @param {*} param0.firstName
 * @param {string} [param0.city='']
 * @param {string} [param0.country='Global']
 * @param {*} param0.productId
 * @param {*} param0.productImage
 * @param {*} param0.productName
 * @param {*} param0.timestamp
 * @returns {unknown}
 */
export const createOne = async ({
  shopDomain,
  firstName,
  productId,
  productImage,
  productName,
  timestamp,
  city = '',
  country = 'Global'
}) => {
  const snapshot = await getOne(productId);

  if (!snapshot.empty) {
    return;
  }
  const docRef = await collection.add({
    shopDomain,
    firstName,
    city,
    country,
    productId,
    productImage,
    productName,
    timestamp: new Date(timestamp)
  });
  return docRef.id;
};

/**
 * Delete a notification document by its ID
 *
 * @async
 * @param {{ id: any; }} param0
 * @returns {*}
 */
export const deleteOne = async ({id}) => {
  await collection.doc(id).delete();
};
