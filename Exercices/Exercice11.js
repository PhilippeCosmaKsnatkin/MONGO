// SUPPRESSION DE DOCUMENT(S)

// db.collection.remove(query, options)
// ATTENTION ! LA METHODE remove() EST DEPRECIEE POUR NODEJS, IL FAUT DONC LUI PREFERER LES METHODES deleteOne() et deleteMany() POUR LES OPERATIONS DE SUPPRESSION.

// IMPORTER LE FICHIER "seas.json"
`mongoimport --db mondial --collection seas --file seas.json`
`use mondial`

// SUPPRESSION DE TOUS LES ENREGISTREMENTS (= TOUS LES DOCUMENTS DANS LA COLLECTION) :
db.seas.remove({});

// IMPORTER A NOUVEAU AVANT DE POURSUIVRE...

// QUESTION 1 : COMMENT SUPPRIMER L'OCEAN ATLANTIQUE ?

db.seas.remove({"name": "Atlantic Ocean"});
db.seas.deleteOne({name : /atlanti/i})

// QUESTION 2 : COMMENT SUPPRIMER LES MERS BORDANT L'OCEAN ATLANTIQUE ?

db.seas.remove({"bordering": /sea-Atlantic/gmi});
db.seas.deleteMany({bordering : /atlanti/i})

// QUESTION 3 : QUELLE EST LA MER LA PLUS PROFONDE ?

db.seas.find().limit(1).sort({"depth": -1}).pretty()

// QUESTION 4 : COMMENT AJOUTER L'ETENDUE D'EAU "Océan Atlantique" ?

db.seas.insertOne({"name": "Atlantic Ocean", "secureName" : "ocean-atlantic"})

// QUESTION 5 : COMMENT AJOUTER UN TABLEAU "myArray" A TOUTES LES MERS ?   

db.seas.upadteMany({}, {$set : {"myArray": []}})

// QUESTION 6 : QUELLE EST LA PROFONDEUR CUMULEE DE TOUTES LES MERS ?

db.seas.aggregate([
    {$match: {}},
    {$group : {
        "_id": "depth",
        "prof" : {$sum : "$depth"}
    }},
    {$sort : {"prof": -1}}
])
/*var profondeur = 0;
var allSeas = db.seas.find();
allSeas.forEach(mer => {
    profondeur = profondeur + mer.$depth
});
print(profondeur)
*/
