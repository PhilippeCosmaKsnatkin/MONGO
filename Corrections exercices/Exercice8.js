// Mise à jour -> update

// REVENIR SUR LA BASE DE DONNEES "newyork"
`use newyork`

// QUESTION 1 : COMMENT MODIFIER LES RESTAURANTS DONT LA CUISINE EST "hamburger" POUR LEUR AJOUTER UN CHAMP "healthy_food" ayant pour valeur 2 ?

db.restaurants.updateMany(
  { "cuisine" : /hamburger/i },
  { $set : { "healthy_food" : 2 }}
)

// QUESTION 2 : COMMENT DEFINIR LE CHAMP "healthy_food" A 9 POUR LES RESTAURANTS VEGETARIENS (vegetarian) ?

db.restaurants.updateMany(
  { "cuisine" : /veget/i },
  { $set : { "healthy_food" : 9 }}
)

// QUESTION 3 : COMMENT VERIFIER QUE TOUS LES RESTAURANTS ONT BIEN UN TABLEAU "grades" ?

db.restaurants.count()  // 25359

db.restaurants.count({ "grades" : { $type: "array"}}) // 25359

// QUESTION 4: COMMENT SUPPRIMER LE CHAMP "building" DES RESTAURANTS SITUES DANS LE "Bronx" ET AJOUTER UN BOOLEEN A true ?

db.restaurants.updateMany(
  { "borough": "Bronx"},
  { 
      $unset : { "address.building" : "" },
      $set : { "booléen" : true }
  }
)

// VERIFIER QUE LE CHAMP "building" N'EST PLUS PRESENT ET QUE VOTRE BOOLEEN EST BIEN PRESENT ET A true...
db.restaurants.findOne({ "borough": "Bronx"});


// QUESTION 5 : COMMENT AJOUTER UN CHAMP "rating" A 5 POUR TOUS LES RESTAURANTS ?

db.restaurants.updateMany(
  {},
  { $set : { "rating" : 5} }
)

// QUESTION 6 : COMMENT MULTIPLIER LE CHAMP "rating" PAR 2 POUR LES RESTAURANTS SITUES DANS LE "Queens" ?

db.restaurants.updateMany(
  { "borough" : "Queens"},
  { 
    $mul : { "rating" : 2},
    // autres opérations optionnelles
  }
)

db.restaurants.findOne({ "borough": "Queens"})


// QUESTION 7 : COMMENT TROUVER TOUS LES RESTAURANTS DE "Brooklyn" ?

db.restaurants.find({ "borough" : "Brooklyn"}).pretty()

// QUESTION 7-a : COMMENT LIMITER LES RESULTATS A 100 ENTREES ?

db.restaurants.find({ "borough" : "Brooklyn"}).limit(100).pretty()

// QUESTION 7-b : COMMENT APPLIQUER UN count() ?

db.restaurants.find({ "borough" : "Brooklyn"}).limit(100).count()

// QUESTION 7-c : COMMENT APPLIQUER UN size() ?

db.restaurants.find({ "borough" : "Brooklyn"}).limit(100).size()

// QUestion 7-d : QUELLE EST LA DIFFERENCE ENTRE .count() ET .size() ?

`.count() ne prend pas en compte la valeur passée à .limit() dans son comptage, alors que .size() la prend en compte.`

// QUESTION 8 : COMMENT AJOUTER UNE ENTREE AU TABLEAU "grades" POUR LE RESTAURANT "Tu-Lu'S Gluten-Free Bakery" ?

db.restaurants.updateOne(
  { "name" : "Tu-Lu'S Gluten-Free Bakery"},
  { $push : { "grades" : 
      {
        "date" : new Date(),
        "grade" : "A",
        "score" : 15
      }
    }
  }
)

// VERIFIER QUE L'AJOUT A ETE REUSSI...
db.restaurants.findOne({ name : "Tu-Lu'S Gluten-Free Bakery"})
    

// QUESTION 9 : COMMENT MODIFIER LE CHAMP "rating" POUR TOUS LES DOCUMENTS POUR QU'IL SOIT EGAL A LA MOYENNE ARITHMETIQUE DES GRADES ?
// indice : créer un curseur et le manipuler avec une boucle forEach.

var allRestos = db.restaurants.find();
allRestos.forEach(oneResto => {
  var moyenne = 0 ;
  oneResto.grades.forEach(oneGrade =>{
      moyenne += oneGrade.score; // équivalent à moyenne = moyenne + oneGrade.score;
  });
  moyenne /= oneResto.grades.length; // équivalent à moyenne = moyenne / oneResto.grades.length;
  db.restaurants.updateOne(
      { "_id" : oneResto._id },
      { $set : { "rating" : moyenne }}
  )
});

// VERIFIER...
db.restaurants.findOne({ name : "Wilken'S Fine Food"} );

// QUESTION 10 : QUEL EST LE RESTAURANT QUI A LA MEILLEURE MOYENNE ?

db.restaurants.find({"grades": {$ne: []}}).sort({ "rating" : 1 }).limit(5).pretty()