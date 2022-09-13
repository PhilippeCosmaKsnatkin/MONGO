// Afficher la liste des bdds
`show dbs`
`show databases`

// Comment sélectionner une base de données à utiliser ?
`use videoclub`

// Une bdd de mongo est constituée de collections.
// Les collections contiennent des documents;

// Comment afficher la liste des collections contenues dans la base de données sélectionnée ?
`show collections`


// Quand on tape "use xxxxxxx" dans le terminal, cela nous instancie un objet "db" représentant la base de données sélectionnée.
// Cela nous permet par la suite de taper la commande suivante dans le terminal afin d'accéder à une collection donnée :
`db.<collection>.<method>`

// Sur une base de données, il y a 4 types d'opération : les opérations CRUD
/*
C reate     : pour insérer des documents            - méthode insert()
R ead       : pour lire des documents               - méthode find()
U pdate     : pour mettre à jour des documents      - méthode update()
D elete     : pour supprimer des documents          - méthode remove()*/



// Pour insérer un document dans la collection films de la bdd videoclub, on utilise la méthode .insert() sur la collection dans laquelle on souhaite insérer un document :

db.films.insert(
  {
    "titre": "Matrix",
    "duree": 210,
  }
)

  db.films.insert(   { "_id" : ObjectId("615426ed6b0e8ab24f6c9ad2"),  "titre": "Matrix", "duree": 210  }   ) // Renvoie une erreur
  
// Pour trouver tous les films, on utilise la méthode .find() sur la collection contenant les films :

db.films.find().pretty()

// Pour faire des insertions multiples, on passe un tableau d'objets à notre méthode insert() au lieu d'un simple objet :

db.films.insert(
  [  
    {
      "titre": "Matrix",
      "duree": 210,
    },
    {
      "titre": "Star Wars",
      "duree": 165
    }
  ]
)

db.films.find().count()
db.films.count()

// Le client mongo est une console js. Par conséquent, on peut tout à fait utiliser des variables comme valeurs pour une insertion :

const today = new Date().toLocaleDateString('fr-FR');

db.films.insert({
  "titre": "Test variables",
  "duree": today
})

// On a une méthode qui présente correctment un document dans une collection :

db.films.findOne({}, {"name": 0, "id": 0})
db.films.findOne()

// Une notion importante de MongoDB est celle de sous-document embarqué (embedded document) :

db.films.insert({
  "titre": "Matrix Reloaded",
  "duree": 172,
  "acteurs": [
    {
      "name": "Reeves",
      "firstName": "Keanu"
    },
    {
      "name": "Depardieu",
      "firstName": "Gérard"
    }
  ],
  "realisateurs": [
    {
      "name": "Wachowsky",
      "firstName": "Lilly"
    }
  ],
  "annee_sortie": 2000
})

db.films.find(  {  "titre": "Matrix", "duree": 210  }, {"titre": 1, "_id": 0}  ).pretty()

// La commande cls (clear screen) permet de vider la console

cls

/*
1. db.createCollection('restaurants')
2. db.restaurants.insert({borough: "Bronx",cuisine: "Bakery",grades: [{ date:"06/09/2021", grade: "A", score: 2 },{ date: "16/10/2021", grade: "A", score: 6 }],name: "Morris Park Bake Shop"});
3. db.restaurants.find()
4a. db.restaurants.update({borough:"Bronx"},{$set:{address: {building: "1007",coord: [ -73.856077, 40.848447 ],street: "Morris Park Ave",zipcode: "10462"}}})
+4b. db.restaurants.update({borough:"Bronx"},{$push:{grades: [{ "date": "25/10/2021", "grade": "A", "score": 10 },{ "date": "01/12/2021", "grade": "A", "score": 9 },{ "date": "26/01/2022", "grade": "B", "score": 14 }]}}
5. db.restaurants.find({"address.zipcode":"10462"})
6. db.restaurants.find({"grades.date":{$regex:"2022"})
7. db.restaurants.insert({"address":{"building":"469","coord":[-73.961704, 40.662942],"street":"Flatbush Avenue","zipcode":"11225"},"borough":"Brooklyn","cuisine":"Hamburgers","grades":[{"date":{"$date":1419897600000},"grade":"A","score":8},{"date":{"$date":1404172800000},"grade":"B","score":23},{"date":{"$date":1367280000000},"grade":"A","score":12},{"date":{"$date":1336435200000},"grade":"A","score":12}],"name":"Wendy'S","restaurant_id":"30112340"},{"address":{"building":"351","coord":[-73.98513559999999,40.7676919],"street":"West 57 Street","zipcode":"10019"},"borough":"Manhattan","cuisine":"Irish","grades":[{"date":{"$date":1409961600000},"grade":"A","score": 2},{"date":{"$date":1374451200000},"grade":"A","score":11},{"date":{"$date":1343692800000},"grade":"A","score":12},{"date":{"$date":1325116800000},"grade":"A","score":12}],"name":"Dj Reynolds Pub And Restaurant","restaurant_id":"30191841"})
8. db.restaurants.find({name:/^M/})
9. db.restaurants.find().count()
10. db.restaurants.find({cuisine:"Irish"})
11. db.restaurants.find().sort({name:1})

*/