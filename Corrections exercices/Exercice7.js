// EXERCICES CONCERNANT LA MISE A JOUR D'UN DOCUMENT

// POINT DE COURS : db.collection.updateOne(query, update, options)
// POINT DE COURS : db.collection.updateMany(query, update, options)

// REVENIR SUR LA BASE DE DONNEES "paris"
`use paris`


// QUESTION 1 : COMMENT AJOUTER UN CHAMP "acces_handicape" ayant pour valeur "true" AUX PISCINES DU 13ème ARRONDISSEMENT ?
db.piscines.updateMany(
  {"zipCode": 75013},
  {
    $set: {
      "acces_handicape": true
    }
  },
)

db.piscines.aggregate(
  [
    {$match: {"zipCode": 75013}},
    {$unset: "acces_handicape"},
    {$merge: {
      into: "piscines",
      whenMatched: "replace"
    }}
  ]
)

// QUESTION 2 : COMMENT S'ASSURER QU'UN DOCUMENT SERA INSERE S'IL N'EXISTE PAS DEJA, EN UTILISANT L'OPTION "upsert" (contraction de "update" et "insert") à "true" ?

db.piscines.updateMany(
  {"zipCode": 75099},
  {
    $set: {
      "acces_handicape": true
    }
  },
  {upsert: true}
)

// POINT DE COURS : il est possible de définir et supprimer des champs dans la même requête...
// QUESTION 3 : COMMENT AJOUTER UN CHAMP "verif" A TOUTES LES PISCINES ET SUPPRIMER L'"acces_handicape" ?

db.piscines.updateMany(
  {},
  {
    $set: {
      "verif": true,
    },
    $unset: {
      "acces_handicape": ""
    }
  }
)

// QUESTION 3-a : VERIFIER LE RESULTAT DE L'OPERATION :
db.piscines.findOne({zipCode : 75013 })


db.piscines.aggregate(
  [
    {$match: {}},
    {$group: {
      "_id": "$id",
      "Nombre total de piscines pour cet id": {
        $sum: 1
      }
    }},
    {$sort: {
      "_id": 1
    }}
  ]
)