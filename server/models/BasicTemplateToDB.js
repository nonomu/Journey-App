
//Adding a Basic Template to MongoDb
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Trip', { useNewUrlParser: true ,useUnifiedTopology: true})


const TripDB = require("./Favorites")

const new1 = new TripDB({
    Cityname: "Tel Aviv",
       CountryName: "Israel",
       weather: { temperature: 38, condition: "Sun", conditionPic: "URL" }, 
       FavoritePlaces:["url1", "url2"]})

new1.save()