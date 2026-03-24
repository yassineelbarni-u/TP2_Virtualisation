
# TP Docker: Visualisation des Capteurs

Ce projet est une application web simple qui affiche les emplacements de capteurs sur une carte. Il est entièrement conteneurisé avec Docker et utilise un backend Node.js, un frontend React, et une base de données MongoDB.

![Description de l'image](images/screenshootC.png)

## Architecture

L'application est composée de trois services principaux définis dans le fichier `docker-compose.yml`:

1.  **`backend`**: Un serveur Node.js/Express qui :
    *   Lit les données de localisation des capteurs à partir d'un fichier CSV (`graph_sensor_locations_bay.csv`).
    *   Insère ces données dans une base de données MongoDB lors du premier démarrage.
    *   Expose une API pour que le frontend puisse récupérer les données des capteurs.

2.  **`frontend`**: Une application React qui :
    *   Récupère les données des capteurs depuis l'API du backend.
    *   Affiche les capteurs sur une carte interactive (utilisant une bibliothèque comme Leaflet ou Google Maps).

3.  **`mongo`**: Une instance de base de données MongoDB pour stocker les informations sur les capteurs. Les données sont persistantes grâce à un volume Docker.

## Prérequis

*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Démarrage de l'application

Pour lancer l'ensemble de l'application, suivez ces étapes :

1.  **Clonez le dépôt** (si ce n'est pas déjà fait) :
    ```bash
    git clone <URL_DU_DEPOT_GIT>
    cd <NOM_DU_DOSSIER>
    ```

2.  **Lancez les conteneurs avec Docker Compose** :
    À la racine du projet, exécutez la commande suivante. Cela va construire les images pour le backend et le frontend, puis démarrer les trois conteneurs.

    ```bash
    docker-compose up --build
    ```

    *   `--build` : Cette option force la reconstruction des images si vous avez fait des modifications dans le code du backend ou du frontend.

3.  **Accédez à l'application** :
    *   Le frontend est accessible à l'adresse : [http://localhost:5173](http://localhost:5173)
    *   Le backend expose son API sur : [http://localhost:8000](http://localhost:8000)

## Fonctionnement du Backend et du Fichier CSV

Le cœur du backend (`backend/server.js`) est responsable de la gestion des données des capteurs.

1.  **Lecture du Fichier CSV** :
    *   Au démarrage, le serveur vérifie si la collection de capteurs dans la base de données MongoDB est vide.
    *   Si elle est vide, il utilise la fonction `LectureCsv` pour lire le fichier `graph_sensor_locations_bay.csv`.
    *   Ce fichier contient les IDs, latitudes et longitudes des capteurs. Chaque ligne est parsée et convertie en un objet JavaScript.

2.  **Insertion en Base de Données** :
    *   Les données parsées à partir du fichier CSV sont ensuite insérées en masse dans la collection `sensors` de la base de données `pems_db` dans MongoDB.
    *   Cette opération n'est effectuée qu'une seule fois pour éviter de dupliquer les données à chaque redémarrage du conteneur.

3.  **API pour les Capteurs** :
    *   Le backend expose une route `GET /api/capteurs`.
    *   Lorsque le frontend appelle cette route, le serveur interroge la collection MongoDB et retourne la liste de tous les capteurs au format JSON.

## Services et Ports

*   **React App (frontend)**: `localhost:5173`
*   **Node API (backend)**: `localhost:8000`
*   **MongoDB**: `localhost:27017` (accessible principalement par le service backend)

## Pour arrêter l'application

Pour arrêter tous les conteneurs, appuyez sur `Ctrl + C` dans le terminal où `docker-compose` est en cours d'exécution, puis exécutez :

```bash
docker-compose down
```

Cette commande arrêtera et supprimera les conteneurs. Si vous souhaitez également supprimer le volume de données MongoDB (attention, toutes les données seront perdues), utilisez :

```bash
docker-compose down -v
```
