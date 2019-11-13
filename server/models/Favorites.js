const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FavoriteSchema = new Schema({
    cityName: String,
    countryName:String,
    favoritePlaces:[
        // {
        //     siteName:String,
        //     address:String,
        //     openningHours:String,
        //     rate:Number,
        //     picture:String,
        //     website:String
        // }
    ]
})

const Favorites = mongoose.model("FavoriteTrips", FavoriteSchema)



module.exports = Favorites


