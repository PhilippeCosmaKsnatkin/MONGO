// VALIDATION DE SCHEMA NATIVE A MONGODB
// https://docs.mongodb.com/manual/core/schema-validation/

//use users 

db.createCollection(
   "contact",
   {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: ["name", "address"],
            properties: {
               "name": {
                  bsonType: "string",
                  description: "Doit être une chaine de caractères et faire entre 1 et 60 caractères",
                  minimum: 1,
                  maximum: 60
               },
               "age": {
                  bsonType: "int",
                  description: "Doit etre in nombre entre 18 et 150",
                  minimum: 18,
                  maximum: 150,
                  exclusiveMaximum: false
               },
               "address": {
                  bsonType: "object",
                  required: ["city", "zipCode"],
                  properties: {
                     "city": {
                        bsonType: "string",
                        description: "chaine de caractères, max 250",
                        maximum : 250,
                        exclusiveMaximum: false
                     },
                     "zipCode": {
                        bsonType: "string",
                        description: "Chaine de caractères, maximum 13",
                        minimum : 1,
                        maximum: 13,
                        exclusiveMaximum: false
                     }
                  }
               }
            }
         }
      }
   }
)
// Pour verifier : db.getCollectionInfos()
db.contact.insertOne(
   {
      "name": "John Doe",
      "address": {
         "city": "Paris",
         "zipCode": "75013"
      }
   }
)
//marche car conforme
db.contact.insertOne(
   {
      "name": "Marie Doe",
      "address": {
         "city": "Paris",
         "zipCode": 75013
      }
   }
)
//marche pas car adresse non conforme

db.createCollection("personnes", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: [ "prenom", "nom", "mail", "annee_naissance", "adresse.ville" ],
        properties: {
           prenom: {
              bsonType: "string",
              description: "Requis et doit être une chaîne de caractères"
           },
           nom: {
              bsonType: "string",
              description: "Requis et doit être une chaîne de caractères"
           },
           annee_naissance: {
              bsonType: "int",
              minimum: 1900,
              maximum: 2019,
              exclusiveMaximum: false,
              description: "Doit être un nombre dans la plage [ 1900, 2019 ] et est requis"
           },
           "adresse.ville" : {
              bsonType: "string",
              description: "Requis et doit être une chaîne de caractères"
           }
        }
     }
  }
})

db.createCollection("personnes6", {
  validator: {
     $jsonSchema: {
        bsonType: "object",
        required: [ "prenom", "nom"],
        properties: {
           prenom: {
              bsonType: "string",
              description: "Requis et doit être un string"
           },
           nom: {
              bsonType: "string",
              description: "Requis et doit être un string"
           }
        }
     }
  }
})



// Echec pour non -respect des règles de validation
db.personnes.insert({prenom : "Alain"})


// Avec toutes les bonnes infos 
db.personnes4.insert(
  {
     prenom : "Alain", 
     nom : "Proviste", 
     mail : "a@a.com", 
  }
)

// TEST : ESSAYER D'INSERER DES DOCUMENTS QUI RESPECTENT OU NON LES CONTRAINTES ENONCEES PLUS HAUT DANS LE SCHEMA DE VALIDATION JSON



// QUESTION 1 : COMMENT AJOUTER DES REGLES DE VALIDATION A POSTERIORI SUR UNE COLLECTION ?

db.runCommand({
   collMod: "contact",
   validator: {
      //et on lui met ce qu'il faut
   },
   validationLevel: "strict", // ou moderate
   validationAction: "error" // ou warn
})