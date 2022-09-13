// Par défaut, mongo est accessible sans authentification
// Dans un environnement de production, il faut mettre en place cette sécurité !

// Créons une base de données appelée "base_protegee" :
`use base_protegee`

// On créé un  utilisateur et on lui donne un rôle (= des droits)
db.createUser(
    {
      user: "admin",
      pwd: "admin",
      roles: [
         { role: "readWrite", db: "base_protegee" },
      ]
    }
)

db.users.insertOne({"name": "Alex"})

// Il faut redémarrer le serveur mongod avec le paramètre --auth pour activer l'authentification
// Comme notre serveur mongod est démarré automatiquement au démarrage par un service. Il faut arrêter le service pour pouvoir relancer le serveur mongo (démarrer => services.msc => MongoDB Serveur => Stop)
// Puis en se mettant dans le dossier des binaires (C:\devjs\mongodb\bin ) 
`mongod --auth --dbpath "C:\mongodb\data"`

// Dans un terminal en administrateur : 
`mongod --auth --dbpath "C:\Program Files\MongoDB\Server\5.0\data"`


// Reconnectez-vous au client mongo et essayez d'insérer un enregistrement
`mongo --authenticationDatabase "base_protegee" -u "username" -p`

// On peut aussi s'authentifier après la connexion 
`use base_protegee`
db.auth("username", passwordPrompt()) 
// On vous le refuse car vous n'avez pas les droits.

