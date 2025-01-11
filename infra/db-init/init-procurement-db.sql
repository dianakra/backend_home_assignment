CREATE TABLE IF NOT EXISTS procurements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    items JSON NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    vendorId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO procurements (title, description, items, status, vendorId) VALUES
('Request A', 'Need 100 units of Item X', '[{"itemName":"Item X","quantity":100}]', 'open', 1),
('Request B', 'Need 50 units of Item Y', '[{"itemName":"Item Y","quantity":50}]', 'in-review', 2);


CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    certifications TEXT[],
    rating FLOAT DEFAULT 0
);


INSERT INTO vendors (certifications, rating) VALUES
('{"ISO9001"}', 4.5),
('{"ISO14001"}', 4.0);