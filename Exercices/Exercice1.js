// Afficher la liste des bdds
//show dbs
//show databases

// Comment sélectionner une base de données à utiliser ?
//use videoclub

// UNe bdd de mongo est constituée de collections.
// Les collections contiennent des documents;

// Comment afficher la liste des collections contenues dans la base de données sélectionnée ?
//show collections


// Quand on tape "use xxxxxxx" dans le terminal, cela nous instancie un objet "db" représentant la base de données sélectionnée.
// Cela nous permet par la suite de taper la commande suivante dans le terminal afin d'accéder à une collection donnée :
//db.<collection>.<method>

// Sur une base de données, il y a 4 types d'opération : les opérations CRUD
//C reate     : pour insérer des documents            - méthode insert()
//R ead       : pour lire des documents               - méthode find()
//U pdate     : pour mettre à jour des documents      - méthode update()      
//D elete     : pour supprimer des documents          - méthode delete()


// Pour insérer un document dans la collection films de la bdd videoclub, on utilise la méthode .insert() sur la collection dans laquelle on souhaite insérer un document :

db.films.insert({"titre": "Matrix", "durée": 210})

// insertOne insertMany
// Pour trouver tous les films, on utilise la méthode .find() sur la collection contenant les films :

db.films.find().pretty()
db.films.find({"titre": "Matrix"}).pretty()


// Pour faire des insertions multiples, on passe un tableau d'objets à notre méthode insert() au lieu d'un simple objet :

db.films.insert(
    [
        {
            "titre": "Matrix",
            "durée": 210,
        },
        {
            "titre": "Star Wars",
            "durée": 165,
        }
    ]
)

db.films.find().count()

// Le client mongo est une console js. Par conséquent, on peut tout à fait utiliser des variables comme valeurs pour une insertion :

const today = new Date().toLocaleDateString('fr-FR');
db.films.insert({
    "titre": "Test",
    "durée": today
})


// On a une méthode qui présente correctment un document dans une collection :

db.films.findOne()
db.films.findOne({}, {"titre": 1, "id": 0})

// Une notion importante de MongoDB est celle de sous-document embarqué (embedded document) :

db.films.insert({
    "titre": "Matrix Reloaded",
    "durée": 135,
    "acteurs": [
        {
            "name": "Reeves",
            "firstname": "Keanu"
        },
        {
            "name": "Depardieu",
            "firstname": "Gérard"
        }
    ],
    "réalisateurs": [
        {
            "name": "Wachowsky",
            "firstname": "Lilly"
        }
    ],
    "année de sortie": 2000
})

// La commande cls (clear screen) permet de vider la console
