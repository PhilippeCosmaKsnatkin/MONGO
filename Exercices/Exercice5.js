// ETAPES PREALABLES :
// 1 - REVENIR SUR LA BASE DE DONNEES "videoclub".
`use videoclub`

// 2 - INSERER LES DOCUMENTS SUIVANTS :
`db.films.insert({
    titre : "La vache et le prisonnier",
    duree : 119,
    acteurs : [
        { prenom: "Fernandel"},
        { prenom : "René", nom : "Havard" }
    ],
    realisateur : { prenom : "Henri", nom : " Verneuil"},
    annee_sortie : 1959
})`

`db.films.insert({ titre : "Titanic"})`

`db.films.insert([{ titre : "MadMax"}, { titre : "Matrix"}])`

// UTILISATION DES EXPRESSIONS REGULIERES (RegExp) : 
// EN JAVASCRIPT VANILLA :
const paragraph = 'La vache et le prisonnier';
const regex = /vache/g;
const found = paragraph.match(regex);
console.log(found);

// UTILISATION DES EXPRESSIONS REGULIERES (RegExp) DANS MONGO :
// Site : regex101. ne pas oublier le G/M/I
//exemple : regexp de validation de mail
//checker aussi la methode match()

/*{$or: [{"titre": {$regEx: {/vache/, $options: 'gmi'}}}, {"titre": {$regEx: {/Vache/, $options: 'gmi'}}}]}*/

// QUESTION 1 : COMMENT TROUVER UN FILM DONT LE NOM CONTIENT 'vache' (EN UTILISANT UNE EXPRESSION REGULIERE) ?
// indice : attention à la casse...

db.films.find({"titre": {$regex: /vache/, $options: 'gmi'}}).pretty()

// QUESTION 2 : COMMENT AFFICHER UNIQUEMENT LE PRENOM DES ACTEURS DE CE FILM ?

db.films.find({"titre": {$regex: /vache/, $options: 'gmi'}}, {"acteurs.prenom": 1, "_id": 0}).pretty()

// QUESTION 3 : COMMENT TROUVER LES FILMS DONT UN ACTEUR S'APPELLE 'René' ?

db.films.find({"acteurs.prenom": {$regex: /René/, $options: 'gmi'}}, {"titre": 1, "_id": 0}).pretty()
