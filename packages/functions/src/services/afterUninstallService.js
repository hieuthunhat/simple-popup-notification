import * as notificationsRepository from '../repositories/notificationsRepository';
import * as settingsRepository from '../repositories/settingsRepository';

const batchSize = 100;
const removeDataNotifications = async () => {
  await notificationsRepository.dropCollection({batchSize});
};

const removeDataSettings = async () => {
  await settingsRepository.dropCollection({batchSize});
};

module.exports = {removeDataNotifications, removeDataSettings};
