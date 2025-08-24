const {Firestore, Timestamp, FieldValue} = require('@google-cloud/firestore');
const {paginateQuery} = require('./helper');

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
const getPaginated = async ({shopDomain, page, limit, sort, after, before, hasCount}) => {
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
 * Create a document on a Firestore collection
 * @param {*} param0
 */
const createOne = async ({
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
    return {success: true, id: docRef.id};
  } catch (error) {
    console.error('Error creating document:', error);
    return {success: false, error: error.message};
  }
};

const deleteOne = async ({id}) => {
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
    console.log('Collection notifications deleted completely.');
  } catch (err) {
    console.error('Error deleting collection:', err);
  }
};

module.exports = {getPaginated, createOne, deleteOne, dropCollection};
