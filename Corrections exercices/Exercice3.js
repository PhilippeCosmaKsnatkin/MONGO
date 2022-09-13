/* Les opérateurs de requête */

// DANS LA COLLECTION "piscines" DE LA BASE DE DONNEES "paris", TROUVER EN UTILISANT LES OPERATEURS DE REQUETE...
// https://docs.mongodb.com/manual/reference/operator/

// QUESTION 1 : LES PISCINES QUI SONT SITUEES DANS LE 13ème ARRONDISSEMENT :

db.piscines.find({"zipCode": {"$eq": 75013}}).count()

// QUESTION 2 : UNIQUEMENT LE NOM DES PISCINES DE PARIS :

db.piscines.find({"$and": [{"zipCode": {"$gt": 75011}}, {"zipCode": {"$lt": 75013}}]})

db.piscines.find({"zipCode": 75013}, {"name": 1, "_id": 0})

// QUESTION 3 : LES PISCINES QUI NE SONT PAS SITUEES DANS LE 13ème ARRONDISSEMENT :
// indice : utilisez opérateur not equal : $ne

db.piscines.find({"zipCode": {"$ne": 75013}}).count()

// QUESTION 4 : UNIQUEMENT LE NOM DES PISCINES QUI NE SONT PAS SITUEES DANS LE 13ème ARRONDISSEMENT :

db.piscines.find({"zipCode": {"$ne": 75013}}, {"name": 1, "_id": 0}).count()


// QUESTION 5-a : LA MEME CHOSE EN UTILISANT L'OPERATEUR $or :

db.piscines.find({ $or: [  {"zipCode": 75013}, {"zipCode": {$eq: 75014}}  ]  }, {"name": 1, "_id": 0})

// QUESTION 5-b : LA MEME CHOSE EN UTILISANT L'OPERATEUR $in :

db.piscines.find({ "zipCode": { $in: [75013, 75014]  }  }).count()

// QUESTION 6 : LES PISCINES QUI NE SONT PAS SITUEES DANS LES 15ème, 16ème, 17ème ET 18ème ARRONDISSEMENTS :

db.piscines.find({ "zipCode": {$nin: [75015, 75016, 75017, 75018]}}).count()
db.piscines.find({  $nor: [  {"zipCode": {$in: [75015,75016]}}, {"zipCode": {$in: [75017,75018]}}  ]  }).count()
db.piscines.find({  $nor: [  {"zipCode": {$eq: 75015}}, {"zipCode": {$eq: 75016}}, {"zipCode": {$eq: 75017}}, {"zipCode": {$eq: 75018}}  ]  }).count()

// QUESTION 6-a : EN LES TRIANT PAR CODE POSTAL PAR ORDRE DECROISSANT :
// indice : dans mongo, un tri ascendant se fait avec {<champ> : 1} et un tri descendant avec {<champ> : -1}.

db.piscines.find({ "zipCode": {$nin: [75015, 75016, 75017, 75018]}}, {"zipCode": 1, "_id": 0}).sort({"zipCode": -1})

// QUESTION 7 : LES PISCINES DONT LE CODE POSTAL EST SUPERIEUR OU EGAL A 75013, TRIEES PAR CODE POSTAL PAR ORDRE DECROISSANT :

db.piscines.find({ "zipCode": {$gte: 75013}  }, {"zipCode": 1, "_id": 0}).sort({"zipCode": -1})

// QUESTION 8 : LES PISCINES SITUEES A L'OUEST DE NOTRE DAME DE PARIS :
// Coordonnées de Notre Dame : longitude : 2,35 / latitude : 48,853
// A l'ouest = dont la longitude est inférieure à 2,35

db.piscines.find({ "lon": { $lt: 2.35}  }, { "lon": 1, "_id":0, "name": 1}).sort({"lon": -1}).limit(2)

// QUESTION 8-a : AINSI QUE LEUR NOMBRE :

db.piscines.find({ "lon": { $lt: 2.35}  }, { "lon": 1, "_id":0, "name": 1}).count()

// QUESTION 9 : LES PISCINES DONT LE "zipCode" EST 75013 ET L'"id" EST 2929 AVEC LES OPERATEURS $and ET $eq :

db.piscines.find(
  {
    $and: [
      {"zipCode": { $eq: 75013 }},
      {"id": {$eq: 2929 }}
    ]
  }
)
  .count()

// QUESTION 9-a : QUE L'ON PEUT SIMPLIFIER EN UTILISANT UNIQUEMENT L'OPERATEUR $and :

db.piscines.find( {  $and: [  {"zipCode": 75013}, {"id": 2929}  ]  } ).count()

// QUESTION 9-b : OU DE MANIERE ENCORE PLUS COURTE :

db.piscines.find( {"zipCode": 75013, "id": 2929}).count()