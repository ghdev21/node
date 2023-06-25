export const CREATE_ORDER_TABLE = `
  CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    user_id character varying NOT NULL,
    items json NOT NULL,
    total integer NOT NULL,
    comments character varying NOT NULL,
    cart_id integer NOT NULL REFERENCES carts(id),
    delivery_id integer NOT NULL REFERENCES delivery (id),
    payment_id integer NOT NULL REFERENCES payment (id),
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts (id)
  )
`;

export const CREATE_PAYMENT_TABLE = `
  CREATE TABLE IF NOT EXISTS payment (
    id serial PRIMARY KEY,
    type character varying NOT NULL,
    card_number character varying NOT NULL,
    address character varying NOT NULL
  )
`;

export const CREATE_DELIVERY_TABLE = `
  CREATE TABLE IF NOT EXISTS delivery (
    id serial PRIMARY KEY,
    type character varying NOT NULL,
    address character varying NOT NULL
  )
`;

export const SELECT_ORDER_QUERY = `
  SELECT
    orders.id AS order_id,
    orders.user_id,
    orders.items,
    orders.total,
    orders.comments,
    carts.user_id AS cart_user_id,
    delivery.type AS delivery_type,
    delivery.address AS delivery_address,
    payment.type AS payment_type,
    payment.card_number,
    payment.address AS payment_address
  FROM orders
  JOIN carts ON orders.cart_id = carts.id
  JOIN delivery ON orders.delivery_id = delivery.id
  JOIN payment ON orders.payment_id = payment.id
  WHERE orders.id = $1
`;

export const INSERT_DELIVERY_QUERY = `
  INSERT INTO delivery (type, address)
  VALUES ($1, $2)
  RETURNING *
`;

export const INSERT_PAYMENT_QUERY = `
  INSERT INTO payment (type, card_number, address)
  VALUES ($1, $2, $3)
  RETURNING *
`;

export const INSERT_ORDER_QUERY = `
  INSERT INTO orders (user_id, items, total, cart_id, comments, delivery_id, payment_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
`;



