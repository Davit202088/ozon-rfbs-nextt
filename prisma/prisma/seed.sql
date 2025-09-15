CREATE TABLE IF NOT EXISTS geocode_cache (
  address_hash varchar(64) PRIMARY KEY,
  lat double precision,
  lng double precision,
  provider varchar(32),
  updated_at timestamp default now()
);
