/*fonction update
"update documents" dans la doc
SUPPRESSION
on copie l'object _id que l'ont veut supprimer*/

db.films.remove({"titre": "Matrix"}, {justOne: true})

//fonction mise à jour
//nb : la fonction maj ne va pas créer une nouvelle instance si celle pasée en paramètre n'existe pas. ex:

db.films.updateOne({"titre": "la grande vadrouille"}, {$set: {"duree": 66}, $currentDate: {lastModified: true}})

//ne fait rien

db.films.updateOne({"titre": "Matrix Reloaded"}, {$set: {"acteurs.1.name": "Delmas", "acteurs.1.firstName": "Jean-Pierre"}})

//fonctionne, de plus on a appris plein de choses ^^ :
//comment acceder a un sous dossier
//que les dossiers sont agencés celon un tableau de valeurs allant de 0 a ...

db.films.updateMany({$and: [{"titre": {$ne: null}, "duree": {$ne: null}, "acteurs": {$ne: null}}]}, {$set: {"rating": "over 9000"}})

//ajoute un parametre supplémentaire
//doc : field update operators

db.films.update({"titre": "Matrix Reloaded"}, {$set: {"annee_sortie": ""}})

//une autre methode pour faire la même chose

//unset va supprimer la valeur a l'interieur d'un paramètre existant

// IMPORTANT !!!
// ces methodes sont désormais interdites : update(), insert(), remove()
// on utilise les methodes : updateOne()/updateMany(), insertOne()/insertMany(), deleteOne()/deleteMany()

//indexes
db.restaurants.createIndex({"borough": 1})
//crée un index pour trier les restos par ordre alphabétique
db.restaurants.getIndexes()
//pour voir les indexes
db.restaurants.dropIndex({"borough": 1})
//suppression d'un index
//pour plus d'infos checker la doc

db.restaurants.createIndex({"borough": 1, "name": 1})
db.restaurants.dropIndex("borough_1_name_1")

//les indexes sont à utiliser sur la methode sort(), ca permet de rendre mongobs plus efficace en affinant la recherche
//il stock une petite partie de la collection, ca accelère donc le processus

//MQL : MongoDB Query Language
//Cursor, collection, database... bien comprendre ces termes

/*ETAPES ("stages")
$match() conforme à 
$group() cf plus bas
$limit() cb de resutats a choper
$sort() trie
$project() montrer que un certain champ
$geoNear() utilisation des points geographiques
$count() compter
$skip() sauter des resultats

OPERATEURS ("operators")
$avg() moyenne
$max() valeur max
$and()
$or()
$not()
$eq()
$lt() 
$lte()
$gt()
$gte()
$sum() somme

UTILISATION :
syntaxe : 
*/
db.piscines.aggregate([
    {$match: {"zipCode": 75015}},
    {$sort: {"name": 1}},
    {$group: {"_id": "$zipCode", "number": {$sum:1}}},/*ici le $group va regrouper les resulats par valeur de zipCode (d'ou le $zipCode)
    puis va les compter et afficher le nombre de chaque piscine de chaque arrondissment (cf photo)*/
    {$sort: {"Nombre total de piscines dans cet arr": -1}},/*trié par le nb de pscines decroissant*/
    {$limit: 1},/*juste l'arr avec le plus de piscines*/
    {$project: {"_id": 0}}
])

//addFields

db.piscines.aggregate([
    {$match: {"zipCode": 75013}},
    {$addFields: {"acces_handicape": true}},/*ATTENTION!!! $addFields ajoute des champs à la réponse -> ne met pas à jour 
    la collection: necessite un $merge à la fin. Il est possible d'utiliser $set pour modifier la collection directement*/
    {$merge: {into: "piscines", on: "_id", whenMatched: "merge", whenNotMatched: "insert"}}
])

db.piscines.aggregate([
    {$match: {"zipCode": 75013}},
    {$unset : "acces_handicape"}
])
//***************************************************************************************************************************
/*POINTS DE COURS
1)Mettre à jour la collection avec une aggregation
2)Le stage d'agrégation $geoNear
    a-Compréhension, creation et utilisaton de l'index de type "2D" et "2Dsphere"
    b-Utilisation de $geoNear pour filter des documents par leur position déospaciale*/
//1)
//Fonctionnement de $merge :
// {$merge: {into: <>,
//          on : "_id",
//          whenMatched: "replace",
//          whenNotMatched: "fail" ou "insert"
//          }
// }
//Utilisation d'un pipeline d'agégation dans une methode upadateMany:

/******************************** EXEMPLES ********************************/

// Utilisation d'un pipeline d'agrégation dans une méthode updateMany :
db.piscines.updateMany(
    {"zipCode": 75015},
    [
      {
        $addFields: {
        "test": true,
        "trial": "passed"
        }
      }
    ]
)
  
db.piscines.find({"zipCode": {$lte: 75013}}).pretty()
  
db.piscines.find({$expr: {$lt: ["$lon", 2.37] }}).count()
  
db.piscines.find({$expr: {
    $and: [
      {$lt: ["$lon", 2.37]},
      {$gt: ["$lat", 48.83]}
    ]
  }}).count()
  
db.piscines.find({"lon": {$lt: 2.37}}).count()
  
// OU BIEN, avec simplement un pipeline d'agrégation :
var aggregationResult = db.piscines.aggregate(
    [
      {$match: {"zipCode": 75015}},
      {
        $addFields: {
        "test": false,
        "trial": "failed"
        }
      },
      {$merge: {
        into: "piscines",
        on: "_id",
        whenMatched: "replace", // L'option par défaut "merge" ne modifie pas le document original
        whenNotMatched: "insert"
      }}
    ]
)
print("aggregationResult: ", aggregationResult); // On peut tout à fait stocker les documents retournés par le pipeline d'agrégation dans une variable.
  
db.piscines.aggregate(
    [
      {$group: {
        _id: {zipCode: "$zipCode", lat: "$lat"},
        "Nombre de piscines dans cet arrondissement": {$sum: 1}
      }},
      {$sort: {"Nombre de piscines dans cet arrondissement": -1}}
    ]
)
  
/******************************** EXEMPLES ********************************/  
/*NOTES SUR GEONEAR
$near (check doc)
$geoNear aggregation pipeline stage : renvoie les documents classés par ordre de proximité, du plus proche au plus éloigné, 
par rapport à un point géospacial donné.
création d'un index OBLIGATOIRE

$near : 
But : calculer la distance entre deux pts dans l'espace en s'appuyant sur leur coordonnees (longitude et latitude)
ATTENTION : requiert la création préalable d'un index "2d" ou "2dsphere" pour fonctionner!!!
db.coll.createIndex({<champGeoJSON> : {type: "Point", coordinates : <lon><lat>}})
syntaxe: 
{$near :{
    $geometry: {
        type : "point", (ou autre, voir doc)
        coordinates : [<lon><lat>]
    },
    [options]
}}
*/
/*******************************NOTES DE COURS 14/10******************************************************/
/*
1) $setOnInsert : définir les infos d'un nouveau document...
updateMany({"zipCode": 75013}, {$set: {"propre": true}}, {upsert : true})
                              -> $setOnInsert : {"name": "toto", "city": "Paris"}
2) Validator (ex 14)
a) $jsonSchema : validation des données à partir d'un document json
b) avec expression : validation des données à partir d'une expression
EX: */
db.createCollection("contacts", 
  {validator: 
    {$or: 
      [
        {"phone": {$type: "string"}},
        {"email": {$type: "string"}},
        {"status": {$in : []}}
      ]
    }
  }
)
/*
3) Mongo Charts : demarrage et utilisations (heatmap)
Le truc qu'on a fait sur atlas avec la database france collection cinema
*/