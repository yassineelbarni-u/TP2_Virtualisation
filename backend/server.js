const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
//librairie pour lire un fichier CSV ligne par ligne
const csv = require('csv-parser');

const app = express();

const PORT = 8000;
const MONGO_URI = 'mongodb://mongo:27017/';
const DB_NAME = 'pems_db';
const COLLECTION_NAME = 'sensors';
const CSV_FILE = path.join(__dirname, 'graph_sensor_locations_bay.csv');

app.use(cors());

// variable globale pour le client MongoDB et la collection des capteurs
let mongoClient;
let sensorsCollection;

function LectureCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
    // convertir chaque ligne en objet js
      .pipe(csv({ headers: ['sensor_id', 'latitude', 'longitude'] }))
      .on('data', (row) => {
        const latitude = Number(row.latitude);
        const longitude = Number(row.longitude);

        if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
          rows.push({
            sensor_id: String(row.sensor_id),
            latitude,
            longitude,
          });
        }
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

async function initDatabase() {
  // Connexion a MongoDB
  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();

  const db = mongoClient.db(DB_NAME);
  sensorsCollection = db.collection(COLLECTION_NAME);

  const docsCount = await sensorsCollection.countDocuments({});
  if (docsCount === 0) {
    const rows = await LectureCsv(CSV_FILE);
    //inserer les données dans MongoDB
    if (rows.length > 0) {
      await sensorsCollection.insertMany(rows);
    }
  }
}

// Route pour récupérer les données des capteurs
app.get('/api/capteurs', async (_req, res) => {
  try {
    const sensors = await sensorsCollection.find({}, { projection: { _id: 0 } }).toArray();
    // retourner les données des capteurs au format JSON
    return res.json({ data: sensors });
  } catch (error) {
    console.error('Erreur lecture MongoDB:', error);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

// Fermer la connexion MongoDB à l'arrêt du serveur
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Backend demarre sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au demarrage du backend:', error);
    process.exit(1);
  }
}

startServer();
