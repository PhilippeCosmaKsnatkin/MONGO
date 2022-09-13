// QUESTION 1 : RETROUVER LES 5 PREMIERES PISCINES PAR ORDRE ALPHABETIQUE (ET DONT LE CHAMP "zipCode" existe) :

db.piscines.find(
  { zipCode: { $exists: 1} },
  { name: 1 , zipCode: 1, _id :0 }    
).sort({name : 1 }).limit(5)

// QUESTION 2 : AJOUTER DEUX PISCINES AVEC UN CHAMP NOM AU LIEU DE NAME :

db.piscines.insert([
  { nom : "L'amarre aux canards"},
  { nom : "La patte aux geoires"}
])

// QUESTION 3 : IL DOIT DONC Y AVOIR 33 PISCINES AU TOTAL :

db.piscines.count()

// QUESTION 4 : COMPTER UNIQUEMENT LES PISCINES DONT LE CHAMP "name" EST PRESENT :

db.piscines.count({ name : { $exists: true}})

// QUESTION 4-a : QUI PEUT EGALEMENT ETRE ECRIT :

db.piscines.find({ name : { $exists: true}}.count()

// QUESTION 5 : AFFICHER TOUTES LES PISCINES AYANT UN CHAMP "name" :

db.piscines.find({ name : { $exists: true}})

// QUESTION 5-a : LIMITER LES RESULTATS A 5 ENTREES :

db.piscines.find({ name : { $exists: true}}).limit(5)

// QUESTION 5-b : ET EN LIMITANT L'AFFICHAGE AU CHAMP "name" :

db.piscines.find({ "name" : { "$exists": true}}, {"name":1, _id:0})

// QUESTION 5-c : ENFIN EN TRIANT PAR ODRE ALPHABETIQUE (sensible à la casse) :

db.piscines.find({ name : { $exists: true}}, {name:1, _id:0}).sort({ name: 1 })