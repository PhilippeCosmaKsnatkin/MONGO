/* LES RESTAURANTS DE NEW YORK */

// Créer une base de données newyork et une collection restaurants
// Importer le fichier restaurant.json
// sur PC : Se mettre dans le dossier où il se trouve l'executable mongoimport

`mongoimport --db newyork --collection restaurants --file "C:\Users\virtuoworks\Desktop\Mongo\Données\restaurants.json"`

// SE PLACER DANS LA BASE DE DONNEES 'newyork' :
`use newyork`


// QUESTION 1 : COMBIEN Y A-T-IL DE RESTAURANTS DANS LA COLLECTION ?

db.restaurants.count()
db.restaurants.find().count()

// QUESTION 2 : COMMENT TROUVER LES RESTAURANTS QUI SONT SITUES DANS LA RUE "Morris Park Ave" :

db.restaurants.find({ "address.street" :  "Morris Park Ave"}).pretty()

// QUESTION 2-a : AVEC EN PLUS CEUX QUI SE SITUENT DANS LA RUE "Morris Park Avenue" ?
// Attention ici, bien que l'on souhaite obtenir les restaurants dont l'adresse est Morris Park Avenue
// AINSI QUE ceux dont l'adresse est Morris Park Ave, c'est bien l'opérateur $or qu'il faut utiliser,
// et non pas $and...
db.restaurants.find(
  { $or: [
      {"address.street" :  "Morris Park Ave"},
      {"address.street": "Morris Park Avenue"}
    ]
  }, {"name": 1, "address.street": 1, "_id": 0}
).pretty()

// Si l'on souhaite trier les résultats par order alphabétique avec d'autres paramètres de tri, on peut écrire la requête suivante :
db.restaurants.find(
    { "address.street" :  /morris park av/gmi},
    {"name": 1, "address.street": 1, "_id": 0}
  ).collation(
    {
      "locale": "fr",
      "caseFirst": "upper",
      "numericOrdering": true,
    }
  ).sort({"name": 1}).pretty().limit(10)

  // Plus d'infos à propos de la collation dans le shell mongo ici : https://docs.mongodb.com/manual/reference/method/cursor.collation/#mongodb-method-cursor.collation
  // Plus d'infos à propos de la collation avec le driver nodejs ici : https://docs.mongodb.com/drivers/node/current/fundamentals/collations/#collation-parameters

// QUESTION 2-b : COMMENT RETROUVER CES DEUX RESULTATS EN UTILISANT SIMPLEMENT UNE REGEXP (ET EVENTUELLEMENT LES ORTHOGRAPHES ALTERNATIVES EN MINUSCULES VIA LE FLAG "i" (insensitive)) ?

// réponse au-dessus dans celle de la question précédente.

// QUESTION 3 : COMMENT AFFICHER UNIQUEMENT (SANS "_id") LES CHAMPS "borough", "cuisine" et "address" ?

db.restaurants.find(
  { "address.street" :  /morris park av/gmi},
  {"borough": 1, "cuisine": 1, "address": 1, "_id": 0}
).collation(
  {
    "locale": "fr",
    "caseFirst": "upper",
    "numericOrdering": true,
  }
).sort({"name": 1}).pretty()

// QUESTION 4 : COMMENT TROUVER LA LISTE DES RESTAURANTS SITUES A "Staten Island" ET QUI FONT DES "hamburgers" OU de la "bakery" ?
// QUESTION 4-a : AVEC L'OPERATEUR $or :

db.restaurants.find({
  "$and" : 
      [
          { "borough" : "Staten Island"},
          { 
              "$or" : 
                  [
                      { "cuisine" : /bakery/i},
                      { "cuisine" : /hamburger/i}
                  ]
          }
      ]
}).pretty()

// QUESTION 4-b : AVEC UN $and IMPLICITE :

db.restaurants.find({ 
  "borough" : "Staten Island",
  "$or" : 
      [
          { "cuisine" : /bakery/i},
          { "cuisine" : /hamburger/i}
      ]
}).pretty()

// QUESTION 4-c : AVEC L'OPERATEUR $in :

db.restaurants.find({ 
  "borough" : "Staten Island",
  "cuisine" : { "$in" : [ /bakery/i , /hamburger/i] }
}).pretty().limit(3)

// LA VARIABLE "restaurants", QUI REPRESENTE LA COLLECTION, EST UN OBJET. MONGODB Y FAIT REFERENCE PAR LE TERME "cursor" (curseur, en français).
const allRestaurants = db.restaurants.find().limit(10);

// QUESTION 5 : COMMENT PARCOURIR UN CURSEUR VIA UNE BOUCLE while ?
// On peut ici utiliser la méthode javascript hasNext() qui permet de déterminer si le cursor contient
// encore des documents ou non : https://docs.mongodb.com/manual/reference/method/cursor.hasNext/

while (allRestaurants.hasNext()) {
  print(tojson(allRestaurants.next()));
}

// QUESTION 6 : COMMENT PARCOURIR UN CURSEUR VIA UNE BOUCLE forEach ?

allRestaurants.forEach(oneRestaurant =>{
    print( oneRestaurant.name + " - ID : " + oneRestaurant._id + " - Cuisine : " + oneRestaurant.cuisine)
})

// QUESTION 7 : QUEL EST LE TYPE DE RESTAURANT LE PLUS REPRESENTE ?
// Vous pouvez le faire en vanillaJS

let cuisines = []

allRestaurants.forEach(oneRestaurant =>{
    if(cuisines.indexOf(oneRestaurant.cuisine) == -1){
        cuisines.push(oneRestaurant.cuisine)
    }
})
// On initialise 2 variables de référence qui stockeront les résultats
let nbRestaurants = 0;
let nameCuisine = "";
// Pour chaque "cuisine", on compare le nombre de restaurants avec la "référence"
cuisines.forEach(oneCuisine => {
    if( db.restaurants.count({ cuisine : oneCuisine }) > nbRestaurants  ){
        // On fait évoluer les variables de référence si la condition est remplie
        nbRestaurants = db.restaurants.count({ cuisine : oneCuisine });
        nameCuisine = oneCuisine;
    }
})
// A la fin, on affiche les variables de résultat
print(nameCuisine)
print(nbRestaurants)

// EN UTILISANT LE PIPELINE D'AGREGATION (que nous verrons en cours la semaine prochaine) :
db.restaurants.aggregate([
  // Filtrer les documents sur lesquels on veut travailler (ici : tous) :
  { $match : {} }, 
  // Regrouper les documents filtrés sur un _id unique :
  { $group : { _id : "$cuisine" , "nbDeRestaurants" : { $sum : 1 } }},
  // Trier les documents :
  { $sort : { "nbDeRestaurants" : -1 } },
  // Limiter le résultat à une entrée :
  { $limit: 1}
])

// Et si on voulait limiter à un quartier, par exemple Staten Island : 
db.restaurants.aggregate([
  { $match : { borough : "Staten Island" } }, 
  { $group : { _id : "$cuisine" , "nbDeRestaurants" : { $sum : 1 } }},
  { $sort : { "nbDeRestaurants" : -1 } },
  { $limit: 1}
])

// Pour en savoir plus sur l'opérateur d'aggrégation $sum : https://docs.mongodb.com/manual/reference/operator/aggregation/sum/