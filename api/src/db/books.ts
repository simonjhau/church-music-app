import { z } from "zod";

import { parseData } from "../utils";
import { dbPool } from "./index";

const BookSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    bookCode: z.string(),
  })
  .strict();
type Book = z.infer<typeof BookSchema>;

export const dbGetBooks = async (): Promise<Book[]> => {
  const sqlQuery = `SELECT
                  id AS "id",
                  name AS "name",
                  book_code AS "bookCode"
                  FROM books;`;
  const res = (await dbPool.query(sqlQuery)).rows;
  const books = parseData(
    z.array(BookSchema),
    res,
    "Error getting books from db"
  );
  return books;
};

// export const dbGetBookCode = async (bookId: number) => {
//   const sqlQuery = `SELECT book_code As "bookCode" FROM books WHERE id = $1;`;
//   const values = [bookId];
//   const book = await dbQuery(sqlQuery, values);
//   return book.rows[0].bookCode;
// };
