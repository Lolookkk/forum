//« J'importe → je charge → je construis → j'écoute → j'exporte. »

// Importer Pool depuis pg
const { Pool } = require('pg')

// Charger les variables .env
require('dotenv').config();

// Créer une connexion à PostgreSQL avec Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Réagir quand une connexion est établie
pool.on('connect', () => {
  console.log('onnecté à la base de données PostgreSQL (Supabase)');
});

// Exporter pool pour pouvoir l'utiliser ailleurs
module.exports = pool;