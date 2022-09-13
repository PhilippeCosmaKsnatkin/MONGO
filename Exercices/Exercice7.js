// EXERCICES CONCERNANT LA MISE A JOUR D'UN DOCUMENT

// POINT DE COURS : db.collection.update(query, update, options)

// REVENIR SUR LA BASE DE DONNEES "paris"
`use paris`


// QUESTION 1 : COMMENT AJOUTER UN CHAMP "acces_handicape" ayant pour valeur "true" AUX PISCINES DU 13ème ARRONDISSEMENT ?
db.piscines.updateMany(
    { "zipCode": 75013 },                  // query
    { $set : { "acces_handicape" : true } }   // update
)

// ATTENTION : Par défaut, la méthode update() ne modifie QUE le premier élément qui correspond au critère de recherche

// QUESTION 1-a : COMMENT METTRE A JOUR TOUS LES ELEMENTS EN UTILISANT L'OPTION "multi" à "true" ?

db.piscines.updateMany({},{$set : {"acces_handicape" : true}})

// QUESTION 2 : COMMENT OBTENIR LE MÊME RESULTAT EN UTILISANT LA METHODE updateMany() ?

db.piscines.updateMany({"zipCode": 75013},{$set : {"acces_handicape" : true}})

// QUESTION 3 : COMMENT S'ASSURER QU'UN DOCUMENT SERA INSERE S'IL N'EXISTE PAS DEJA, EN UTILISANT L'OPTION "upsert" (contraction de "update" et "insert") à "true" ?

db.piscines.updateMany({"zipCode": 75099},{$set : {"acces_handicape" : true}},{upsert: true})
db.piscines.insert({"name": "Piscine Dunois"},{upsert: true})

// POINT DE COURS : il est possible de définir et supprimer des champs dans la même requête...
// QUESTION 4 : COMMENT AJOUTER UN CHAMP "verif" A TOUTES LES PISCINES ET SUPPRIMER L'"acces_handicape" ?

db.piscines.updateMany({},{$set : {"verif": true}, $unset: {"acces_handicape":""}})

// QUESTION 4-a : VERIFIER LE RESULTAT DE L'OPERATION :
db.piscines.findOne({zipCode : 75013 })