export const CREATE_CART_TABLE = `
      CREATE TABLE IF NOT EXISTS carts(
        id serial PRIMARY KEY,
        user_id character varying,
        deleted boolean DEFAULT false
      )
    `
export const CREATE_CART_ITEMS_TABLE = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id serial PRIMARY KEY,
        cart_id integer REFERENCES carts (id),
        product_id integer REFERENCES products (id),
        count integer NOT NULL,
        CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
      )
`
export const INSERT_CART_QUERY = `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`
export const UPSERT_CART_ITEMS_QUERY =`
  INSERT INTO cart_items (cart_id, product_id, count)
  VALUES ($1, $2, $3)
  ON CONFLICT (cart_id, product_id) DO UPDATE
  SET cart_id = $1, product_id = $2, count = $3
  RETURNING *
`
export const SELECT_CART_QUERY = `SELECT * FROM carts where user_id = $1 AND NOT deleted`;
export const SELECT_CART_ITEMS_QUERY = `
  SELECT cart_items.count, products.title, products.price, products.description, products.code
  FROM cart_items
  INNER JOIN products ON cart_items.product_id = products.id
  WHERE cart_items.cart_id = $1
`;

export const DELETE_CART_QUERY = `UPDATE carts SET deleted = true WHERE user_id = $1 AND NOT deleted RETURNING *`
