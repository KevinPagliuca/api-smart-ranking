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

const ACKERRORS_CATEGORIES = [
  'Category already exists',
  'Category not found',
  'E11000',
];

export { CATEGORIES_EVENTS, PLAYERS_EVENTS, ACKERRORS_CATEGORIES };
