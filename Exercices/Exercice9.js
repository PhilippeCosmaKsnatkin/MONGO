// LE PIPELINE D'AGREGATION

// IMPORTER DANS UNE BASE DE DONNEES LE FICHIER "website.json"
//`mongoimport --db websites --collection sites --file "C:\Users\phili\Documents\efrei\NSQL\MongoDB\data\website.json"`

//`use websites`

// QUESTION 1 : QUEL EST L'HEBERGEUR QUI HEBERGE LE PLUS DE SITES ?

db.sites.aggregate([
    {$match: {}},
    {$group: {"_id": "$hebergeur", "number": {$sum:1}}},
    {$sort: {"number": -1}},
    {$limit: 1}
])

// QUESTION 2: QUEL EST LE SITE QUI A LE PLUS DE TRAFIC POUR L'HEBERGEUR GANDI ?

db.sites.find({"hebergeur": "Gandi"}).limit(1).sort({"traffic": -1})

// OBSERVATION : Le tri n'est pas cohérent car le traffic est une chaîne de caractères (string)...
// QUESTION 3 : COMMENT MODIFIER LES DOCUMENTS POUR QUE LE "traffic" SOIT UN NOMBRE ENTIER AVEC LA METHODE update() ?

/*var allTraffic = db.sites.find();
var trafficInt = 0 ;
allTraffic.forEach(oneSite => {
    trafficInt = oneSite.traffic;
    db.sites.updateOne({"_id": oneSite._id},{$set : {"traffic": trafficInt}})
});
*/

var allSites = db.sites.find();
allSites.forEach(site => {
    var intTraffic = parseInt(site.traffic) //C'EST parseInt QUI ME MANQUAIT!!!
    db.sites.updateOne(
        {"_id": site._id},
        {$set: {
            "traffic": intTraffic
        }}
    );
});

// QUESTION 4: QUEL EST LE TRAFIC CUMULE DES HEBERGEURS ? QUI EST LE PREMIER ?
/*
db.createCollection("trafficHub")
var allSites = db.restaurants.find().sort({"hebergeur": 1});
var hub = "";
var trafficPerHub = 0;
allSites.forEach(oneSite => {
    if (hub != oneSite.hebergeur){
        db.hub.insert(
            [
                {
                    "name" : hub,
                    "traffic" : trafficPerHub
                } 
            ]
        )
        hub = oneSite.hebergeur
        trafficPerHub = 0
    }
    trafficPerHub += oneSite.traffic
};
db.trafficHub.find()
*/
db.sites.aggregate([
    {$match: {}},
    {$group : {
        "_id": "$hebergeur",
        "trafficCumule" : {$sum : "$traffic"}
    }},
    {$sort : {"trafficCumule": -1}}
])

// QUESTION 5 : QUELLE EST LA MOYENNE DES LIKES PAR HEBERGEUR ?
// Voir les opérateurs d'aggregation : 
//https://docs.mongodb.com/manual/reference/operator/aggregation/


// OBSERVATION : les "likes" sont aussi de type string, il faut donc les transformer en type nombre.

var allSites = db.sites.find();
allSites.forEach(site => {
    var intLikes = parseInt(site.likes) //C'EST parseInt QUI ME MANQUAIT!!!
    db.sites.updateOne(
        {"_id": site._id},
        {$set: {
            "likes": intLikes
        }}
    );
});

// QUESTION 5-b : COMMENT A PRESENT CALCULER LA MOYENNE DES "likes" ?

db.sites.aggregate([
    {$match: {}},
    {$group : {
        "_id": "$hebergeur",
        "likesAverage" : {$avg : "$likes"}
    }},
    {$sort : {"likesAverage": -1}}
])

// QUESTION 5-c : COMMENT AUGMENTER DE 50 les "likes" POUR LES SITES DE "Gandi" ?

db.sites.updateMany(
    {"hebergeur": "Gandi"},
    {$inc : {"likes": 50}}
)

// Exporter dans un fichier newwebsite.json le contenu de notre collection
// Se placer dans un terminal du système hôte (PAS le shell mongo ; exemple : PowerShell)

//`mongoexport --help` // pour accéder à la documentation

`mongoexport -o "<dossier des databases>\newwebsite.json" -d websites -c sites`
`mongoexport -o "C:\Users\phili\Documents\efrei\NSQL\MongoDB\data\newwebsite.json" -d websites -c sites`

// identique à 
//`mongoexport --out "Données\export_website.json" --db websites --collection sites`

// Cela permet de faire des sauvegardes 
