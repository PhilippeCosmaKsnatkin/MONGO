/*
TP NOTE 1
1. db.createCollection('restaurants')
2. db.restaurants.insert({borough: "Bronx",cuisine: "Bakery",grades: [{ date:"06/09/2021", grade: "A", score: 2 },{ date: "16/10/2021", grade: "A", score: 6 }],name: "Morris Park Bake Shop"});
3. db.restaurants.find()
4a. db.restaurants.update({borough:"Bronx"},{$set:{address: {building: "1007",coord: [ -73.856077, 40.848447 ],street: "Morris Park Ave",zipcode: "10462"}}})
4b. db.restaurants.update({"_id" : ObjectId("6241a34759c1a55ad08328c4")},
{$set : {grades: [{"date" : "25/10/2021" },{"grade" : "A"},{"score" : 10},{"date" : 
"01/12/2021" },{"grade" : "A"},{"score" : 9},{"date" : "26/01/2022" },{"grade" : 
"B"},{"score" : 14}]}})
5. db.restaurants.find({"address.zipcode":"10462"})
6. db.restaurants.find({"grades.date":{$regex:"2022"})
7. db.restaurants.insert({"address":{"building":"469","coord":[-73.961704, 40.662942],"street":"Flatbush Avenue","zipcode":"11225"},"borough":"Brooklyn","cuisine":"Hamburgers","grades":[{"date":{"$date":1419897600000},"grade":"A","score":8},{"date":{"$date":1404172800000},"grade":"B","score":23},{"date":{"$date":1367280000000},"grade":"A","score":12},{"date":{"$date":1336435200000},"grade":"A","score":12}],"name":"Wendy'S","restaurant_id":"30112340"},{"address":{"building":"351","coord":[-73.98513559999999,40.7676919],"street":"West 57 Street","zipcode":"10019"},"borough":"Manhattan","cuisine":"Irish","grades":[{"date":{"$date":1409961600000},"grade":"A","score": 2},{"date":{"$date":1374451200000},"grade":"A","score":11},{"date":{"$date":1343692800000},"grade":"A","score":12},{"date":{"$date":1325116800000},"grade":"A","score":12}],"name":"Dj Reynolds Pub And Restaurant","restaurant_id":"30191841"})
8. db.restaurants.find({name:/^M/})
9. db.restaurants.find().count()
10. db.restaurants.find({cuisine:"Irish"})
11. db.restaurants.find().sort({name:1})

TP EX
1. use tpex
2. db.createCollection('publis')
3. db.createUser({user:"Dev2",
pwd:"1234",
roles:["readWrite","dbAdmin"]
})
4. db.tpex.insert({type:"Book",title:"Modern Database Systems",year:1999,publisher:"ACM Press and Addison-Wesley",authors:"Won Kim",source:"DBLP"})
db.tpex.insert({type:"magazine",title:"MagazineFM",year:2015,publisher:"Press FM",authors:"Hugo Hugo",source:"DBLP"})
5. show users
6. db.tpex.find().pretty()
7. db.tpex.find({type:"Book"}).pretty()
8. db.tpex.find({year:{$gte:2011}}).pretty()
9. db.tpex.find({year:{$lt:2000}}).pretty()
10. db.tpex.find({authors:"Won Kim"}).pretty()
11. db.tpex.distinct("publisher")
12. db.tpex.distinct("authors")
13. db.tpex.find().count()
14. db.tpex.drop()
15. db.dropDatabase()

TP3
1. db.cinema.find({annee:1990}}).pretty()
2. db.cinema.find({annee:{$lt:2000}}).pretty()
3. db.cinema.find({realisateur.nom:"Eastwood"},{realisateur.prenom:"Clint"}).pretty()
4. XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
5. db.cinema.find({realisateur.prenom:"Clint"}).pretty()
6. db.cinema.find({realisateur.prenom:"Clint"},{annee:{$lt:2000}}).pretty()
7. db.cinema.drop()
8. db.dropDatabase()

*/