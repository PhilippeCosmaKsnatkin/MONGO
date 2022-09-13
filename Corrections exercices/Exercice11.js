// SUPPRESSION DE DOCUMENT(S)

// db.collection.deleteOne(query, options)
// db.collection.deleteMany(query, options)

// IMPORTER LE FICHIER "seas.json"
`mongoimport --db mondial --collection seas --file seas.json`
`use mondial`

// SUPPRESSION DE TOUS LES ENREGISTREMENTS (= TOUS LES DOCUMENTS DANS LA COLLECTION) :
db.seas.deleteMany({});

// IMPORTER A NOUVEAU AVANT DE POURSUIVRE...

// QUESTION 1 : COMMENT SUPPRIMER L'OCEAN ATLANTIQUE ?

db.seas.deleteOne({name : /atlanti/i})

// QUESTION 2 : COMMENT SUPPRIMER LES MERS BORDANT L'OCEAN ATLANTIQUE ?

db.seas.deleteMany({bordering : /atlanti/i})

// QUESTION 3 : QUELLE EST LA MER LA PLUS PROFONDE ?

db.seas.find().sort({depth : -1}).limit(1)

// QUESTION 4 : COMMENT AJOUTER L'ETENDUE D'EAU "Océan Atlantique" ?

db.seas.insertOne({ name : "Atlantic Ocean", secureName : "ocean-atlantic"})

// QUESTION 5 : COMMENT AJOUTER UN TABLEAU "myArray" A TOUTES LES MERS ?   

db.seas.updateMany(
  {},
  { $set : { myArray : [] } }
)

// QUESTION 6 : QUELLE EST LA PROFONDEUR CUMULEE DE TOUTES LES MERS ?
db.seas.aggregate([
  { $match : { }},
  { $group : 
    {
      "_id" : "depth" ,
      "cumulatedDepth" : { $sum: "$depth" }
    }
  }, 
])