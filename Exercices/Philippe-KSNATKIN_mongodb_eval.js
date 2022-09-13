/************************************ EVALUATION DE FIN DE MODULE - MONGODB ************************************/
// Cette évaluation permet d'évaluer votre compréhension de l'utilisation
// de la base de données MongoDB. Les sujets traités sont les suivants : compréhension de l'architecture de
// MongoBD ; utilisation des opérations basiques CRUD ; utilisation du pipeline d'agrégation ; création et
// utilisation d'index.

// CONSIGNE : VOTRE CODE DOIT ETRE COPIABLE DANS UN TERMINAL ET DOIT RENVOYER LE RESULTAT ATTENDU.
// VOUS PRENDREZ SOIN DE RENOMMER LE FICHIER DANS LE FORMAT SUIVANT : <NOM>-<PRENOM>_MONGODB-EVAL.js



// Exercice 1 : Quelles sont les différences fondamentales entre MongoDB et un système de base de données relationnelle (type MySQL) ? (1pt)

//MongoDB est une base de donnée dite non-relationnelle. Ainsi comme son nom l'indique les différents elements de la base de donnée 
//ne sont pas reliés par une relation et sont donc plus aisément accessibles

/**************************************************  **************************************************/

// Exercice 2 : Expliquez ce qu'est un index pour une collection MongoDB, quelle commande utiliser pour en créer un
// et pourquoi il peut être important d'en créer un ou plusieurs pour une collection donnée. (1pt)

//les indexes sont à utiliser sur la methode sort(), ca permet de rendre mongobs plus efficace en affinant la recherche
//un index stock une petite partie de la collection, ca accelère donc le processus de recherche
//ex:
db.restaurants.createIndex({"borough": 1, "name": 1})

//un index peut etre important pour eviter de depasser la mémoire max autorisée par Mongo. Cela arrive quand une basse de donnée est
//trop grande/posséde trop d'information, il faut alors un index pour traiter la requete

/**************************************************  **************************************************/

// CONSIGNE :
// Avant de commencer les exercices suivants, veuillez copier-coller les commandes suivantes,
// dans l'ordre indiqué, dans votre terminal :

// 1 :
`use university`

// 2 :
var i = 1;
while (i <= 40) {
  db.students.insertOne(
    {
      "student_id": i,
      "student_major": "Computer Sciences",
      "scores": [],
      "class_id": 42
    }
  )
  i++;
};

// Vous avez à présent une base de données "university", comprenant une collection "students" contenant 40 documents.

/**************************************************  **************************************************/

// Exercice 3 : Ecrivez une requête permettant d'ajouter (mettre à jour) chaque document avec les champs suivants :
// - un champ "student_address" qui est un objet contenant les champs "city" dont la valeur est "Paris" et
// "zipCode" dont la valeur est un nombre. (3pts)

// CONSIGNE : 
// Pour la valeur du "zipCode", utilisez la formule suivante : Math.floor(Math.random() * (Math.floor(75020) - Math.ceil(75010) + 1) + Math.ceil(75010))

var allStudents = db.students.find();
allStudents.forEach(oneStudent => {
  db.students.updateOne({"_id": oneStudent._id}, {$set : {"student_address": {"city": "Paris", "zipCode": Math.floor(Math.random() * (Math.floor(75020) - Math.ceil(75010) + 1) + Math.ceil(75010))}}})
})

/**************************************************  **************************************************/

// Exercice 4 : Ecrivez une requête permettant de mettre à jour le tableau des scores de TOUS les étudiants
// avec les informations suivantes : 
// (3pts)

// CONSIGNE : 
// Utilisez les formules ci-dessous pour définir les valeurs des propriétés "score" de chaque objet du tableau "scores" :
/* 
  {
    "type": "exam",
    "score": Math.ceil(Math.random() * (Math.floor(53) - Math.ceil(13) + 1) + Math.ceil(13)))
  },
  {
    "type": "quiz",
    "score": Math.ceil(Math.random() * (Math.floor(88) - Math.ceil(43) + 1) + Math.ceil(43)))
  },
  {
    "type": "homework",
    "score": Math.ceil(Math.random() * (Math.floor(96) - Math.ceil(63) + 1) + Math.ceil(63)))
  }
*/

var allStudents = db.students.find();
allStudents.forEach(oneStudent => {
  db.students.updateOne({"_id": oneStudent._id}, {$set : {"scores": [
    {
    "type": "exam",
    "score": Math.ceil(Math.random() * (Math.floor(53) - Math.ceil(13) + 1) + Math.ceil(13))
    },
    {
    "type": "quiz",
    "score": Math.ceil(Math.random() * (Math.floor(88) - Math.ceil(43) + 1) + Math.ceil(43))
    },
    {
    "type": "homework",
    "score": Math.ceil(Math.random() * (Math.floor(96) - Math.ceil(63) + 1) + Math.ceil(63))
    }
  ]}
})})

/**************************************************  **************************************************/

// Exercice 5 : Ecrivez le code permettant de renvoyer un curseur contenant les étudiants qui font partie de la classe 42. 
// Ensuite, s'ils ont eu une note inférieure à 50 à leur examen, incrémenter (opérateur $inc) la note de 20 points
// en compensation pour la Covid-19, et finalement définir une propriété "bonus" dans l'objet contenant le score
// pour "exam" à true  (booléen "true").
// (3pts)

// CONSIGNE :
// ATTENTION à prendre le soin de faire de sorte que des points bonus ne puissent pas être attribués deux fois à un élève 
// si l'on venait à réexécuter votre code !

// REPONSE :

var allStudents = db.students.find({"class_id": 42});
allStudents.forEach(oneStudent => {
  oneStudent.scores.forEach(oneGrade =>{
    if(oneGrade.type === "exam"){
      if (oneGrade.score < 50){
        if (oneGrade.bonus != true){
          db.students.updateOne({"_id": oneStudent._id}, {$inc : {"scores.0.score" : 20}});
          db.students.updateOne({"_id": oneStudent._id}, {$push: {"scores": {"bonus": true}}})
        }
      }
    }
})})

/**************************************************  **************************************************/

// Exercice 6 : Ecrivez le code permettant de déterminer quel élève a la meilleure moyenne globale.
// Vous suivrez les étapes suivantes :
// 1) Ajouter une propriété "averageScore" à chaque étudiant et lui donner pour valeur la moyenne
// des 3 notes obtenues par l'élève ;
// 2) En utilisant un pipeline d'agrégation, regrouper, par ordre décroissant de code postal,
// la meilleure moyenne générale par arrondissement de Paris
// 3) Faire de sorte de n'afficher que l'arrondissement de Paris dont les élèves ont la moyenne générale la plus élevée
// (4pts)

// CONSIGNE : 
// Vous pouvez bien entendu consulter la documentation ici https://docs.mongodb.com/manual/core/aggregation-pipeline/

// REPONSE :
//1)
var allStudents = db.students.find();
allStudents.forEach(oneStudent => {
  var moyenne = 0 ;
  oneStudent.scores.forEach(oneGrade =>{
      moyenne += oneGrade.score;
  });
  moyenne /= oneStudent.scores.length;
  db.students.updateOne(
      { "_id" : oneStudent._id },
      { $set : { "averageScore" : moyenne }}
  )
});
//2)
db.students.aggregate(
    {$match: {}},
    {$group : {
        "_id": "$averageScore",
        "cp" : {$max : "$student_address.zipCode"}
    }},
    {$sort : {"cp": -1}}
)
//3)
db.students.aggregate(
  {$match: {}},
  {$group : {
      "_id": "$student_address.zipCode",
      "moy" : {$avg : "$averageScore"}
  }},
  {$sort : {"moy": -1}},
  {$limit : 1}
)



/**************************************************  **************************************************/

// Exercice 7 : QUELLE est la SEULE proposition parmi les suivantes qui donnera lieu à une insertion en base de données ?
// (1pt)

// CONSIGNE : en considérant une collection que l'on crée avec le schéma de validation suivant :
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "address", "email", "birthInfo"],
      properties: {
        "firstName": {
          bsonType: "string",
          description: "Must be a string of minimum 2 characters and maximum 50 characters.",
          minimum: 2,
          maximum: 50,
          exclusiveMaximum: false,
        },
        "lastName": {
          bsonType: "string",
          description: "Must be a string of minimum 2 characters and maximum 50 characters.",
          minimum: 2,
          maximum: 50,
          exclusiveMaximum: false,
        },
        "birthInfo": {
          bsonType: "object",
          required: ["birthYear", "birthCountry"],
          properties: {
            "birthYear": {
              bsonType: "int",
              description: "Must be an integer of minimum 1910 and maximum 2021.",
              minimum: 1910,
              maximum: 2021,
              exclusiveMaximum: false,
            },
            "birthCountry": {
              bsonType: "string",
              description: "Must be a string with a minimum length of 1.",
              minimum: 1
            },
            "birthCity": {
              bsonType: "string",
              description: "Must be a string with a minimum length of 1.",
              minimum: 1
            },
          }
        },
        "email": {
          bsonType: "string",
          description: "Must be a string matching the regex pattern.",
          pattern: "[.+-+_a-zA-Z]+@gmail\.com$",
          minimum: 2,
          maximum: 60,
          exclusiveMaximum: false,
        },
        "address": {
          bsonType: "object",
          required: ["city", "zipCode"],
          properties: {
            "city": {
              bsonType: "string",
              description: "Must be a string."
            },
            "streetNumber": {
              bsonType: "int",
              description: "Must be an integer."
            },
            "streetName": {
              bsonType: "string",
              description: "Must be a string."
            },
            "zipCode": {
              bsonType: "int",
              pattern: "[\d]+5$",
              description: "Must be an integer matching the pattern."
            }
          }
        }
      }
    }
  }
})


/* 1 */ db.users.insertOne({
  "fistName": "John",
  "lastName": "Doe",
  "birthInfo": {
    "birthYear": 1965,
  },
  "address": {
    "city": "Paris",
    "zipCode": "75005"
  },
  "email": "john.doe@gmail.com"
})

/* 2 */ db.users.insertOne({
  "lastName": "Doe",
  "birthInfo": {
    "birthYear": 1965,
    "birthCountry": "France"
  },
  "address": {
    "city": "Paris",
  },
  "email": "john.doe@gmail.com"
})

/* 3 */ db.users.insertOne({
  "fistName": "John",
  "lastName": "Doe",
  "birthInfo": {
    "birthYear": 1965,
    "birthCountry": "France"
  },
  "address": {
    "city": "Paris",
    "zipCode": 75005
  },
  "email": "john.doe@gmail.com"
})

/* 4 */ db.users.insertOne({
  "fistName": "John",
  "lastName": "Doe",
  "birthInfo": {
    "birthYear": "1965",
    "birthCountry": "France"
  },
  "address": {
    "city": "Paris",
    "zipCode": 75005
  },
  "email": "john.doe@gmailcom"
})

// Ecrire votre réponse ici en indiquant les propositions vraies
// REPONSE :

//La 3 est la seule à être insérée. 
//Pour la 1 il manque birthCountry
//Pour la 2 il manque le firstName
//Pour la 4 birthYear n'est pas conforme au format

/**************************************************  **************************************************/

// Exercice 8 : Quelles sont les différentes utilisations du signe $ dans le langage MQL (MongoDB Query Language) (plusieurs réponses possibles) ?
// (1pt)


/* 1 */ `$ dénote un opérateur`

/* 2 */ `$ représente la puissance dominante mondiale`

/* 3 */ `$ signifie qu'on cherche la valeur d'un champ plutôt que le champ lui-même`

/* 4 */ `$ convertit le type d'une valeur au format monétaire`

// Ecrire votre réponse ici en indiquant les propositions vraies
// REPONSE :

//1 et 3

/**************************************************  **************************************************/

// CONSIGNE : pour l'exercice 9, considérons une collection dont les documents ont le format suivant :
/*
{
  _id: "10006546"
  listing_url: "https://www.airbnb.com/rooms/10006546"
  name: "Ribeira Charming Duplex"
  summary: "Fantastic duplex apartment with three bedrooms, located in the histori..."
  space: "Privileged views of the Douro River and Ribeira square, our apartment ..."
  description: "Fantastic duplex apartment with three bedrooms, located in the histori..."
  neighborhood_overview: "In the neighborhood of the river, you can find several restaurants as ..."
  notes: "Lose yourself in the narrow streets and staircases zone, have lunch in..."
  transit: "Transport: • Metro station and S. Bento railway 5min; • Bus stop a 50 ..."
  access: "We are always available to help guests. The house is fully available t..."
  interaction: "Cot - 10 € / night Dog - € 7,5 / night"
  house_rules: "Make the house your home..."
  property_type: "House"
  room_type: "Entire home/apt"
  bed_type: "Real Bed"
  minimum_nights: "2"
  maximum_nights: "30"
  cancellation_policy: "moderate"
  last_scraped: 2019-02-16T05:00:00.000+00:00
  calendar_last_scraped: 2019-02-16T05:00:00.000+00:00
  first_review: 2016-01-03T05:00:00.000+00:00
  last_review: 2019-01-20T05:00:00.000+00:00
  accommodates: 8
  bedrooms: 3
  beds: 5
  number_of_reviews: 51
  bathrooms: 1
  amenities: [
    0: "TV"
    1: "Cable TV"
    2: "Wifi"
    3: "Kitchen"
    4: "Paid parking off premises"
    5: "Smoking allowed"
    6: "Pets allowed"
    7: "Buzzer/wireless intercom"
    8: "Heating"
    9: "Family/kid friendly"
    10: "Washer"
    11: "First aid kit"
    12: "Fire extinguisher"
    13: "Essentials"
  ]
}
*/

// Exercice 9 : LAQUELLE des requêtes suivantes renverra la liste des logements qui ont "Pets allowed",
// "Heating" et "Wifi" dans la liste de leurs commodités (amenities) et disposent d'au moins 2 chambres (bedrooms) ?
// (1pt)

// CONSIGNE : la méthode find() du MQL, lorsqu'on lui demande de chercher dans un tableau dans un document, cherchera toujours
// une correspondance exacte avec la requête (l'ordre, également !). Reférez-vous à la documentation officielle concernant la
// l'opérateur $all... 

/* 1 */
db.collection.find(
  { 
    "amenities": "Pets allowed",
    "amenities": "Wifi",
    "amenities": "Heating", 
    "bedrooms": { "$gte": 2 }
  }
).pretty()

/* 2 */
db.collection.find(
  {
    "amenities": [ "Pets allowed", "Wifi", "Heating" ],
    "bedrooms": { "$gte": 2 } 
  }
).pretty()

/* 3 */
db.collection.find(
  { 
    "amenities":
      { "$all": [ "Pets allowed", "Wifi", "Heating" ] },
    "bedrooms": { "$gte":  2 } 
  } 
).pretty()

/* 4 */
db.collection.find(
  {
    "amenities":
      { "$all": [ "Pets allowed", "Wifi", "Heating" ] },
    "bedrooms": { "$lte": 2 }
  }
).pretty()

// Ecrire votre réponse ici en indiquant les propositions vraies
// REPONSE :

//la 1 et 3

/**************************************************  **************************************************/

// Exercice 10 : Déterminez TOUTES les bonnes réponses parmi les propositions suivantes :
// (1pt)


/* 1 */ 
    `MongoDB peut toujours stocker des documents dupliqués, peu importe la valeur de leur champ "_id".`

/* 2 */
    `Si un document est inséré sans que la valeur du champ "_id" ait été précisée, le champ "_id" sera
     automatiquement généré pour le document à insérer avant son insertion.`

/* 3 */ 
    `MongoDB ne fournit aucun moyen de s'assurer que des documents sont stockés en doublon.`

/* 4 */
    `Si un document est inséré sans que la valeur du champ "_id" ait été précisée, le document ne sera
     alors pas inséré et MongoDB renverra une erreur.`

/* 5 */
    `MongoDB peut stocker des documents en doublon tant que les valeurs de leurs champs "_id" sont différentes.`

//1 Faux
//2 Vrai
//3 Vrai
//4 Faux
//5 Vrai

/**************************************************  **************************************************/

// Exercice 11 : Parmi les propositions suivantes, LESQUELLES inséreront avec succès 3 documents dans
// une collection "pets" ?
// (1pt)

// CONSIGNE : pour cet exercice, vous référer à la documentation officielle pour trouver des informations
// sur l'option "ordered" de la méthode db.collection.insertMany()

/* 1 */
db.pets.insertMany(
  [
    { "pet": "cat" }, 
    { "pet": "dog" },
    { "pet": "fish" }
  ]
)

/* 2 */
db.pets.insertMany(
  [
    { "_id": 1, "pet": "cat" },
    { "_id": 2, "pet": "dog" },
    { "_id": 3, "pet": "fish" },
    { "_id": 3, "pet": "snake" }
  ]
)

/* 3 */
db.pets.insertMany(
  [
    { "_id": 1, "pet": "cat" },
    { "_id": 1, "pet": "dog" },
    { "_id": 3, "pet": "fish" },
    { "_id": 4, "pet": "snake" }
  ], 
  { "ordered": true }
)

/* 4 */
db.pets.insertMany(
  [
    { "_id": 1, "pet": "cat" },
    { "_id": 1, "pet": "dog" },
    { "_id": 3, "pet": "fish" },
    { "_id": 4, "pet": "snake" }
  ],
  { "ordered": false }
)

// Ecrire votre réponse ici en indiquant les propositions vraies
// REPONSE :

//1 et 4
//La 2 admet une duplication de _id, donc l insertion echoue
//La 3 admet une duplication de _id avec ordered = true, donc l'insertion echoue 

