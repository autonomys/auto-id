CREATE TABLE zkp_claims (
    uuid VARCHAR(255) PRIMARY KEY,
    auto_id VARCHAR(255) NOT NULL,
    claim JSON NOT NULL
);
