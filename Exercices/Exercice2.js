/*Les piscines de Paris */

// Importer nos documents dans une base de données paris, dans une collection, depius le fichier piscines_paris.json
`mongoimport --db <nom_de_la_db> --collection <nom_de_la_collection> --file <chemin/vers/le/fichier/a/importer>`

// Dans mon cas : 
`db`

// Sur PC : il est dans C:\Program Files\MongoDB\Server\4.4\bin
// Sur mac : il est dans /usr/local/opt/mongodb-database-tools/bin/
`show dbs `
`use paris`
`show collections`


// QUESTION 1 : COMMENT COMPTER LE NOMBRE D'ELEMENTS CONTENUS DANS LA COLLECTION PISCINES ?

db.piscines.count()

// QUESTION 1 bis : ET D'UNE MANIERE PLUS CONCISE ? (optionel)



// Intéressons-nous à présent à la méthode find()
// https://docs.mongodb.com/manual/reference/method/db.collection.find/ 

// db.collection.find(query, projection)


// QUESTION 2 : COMMENT FAIRE POUR AFFICHER LA LISTE DES PISCINES DU 11ème ARRONDISSEMENT DE PARIS ?

> db.piscines.find({"zipCode": 75011}).pretty()

// QUESTION 3 : COMMENT FAIRE POUR N'AFFICHER QUE LES NOM ET CODE POSTAL POUR LES PISCINES DU 11ème ARRONDISSEMENT DE PARIS ?
// indice : il faut utiliser le deuxième argument de la méthode find : la projection.

> db.piscines.find({"zipCode": 75011}, {"name": 1, "_id": 0, "zipCode": 1}).pretty()

// Par défaut, le champ _id est présent. Il faut l'exclure explicitement
db.piscines.find(
    { zipCode : 75011 },        // query
    { zipCode : 1, name : 1, _id : 0 }   // projection (limiter les champs affichés)
)

// La projection à 0 exclut les champs de l'affichage - les autres sont affichés
db.piscines.find(
    { zipCode : 75011 },        // query
    { zipCode : 0, name : 0, _id : 0 }   // projection (limiter les champs affichés)
)

// IMPORTANT : il n'est PAS autorisé de combiner 0 et 1 dans une projection, la seule exception étant "_id" qui peut être paramétré à 0 en même temps qu'un autre champ à 1.

// QUESTION 4 : COMMENT FAIRE POUR LIMITER LES RESULTATS A 5 ?

db.piscines.find().limit(5)

// QUESTION 5 : COMMENT FAIRE POUR TRIER LES RESULTATS PAR NOM PAR ORDRE ALPHABETIQUE ?

db.piscines.find().sort({"name": 1}).pretty()
//db.piscines.find().sort({"name": -1}).pretty() pour un tri decroissant

// Pour "sauter" des résultats, on utilise
db.piscines.find().limit(4).skip(3)
db.piscines.find().skip(3).limit(4)

// La requête suivante :
db.piscines.find({ zipCode : 75011 })

// est en réalité une manière abrégée d'écrire la requête suivante utilisant l'opérateur d'égalité "$eq" :
db.piscines.find({ zipCode : { $eq : 75011 }})
//opérateurs logiques
/*$and    $or     $nor        $not */ 
/*et      ou      ni...ni...  non*/
//opérateurs de comparaison
//$eq       $gt     $gte    $in     $lt     $lte    $ne     $nin
//=         >       >=      dans    <       <=      !=      not dans
