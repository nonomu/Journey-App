const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FavoriteSchema = new Schema({
    cityName: String,
    countryName:String,
    favoritePlaces:[]
})

const Favorites = mongoose.model("FavoriteTrips", FavoriteSchema)



module.exports = Favorites


