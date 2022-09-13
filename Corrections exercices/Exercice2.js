/*Les piscines de Paris */

// Importer nos documents dans une base de données paris, dans une collection, depius le fichier piscines_paris.json
`mongoimport --db <nom_de_la_db> --collection <nom_de_la_collection> --file <chemin/vers/le/fichier/a/importer>`

// Dans mon cas : 
`mongoimport --db paris --collection piscines --file "C:\Users\virtuoworks\Desktop\Cours mongodb\Données\piscines_paris.json"`

// Sur PC : il est dans C:\Program Files\MongoDB\Server\4.4\bin
// Sur mac : il est dans /usr/local/opt/mongodb-database-tools/bin/
`show dbs `
`use paris`
`show collections`


// QUESTION 1 : COMMENT COMPTER LE NOMBRE D'ELEMENTS CONTENUS DANS LA COLLECTION PISCINES ?
db.piscines.find().count()


// QUESTION 1 bis : ET D'UNE MANIERE PLUS CONCISE ? (optionel)
db.piscines.count()



// Intéressons-nous à présent à la méthode find()
// https://docs.mongodb.com/manual/reference/method/db.collection.find/ 

// db.collection.find(query, projection)


// QUESTION 2 : COMMENT FAIRE POUR AFFICHER LA LISTE DES PISCINES DU 11ème ARRONDISSEMENT DE PARIS ?

db.piscines.find({  "zipCode": 75011  }).pretty()

// QUESTION 3 : COMMENT FAIRE POUR N'AFFICHER QUE LES NOM ET CODE POSTAL POUR LES PISCINES DU 11ème ARRONDISSEMENT DE PARIS ?
// indice : il faut utiliser le deuxième argument de la méthode find : la projection.

db.piscines.find({"zipCode": 75011}, {"name": 1, "zipCode": 1, "_id": 0}).pretty()

// Par défaut, le champ _id est présent. Il faut l'exclure explicitement
db.piscines.find(
    { "zipCode" : 75011 },        // query
    { "zipCode" : 1, "name" : 1, "_id" : 0 }   // projection (limiter les champs affichés)
)

// La projection à 0 exclut les champs de l'affichage - les autres sont affichés
db.piscines.find(
    { "zipCode" : 75011 },        // query
    { "zipCode" : 0, "name" : 0, "_id" : 0 }   // projection (limiter les champs affichés)
)

// IMPORTANT : il n'est PAS autorisé de combiner 0 et 1 dans une projection, la seule exception étant "_id" qui peut être paramétré à 0 en même temps qu'un autre champ à 1.

// QUESTION 4 : COMMENT FAIRE POUR LIMITER LES RESULTATS A 5 ?

db.piscines.find().limit(5).pretty()

// QUESTION 5 : COMMENT FAIRE POUR TRIER LES RESULTATS PAR NOM PAR ORDRE ALPHABETIQUE ?

db.piscines.find().sort({  "name": 1  }).limit(3).pretty()

// Pour "sauter" des résultats, on utilise
db.piscines.find().limit(4).skip(3)
db.piscines.find().skip(3).limit(4)

// La requête suivante :
db.piscines.find({ "zipCode" : 75011 })

// est en réalité une manière abrégée d'écrire la requête suivante utilisant l'opérateur d'égalité "$eq" :
db.piscines.find({ "zipCode" : { $eq : 75011 }})

db.piscines.find({"zipCode": 75011, "name": "Piscine de la Cour des Lions"}).pretty()

// Opérateurs logiques
/*$and*/     db.piscines.find({  $and: [  {"zipCode": 75011}, {"name": "Piscine de la Cour des Lions"}  ]  }).pretty() // query 1 ET query 2
/*$or*/      db.piscines.find({  $or: [  {"zipCode": 75011}, {"name": "Piscine de la Cour des Lions"}  ]  }).pretty() // query 1 OU query 2
/*$nor*/     db.piscines.find({  $nor: [  {"zipCode": 75011}, {"name": "Piscine de la Cour des Lions"}  ]  }).pretty() // NI query 1 NI query 2
/*$not*/     db.piscines.find(  {"name": {"$not":  {"$eq": "Piscine de la Cour des Lions"}}  }).count() // db.piscines.count(  {"name": {$not:  {$eq: "Piscine de la Cour des Lions"}}  })  // tout SAUF query
         


// Opérateurs de comparaison
$eq  // résultat correspondant à la valeur de la query ; ex : { "name": { $eq: {"Piscine de la Cour des Lions"} }
$gt  // le résultat de la query sera STRICTEMENT supérieur à la valeur passée à $gt ; ex { "price": {"$gt": 200}} renverra tous les produits dont le prix est STRICTEMENT supérieur à 200
$gte // le résultat de la query sera supérieur OU égal à la valeur passée à $gt ; ex { "price": {"$gt": 200}} renverra tous les produits dont le prix est supérieur OU égal à 200
$lt  // le résultat de la query sera STRICTEMENT inférieur à la valeur passée à $gt ; ex { "price": {"$gt": 200}} renverra tous les produits dont le prix est STRICTEMENT inférieur à 200
$lte // le résultat de la query sera inférieur OU égal à la valeur passée à $gt ; ex { "price": {"$gt": 200}} renverra tous les produits dont le prix est inférieur OU égal à 200
$ne  // le résultat de la query sera tous les documents dont la valeur n'est PAS égale à la valeur passée à $ne ; ex : db.piscines.find({"name": {"$ne": "Piscine de la Cour des Lions"}}).count() renverra toutes les piscines dont le nom N'EST PAS "Piscine de la Cour des Lions"
