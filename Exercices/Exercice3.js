/* Les opérateurs de requête */

// DANS LA COLLECTION "piscines" DE LA BASE DE DONNEES "paris", TROUVER EN UTILISANT LES OPERATEURS DE REQUETE...
// https://docs.mongodb.com/manual/reference/operator/

// QUESTION 1 : LES PISCINES QUI SONT SITUEES DANS LE 13ème ARRONDISSEMENT :

db.piscines.find({"zipCode": {$eq: 75013}}).pretty()

// QUESTION 2 : UNIQUEMENT LE NOM DES PISCINES DE PARIS :

db.piscines.find({}, {"name": 1, "_id": 0}).pretty()

// QUESTION 3 : LES PISCINES QUI NE SONT PAS SITUEES DANS LE 13ème ARRONDISSEMENT :
// indice : utilisez opérateur not equal : $ne

db.piscines.find({"zipCode": {$not: {$eq: 75013 }}})
db.piscines.find({"zipCode": {$ne: 75013}}).count()

// QUESTION 4 : UNIQUEMENT LE NOM DES PISCINES QUI NE SONT PAS SITUEES DANS LE 13ème ARRONDISSEMENT :

db.piscines.find({"zipCode": {$not: {$eq: 75013 }}}, {"name": 1, "_id": 0})

// QUESTION 5 : LES PISCINES QUI SONT SITUEES DANS LE 13ème OU le 14ème ARRONDISSEMENT :

db.piscines.find({$or: [{"zipCode": 75013 }, {"zipCode": 75014}]}).pretty()

// QUESTION 5-b : LA MEME CHOSE EN UTILISANT L'OPERATEUR $in :

db.piscines.find({"zipCode": {$in: [75013, 75014]}}).pretty()

// QUESTION 6 : LES PISCINES QUI NE SONT PAS SITUEES DANS LES 15ème, 16ème, 17ème ET 18ème ARRONDISSEMENTS :

db.piscines.find({"zipCode": {$nin: [75015, 75016, 75017, 75018]}}).pretty()

// QUESTION 6-a : EN LES TRIANT PAR CODE POSTAL PAR ORDRE DECROISSANT :
// indice : dans mongo, un tri ascendant se fait avec {<champ> : 1} et un tri descendant avec {<champ> : -1}.

db.piscines.find({"zipCode": {$nin: [75015, 75016, 75017, 75018]}}).sort({"zipCode": -1}).pretty()

// QUESTION 7 : LES PISCINES DONT LE CODE POSTAL EST SUPERIEUR OU EGAL A 75013, TRIEES PAR CODE POSTAL PAR ORDRE DECROISSANT :

db.piscines.find({"zipCode": {$gte: 75013}}).sort({"zipCode": -1}).pretty()

// QUESTION 8 : LES PISCINES SITUEES A L'OUEST DE NOTRE DAME DE PARIS :
// Coordonnées de Notre Dame : longitude : 2,35 / latitude : 48,853
// A l'ouest = dont la longitude est inférieure à 2,35

db.piscines.find({"lon": {$lt: 2.35}}).sort({"zipCode": -1})

// QUESTION 8-a : AINSI QUE LEUR NOMBRE :

db.piscines.find({"lon": {$lt: 2.35}}).sort({"zipCode": -1}).count()

// QUESTION 9 : LES PISCINES DONT LE "zipCode" EST 75013 ET L'"id" EST 2929 AVEC LES OPERATEURS $and ET $eq :

db.piscines.find({$and: [{"zipCode": 75013},{"id": 2929}]}).pretty()

// QUESTION 9-a : QUE L'ON PEUT SIMPLIFIER EN UTILISANT UNIQUEMENT L'OPERATEUR $and :



// QUESTION 9-b : OU DE MANIERE ENCORE PLUS COURTE :

db.piscines.find({"zipCode": 75013, "id": 2929}).count()
// Syntaxe "et" implicite