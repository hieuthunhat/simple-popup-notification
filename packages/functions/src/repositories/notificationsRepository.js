const {Firestore} = require('@google-cloud/firestore');
const {paginateQuery} = require('./helper');

const firestore = new Firestore();
const collection = firestore.collection('notifications');

const getPaginated = async ({
  shopDomain,
  page,
  limit,
  sort,
  searchKey,
  after,
  before,
  hasCount
}) => {
  try {
    const queriedRef = collection
      .where('shopDomain', '==', shopDomain)
      .orderBy('timestamp', 'desc');
    const result = await paginateQuery({
      queriedRef,
      collection,
      query: {page, limit, after, before, hasCount}
    });
    console.log('resut', result);

    return result;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

module.exports = {getPaginated};
