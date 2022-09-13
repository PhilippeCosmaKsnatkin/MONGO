// VELIB

// Récupérer un fichier json des velib chez jcdecaux developer
// Importer dans la base paris, le fichier jcdecaux.json dans une collection velib


// Cette fois-ci les données sous fournies sous la forme d'un tableau d'objets, il faut donc ajouter l'option --jsonArray pour importer
`mongoimport --db paris --collection velib --file "/Données/jcdecaux.json" --jsonArray`

`use paris`
/*
{
    "geometry": {
        $near : {
            $geometry {type: "point", coordinates: [<longitude><latitude>]}
        }

    }
}
 */
// Problème ! On n'a pas de champ codepostal... On retrouve le code postal dans l'adresse.

var myRegex  = /\d{5}/gmi;
var myString = "37 RUE CASANOVA - 75001 PARIS";
print(myString.match(myRegex))

// QUESTION 1 : COMMENT METTRE A JOUR TOUS LES ENREGISTREMENTS EN LEUR AJOUTANT UN CHAMP "zipCode" ?

var myRegex  = /\d{5}/gmi;
var allStation = db.velib.find();
allStation.forEach(station => {
    var zipCode = parseInt(station.address.match(myRegex));
    db.velib.updateOne({"_id": station._id},{$set : {"zipCode": zipCode}})
});

// QUESTION 2 : QUEL EST L'ARRONDISSEMENT DE PARIS OÙ IL Y A LE PLUS DE STATIONS (EN UTILISANT $in) ?      

db.velib.aggregate([
    {$match: {"zipCode": {$in : [75001, 75002, 75003, 75004, 75005, 75006, 75007, 75008, 75009, 75010, 75011, 75012, 75013, 75014, 75015, 75016, 750116, 75017, 75018, 75019, 75020]}}},
    {$group : {
        "_id": "$zipCode",
        "nbStations" : {$sum : 1}
    }},
    {$sort : {"nbStations": -1}}
])
//75015

// QUESTION 3 : QUELLE EST LA VILLE (HORS "Paris") QUI A LE PLUS DE STATIONS ?

db.velib.aggregate([
    {$match: {"zipCode": {$nin : [75001, 75002, 75003, 75004, 75005, 75006, 75007, 75008, 75009, 75010, 75011, 75012, 75013, 75014, 75015, 75016, 750116, 75017, 75018, 75019, 75020]}}},
    {$group : {
        "_id": "$zipCode",
        "nbStations" : {$sum : 1}
    }},
    {$sort : {"nbStations": -1}}
])
//92100

// QUESTION 4 : COMMENT RETROUVER LA PISCINE "Dunois" ?

db.piscines.find({"name": "Piscine Dunois"})


// QUESTION 5 : QUELLES SONT LES 5 STATIONS VELIB LES PLUS PROCHES DE LA PISCINE "Dunois" ?
// Première version : en utilisant une fonction de calcul de distance
//https://www.geodatasource.com/developers/javascript

// INFO : Coordonnées de Dunois : 
// "lat" : 48.832973, "lon" : 2.366437


// QUESTION 5-a : COMMENT OBTENIR LE MEME RESULTAT EN UTILISANT L'OPERATEUR $near ?

//MAJ de chaque document en ajoutant un champ geometry au format geojson
var allStation = db.velib.find();
allStation.forEach(station => {
    db.velib.updateOne({"_id": station._id},{$set : {"geometry": {"type": "Point", "coordinates": [station.longitude, station.latitude]}}})
});

//Maintenant on cree un index de type 2dsphere sur le champ geometry
db.velib.createIndex({"geometry": "2dsphere"}, {"name" : "2dsphereindex"})

//maintenant on peut chercher ^^

db.velib.find({"geometry" : {
    $near: {
        $geometry: {
            "type": "Point",
            "coordinates" : [2.366437, 48.832973]
        }
    }
}}, {"name": 1, "_id": 0}).limit(1)

// QUESTION 6 : COMMENT AFFICHER LA DISTANCE DES STATIONS PAR RAPPORT A LA PISCINE "Dunois" EN UTILISANT UN PIPELINE D'AGREGATION ET L'ETAPE $geonear ?

db.velib.aggregate(
    [
        {
            $geoNear :{
            near: {type: "Point", coordinates : [2.366437, 48.832973]},
            distanceField: "distDunois"
        }},
        {$sort: {"distDunois": 1}},
        {$limit: 1}
    ]
)