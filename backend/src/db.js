const { Pool } = require('pg');
const format = require('pg-format');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Set a timeout for queries
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey-patch the query method to log
  client.query = (...args) => {
    return originalQuery.apply(client, args);
  };

  // Monkey-patch the release method to clear timeout
  client.release = () => {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
}

/**
 * Execute queries in a transaction
 * @param {function} callback - Function containing queries
 * @returns {Promise} Transaction result
 */
async function transaction(callback) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Build INSERT query with multiple rows
 * @param {string} table - Table name
 * @param {array} columns - Column names
 * @param {array} rows - Array of row values
 * @returns {string} Formatted SQL query
 */
function buildInsert(table, columns, rows) {
  return format(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES %L RETURNING *`,
    rows
  );
}

/**
 * Build UPDATE query
 * @param {string} table - Table name
 * @param {object} data - Data to update
 * @param {object} where - WHERE conditions
 * @returns {object} Query text and params
 */
function buildUpdate(table, data, where) {
  const sets = [];
  const params = [];
  let paramIndex = 1;

  Object.keys(data).forEach((key) => {
    sets.push(`${key} = $${paramIndex}`);
    params.push(data[key]);
    paramIndex++;
  });

  const whereClauses = [];
  Object.keys(where).forEach((key) => {
    whereClauses.push(`${key} = $${paramIndex}`);
    params.push(where[key]);
    paramIndex++;
  });

  return {
    text: `UPDATE ${table} SET ${sets.join(', ')} WHERE ${whereClauses.join(' AND ')} RETURNING *`,
    params,
  };
}

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connected
 */
async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

module.exports = {
  query,
  getClient,
  transaction,
  buildInsert,
  buildUpdate,
  testConnection,
  pool,
};
