/* LES RESTAURANTS DE NEW YORK */

// Créer une base de données newyork et une collection restaurants
// Importer le fichier restaurant.json
// sur PC : Se mettre dans le dossier où il se trouve l'executable mongoimport

`mongoimport --db newyork --collection restaurants --file "C:\Users\virtuoworks\Desktop\Mongo\Données\restaurants.json"`

// SE PLACER DANS LA BASE DE DONNEES 'newyork' :
`use newyork`
db.restaurants.findOne()


// QUESTION 1 : COMBIEN Y A-T-IL DE RESTAURANTS DANS LA COLLECTION ?

db.restaurants.find().count() /*25359*/

// QUESTION 1-a : QUE L'ON PEUT EGALEMENT ECRIRE :



// QUESTION 2 : COMMENT TROUVER LES RESTAURANTS QUI SONT SITUES DANS LA RUE "Morris Park Ave" :

db.restaurants.find({"address.street": {$regex: /^Morris Park Ave$/, $options: 'gmi'}}, {"name": 1, "address.street": 1, "_id": 0}).pretty() /*36*/

// QUESTION 2-a : ET CEUX QUI SE SITUENT DANS LA RUE "Morris Park Avenue" ?

db.restaurants.find({"address.street": {$regex: /Morris Park Avenue/, $options: 'gmi'}}, {"name": 1, "address.street": 1, "_id": 0}).pretty()

// QUESTION 2-b : COMMENT RETROUVER CES DEUX RESULTATS EN UTILISANT SIMPLEMENT UNE REGEXP (ET EVENTUELLEMENT LES ORTHOGRAPHES ALTERNATIVES EN MINUSCULES VIA LE FLAG "i" (insensitive)) ?

db.restaurants.find({"address.street": {$regex: /Morris Park Ave/, $options: 'gmi'}}, {"name": 1, "address.street": 1, "_id": 0}).pretty()

// QUESTION 3 : COMMENT AFFICHER UNIQUEMENT (SANS "_id") LES CHAMPS "borough", "cuisine" et "address" ?

db.restaurants.find({}, {"borough": 1, "cuisine": 1, "address": 1, "_id": 0}).pretty()

// QUESTION 4 : COMMENT TROUVER LA LISTE DES RESTAURANTS SITUES A "Staten Island" ET QUI FONT DES "hamburgers" OU de la "bakery" ?
// QUESTION 4-a : AVEC L'OPERATEUR $or :

db.restaurants.find({$and:[{"borough": "Staten Island"},{$or : [{"cuisine": /hamburger/i}, {"cuisine": /bakery/i}]} ]}, {"name": 1, "cuisine": 1, "borough": 1, "_id": 0}).pretty()

// QUESTION 4-b : AVEC UN $and IMPLICITE :



// QUESTION 4-c : AVEC L'OPERATEUR $in :



// LA VARIABLE "restaurants", QUI REPRESENTE LA COLLECTION, EST UN OBJET. MONGODB Y FAIT REFERENCE PAR LE TERME "cursor" (curseur, en français).
const allRestaurants = db.restaurants.find().limit(10);

// QUESTION 5 : COMMENT PARCOURIR UN CURSEUR VIA UNE BOUCLE while ?

while (allRestaurants.hasNext()) {
    print(tojson(allRestaurants.next()));
}

// QUESTION 6 : COMMENT PARCOURIR UN CURSEUR VIA UNE BOUCLE forEach ?

allRestaurants.forEach(oneRestaurant =>{
    print( oneRestaurant.name + " - ID : " + oneRestaurant._id + " - Cuisine : " + oneRestaurant.cuisine)
})

// QUESTION 7 : QUEL EST LE TYPE DE RESTAURANT LE PLUS REPRESENTE ?
// Vous pouvez le faire en vanillaJS

//: checker la correction, il y a bcp de détails