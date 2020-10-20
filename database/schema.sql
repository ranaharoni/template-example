CREATE TABLE IF NOT EXISTS items (
    id uuid,
    title TEXT NOT NUll,
    done BOOLEAN DEFAULT false,
    sort SMALLSERIAL,
    PRIMARY KEY (id)
)