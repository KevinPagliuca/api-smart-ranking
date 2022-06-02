const CATEGORIES_EVENTS = {
  CREATE: 'create-category',
  UPDATE: 'update-category',
  DELETE: 'delete-category',
  FIND_ALL: 'find-all-categories',
  FIND_ONE: 'find-one-category',
};

const PLAYERS_EVENTS = {
  CREATE: 'create-player',
  UPDATE: 'update-player',
  DELETE: 'delete-player',
  FIND_ALL: 'find-all-players',
  FIND_ONE: 'find-one-players',
};

const BASE_URL = '/api/v1';
const RMQ_CONFIG = {
  urls: ['amqp://admin:admin@localhost:5672/smart-ranking'],
  queue: 'admin-backend',
};

export { CATEGORIES_EVENTS, PLAYERS_EVENTS, RMQ_CONFIG, BASE_URL };
