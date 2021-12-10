import { dbQuery } from './db.js';

export const getHymnTypes = async () => {
  let sqlQuery = `SELECT * FROM hymn_types ORDER BY id;`;
  const hymnTypes = await dbQuery(sqlQuery);
  return hymnTypes.rows;
};
