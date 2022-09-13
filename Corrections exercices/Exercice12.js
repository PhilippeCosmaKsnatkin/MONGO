// Importer dans une base us, dans la collection companies le fichier companies.json
`mongoimport --db us --collection companies --file companies.json`
`use us`

// QUESTION 1 : QUELLE EST LA PLUS ANCIENNE SOCIETE DANS CETTE COLLECTION ?

db.companies.find(
  {
    "founded_year": { $not: { $eq: null } }},
  {
    "name": 1,
    "_id": 0,
    "founded_year": 1 
  }
).sort({ "founded_year": 1 }).limit(1);

// Ce traitement dépasse la mémoire max autorisée par Mongo, il faut créer un index pour pouvoir la traiter.
// QUESTION 2 : COMMENT CREER UN INDEX SUR LE CHAMP "founded_year" ?

db.companies.createIndex({ "founded_year": 1 });

// QUESTION 3 : QUELLE EST LA SOCIETE QUI EMPLOIE LE PLUS DE PERSONNES ?
// Ici on va créer un second index sur number_of_employees afin d'améliorer l'efficacité de nos requêtes...
db.companies.createIndex({ "number_of_employees": 1 })

// On peut à présent faire notre requête en bdd :
db.companies.find(
  {},
  {
    "name": 1,
    "number_of_employees": 1,
    "_id": 0
  }).sort({ "number_of_employees": -1 }).limit(1);


// QUESTION 4 : QUELLE EST LA SOCIETE QUI EMPLOIE LE PLUS DE PERSONNES DANS LE "category_code" "advertising" ?

db.companies.find(
  { "category_code": /advertising/gi },
  {
    "name": 1,
    "number_of_employees": 1,
    "_id": 0
  }).sort({ "number_of_employees": -1 }).limit(1);

// QUESTION 5 : QUEL EST L'EFFECTIF CUMULE DES ENTREPRISES DE "category_code" "network_hosting" ?
// On regroupe les documents par networkcompanies et on additionne les valeurs de number_of_employees :
db.companies.aggregate([
  { $match: { "category_code": /network_hosting/gi } },
  { $group: {
    "_id": "networkcompanies",
    "effectif": { $sum: "$number_of_employees" } } }
])


// QUESTION 6 : QUELLE ENTREPRISE EST DIRIGEE PAR "Rich Langdale" ?

db.companies.find(
  { "relationships.person.first_name": "Rich", "relationships.person.last_name": "Langdale" }, 
  { "name": 1, "_id": 0 }
);

// QUESTION 7 ? COMMENT SUPPRIMER LES ENTREPRISES DE "category_code" "finance" (faire une bonne action, en somme...) ?

db.companies.deleteMany({ "category_code": "finance" });

// QUESTION 8 : COMMENT METTRE A JOUR LES ENTREPRIES DE "advertising" EN LEUR AJOUTANT UN CHAMP "likes" ?

db.companies.updateMany(
  { "category_code": /advert/gi },
  { $set: { "likes": 0 } }
)

// QUESTION 9 : COMMENT CREER UN INDEX SUR LE CHAMP "name" DE CHAQUE SOCIETE ?

db.companies.createIndex({ "name": 1 });

// QUESTION 10 : COMMENT SUPPRIMER L'INDEX QUE L'ON VIENT JUSTE DE CREER SUR LE CHAMP "name" ?

db.companies.dropIndex('name_1');

// QUESTION 11 : COMMENT RECREER L'INDEX EN SPECIFIANT QUE LA VALEUR DOIT ETRE UNIQUE ?

db.companies.createIndex({ "name": 1 }, { unique: true });

// OBSERVATION : cela déclenche une erreur ; mongo ne peut pas créer l'index unique car il y a des doublons dans le nom des entreprises

// QUESTION 12 : COMMENT INSERER UJNE SOCIETE "My Little Company" EN RESPECTANT L'ORGANISATION ACTUELLE DE LA BASE DE DONNEES ?

db.companies.insertOne({
  "name": "My Little Company",
  "number_of_employees": 1,
  "founded_year": 2020
})

// QUESTION 13 : COMMENT TROUVER LES SOCIETES QUI ONT UN BUREAU SITUE A MOINS DE 20km DE LA STATUE DE LA LIBERTE ?
// Stocker les coordonnées du premier bureau de chaque entreprise sour la forme d'un objet de type GeoJSON dans une propriété geometry
`"geometry": {
  "type": "Point",
    "coordinates": [125.6, 10.1]
  };`

//On va devoir manipuler un curseur pour faire cette modification
db.companies.updateMany(
  {},
  {
    $set:
    {
      "coordinates":
      {
        "type": "Point",
        "coordinates": [0, 0]
      }
    }
  }
)

var allCompanies = db.companies.find({ "offices": { $exists: true, $not: { $size: 0 } } });

var allCompanies = db.companies.find({ "offices": { $exists: true, $ne: [] } });
allCompanies.forEach(oneCompany => {
  if (oneCompany.offices[0].longitude != null && oneCompany.offices[0].latitude != null) {
    db.companies.updateOne(
      { "_id": oneCompany._id },
      {
        "coordinates": {
          "type": "Point",
          "coordinates": [
            oneCompany.offices[0].longitude,
            oneCompany.offices[0].latitude
          ],
        }
      }
    )
  }
});

// On ajoute un index 2dsphere à notre collection companies
db.companies.createIndex({ "coordinates": "2dsphere" });

// On peut maintenant faire notre requête de proximité..
const latSL = 40.689249;
const lonSL = -74.044500;

db.companies.find(
  {
    coordinates: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lonSL, latSL]
        },
        $maxDistance: 20000,
        $minDistance: 0,
      }
    }
  },
  { "_id": 0, "name": 1 }
).count();

// QUESTION 14 : COMMENT AJOUTER UN CHAMP "phone" DANS L'ADRESSE DU PREMIER BUREAU DES SOCIETES SITUEES DANS L'ETAT DE "NY" ?

db.companies.updateMany(
  { "offices.state_code": "NY" },
  { $set: { "offices[0].phone": "" } }
);


// QUESTION 15 : COMMENT CREER UNE COLLECTION "awards" PUIS Y CREER QUELQUES RECOMPENSES EN LES RELIANT A UNE SOCIETE EN UTILISANT UNE REFERENCE (au moins 6 récompenses) ?

db.awards.insertMany([
  { "value": 10, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 33, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 12, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 19, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 5, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 189, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 13, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
  { "value": 321, "company_id": ObjectId("52cdef7c4bab8bd675297d8b") },
]);

// QUESTION 16 : COMMENT CREER UNE FONCTION QUI PREND EN PARAMETRE UN "_id" ET QUI CALCULE LA MOYENNE DES AWARDS D'UNE ENTREPRISE ?

db.awards.find({ "company_id": ObjectId("52cdef7c4bab8bd675297d8b") });
function awardsAverage(id) {
  let allAwards = db.awards.find({ "company_id": id });
  let numbOfAwards = db.awards.count({ "company_id": id });
  let average = 0;

  allAwards.forEach(award => {
    average += award.value;
  })
  average /= numbOfAwards;
  print(average);
  return average;
}

awardsAverage(ObjectId("52cdef7c4bab8bd675297d8b"));