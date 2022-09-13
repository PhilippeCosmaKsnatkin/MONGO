// QUESTION 1 : RETROUVER LES 5 PREMIERES PISCINES PAR ORDRE ALPHABETIQUE (ET DONT LE CHAMP "zipCode" existe) :

db.piscines.find({"zipCode": {$exists: true}}).limit(5).sort({"name": 1}).pretty()
//!!! La bonne paratique veut que on utilise le sort() avant le limit()

// QUESTION 2 : AJOUTER DEUX PISCINES AVEC UN CHAMP NOM AU LIEU DE NAME :

db.piscines.insert(
    [
        {
            "id": 2203,
            "nom": "Piscine de Cosma",
            "address" : "1 place de la porte de passy",
            "zipCode": 75016,
            "lat": 48.884615,
            "lon": 2.326486
        },
        {
            "id": 2103,
            "nom": "Piscine de Hardlight",
            "address" : "2 place de la porte de passy",
            "zipCode": 75016,
            "lat": 48.884616,
            "lon": 2.326487
        }
    ]
)

db.piscines.insert(
    [
        {
            "id": 2103,
            "nom": "Piscine de Hardlight",
            "address" : "2 place de la porte de passy",
            "zipCode": 75016,
            "lat": 48.884616,
            "lon": 2.326487
        }
    ]
)

// QUESTION 3 : IL DOIT DONC Y AVOIR 33 PISCINES AU TOTAL :

db.piscines.find().count()

// QUESTION 4 : COMPTER UNIQUEMENT LES PISCINES DONT LE CHAMP "name" EST PRESENT :

db.piscines.find({"name": {$exists: true}}).count()

// QUESTION 4-a : QUI PEUT EGALEMENT ETRE ECRIT :

db.piscines.find({"nom": {$exists: false}}).count()

// QUESTION 5 : AFFICHER TOUTES LES PISCINES AYANT UN CHAMP "name" :

db.piscines.find({"name": {$exists: true}}, {"name": 1, "_id": 0}).pretty()

// QUESTION 5-a : LIMITER LES RESULTATS A 5 ENTREES :

db.piscines.find({"name": {$exists: true}}, {"name": 1, "_id": 0}).limit(5).pretty()

// QUESTION 5-b : ET EN LIMITANT L'AFFICHAGE AU CHAMP "name" :



// QUESTION 5-c : ENFIN EN TRIANT PAR ODRE ALPHABETIQUE (sensible à la casse) :

db.piscines.find({"name": {$exists: true}}, {"name": 1, "_id": 0}).limit(5).sort({"name": 1}).pretty()