import {Firestore, Timestamp, FieldValue} from '@google-cloud/firestore';
import {paginateQuery} from './helper.js';

const firestore = new Firestore();
const collection = firestore.collection('notifications');

/**
 * Description placeholder
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
 * @returns {unknown}
 */
export const getPaginated = async ({shopDomain, page, limit, sort, after, before, hasCount}) => {
  try {
    const requestOrderBy = sort.split(':');

    const queriedRef = collection
      .where('shopDomain', '==', shopDomain)
      .orderBy(requestOrderBy[0], requestOrderBy[1]);
    const result = await paginateQuery({
      queriedRef,
      collection,
      query: {page, limit, after, before, hasCount}
    });

    return result;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

/**
 * Description placeholder
 *
 * @async
 * @param {*} id
 * @returns {unknown}
 */
export const getOne = async id => {
  try {
    const snapshot = await collection
      .where('productId', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log('No matching document.');
      return null;
    }

    console.log('found 1');

    const doc = snapshot.docs[0];
    return {id: doc.id, ...doc.data()};
  } catch (error) {
    console.error('Error when getting notification document:', error);
    return null;
  }
};

/**
 * Create a document on a Firestore collection
 * @param {*} param0
 */
export const createOne = async ({
  shopDomain,
  firstName,
  city = '',
  country = 'Global',
  productId,
  productImage,
  productName,
  timestamp
}) => {
  try {
    const ts = timestamp ? Timestamp.fromDate(new Date(timestamp)) : FieldValue.serverTimestamp();

    const docRef = await collection.add({
      shopDomain,
      firstName,
      city,
      country,
      productId,
      productImage,
      productName,
      timestamp: ts
    });

    console.log(`Notification Document created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    return error;
  }
};

export const deleteOne = async ({id}) => {
  if (!id) {
    console.error('Document ID is required');
    return;
  }
  try {
    await collection.doc(id).delete();
    console.log(`Document ${id} deleted successfully`);
  } catch (error) {
    console.error('Error when deleting document:', error);
  }
};

// Bổ sung xoá theo shopId hoặc shopDomain
export const dropCollection = async ({batchSize = 100}) => {
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
    console.log('Collection notifications deleted completely.');
  } catch (err) {
    console.error('Error deleting collection:', err);
  }
};
