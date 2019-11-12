const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FavoriteSchema = new Schema({
    Cityname: String,
    CountryName:String,
    weather: {
        temperature: Number,
        condition: String,
        conditionPic: String
    },
    FavoritePlaces:[]
})

const Favorites = mongoose.model("FavoriteTrips", FavoriteSchema)



module.exports = Favorites


