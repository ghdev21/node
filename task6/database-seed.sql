CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    title character varying NOT NULL,
    description character varying NOT NULL,
    price integer NOT NULL,
    code character varying NOT NULL UNIQUE
);

INSERT INTO products (title, description, code, price) VALUES
('OAKLEY', 'Narrow - Universal Fit', 'OA234', 234),
('TIFANY', 'Narrow - Universal Fit', 'TI130', 1300),
('CHANEL RECTANGLE SUNGLASSES CH5488', 'Wide', 'CH963', 963),
('PRADA RUNWAY', 'Regular - Adjustable Nosepads', 'GU234', 1000),
('GUCCI', 'Narrow - Universal Fit', 'PR535', 234),
('FENDI', 'Regular - Adjustable Nosepads', 'FE370', 370);
