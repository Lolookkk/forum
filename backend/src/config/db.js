//« J'importe → je charge → je construis → j'écoute → j'exporte. »

// Importer Pool depuis pg
const { Pool } = require('pg')

// Charger les variables .env
require('dotenv').config();

// Détecter si c'est une connexion locale (sans SSL)
const isLocalhost = process.env.DATABASE_URL?.includes('localhost') || 
                    process.env.DATABASE_URL?.includes('127.0.0.1') ||
                    process.env.NODE_ENV === 'test';

// Configuration SSL conditionnelle
const sslConfig = isLocalhost
    ? false
    : { rejectUnauthorized: false };

// Créer une connexion à PostgreSQL avec Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig
});

// Réagir quand une connexion est établie
pool.on('connect', () => {
  console.log('Connecté à la base de données PostgreSQL');
});

// Exporter pool pour pouvoir l'utiliser ailleurs
module.exports = pool;