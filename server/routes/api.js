const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")
const Transfer = require("./transfer")
const IconsTransfer = Transfer.IconsTransfer
const CityStateToCode = Transfer.CityStateToCode
const CodeToCityState = Transfer.CodeToCityState
var airports = mongoose.model('airports', new Schema({ name: String }));
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"
const FlightsAPIbasicURL = "https://api.skypicker.com/flights?"
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

router.get('/get/', async function (req, res) {
    res.end()
})
router.post('/flights', async function (req, res) {
    let cityName = req.body.cityName
    let countryName = req.body.countryName
    try{
    let airportInSameCity = await airports.find(
        { city: cityName },
        { "iata_code": 1, "_id": 0 })
    const iata=airportInSameCity[0]._doc.iata_code
    console.log(airportInSameCity[0]);
    
    if (iata != null) {
        const flightsData = await requestPromise(
            `https://api.skypicker.com/flights?fly_from=airport:TLV&fly_to=airport:${iata}&dateFrom=14/11/2019&dateTo=19/11/2019&partner=picky&return_from=20/11/2019&return_to=12/12/2019&flight_type=round&curr=USD&max_stopovers=1&ret_from_diff_airport=0&limit=5`
            )
        res.send(JSON.parse(flightsData).data)
        res.end()
    }
    else{
        return false

    }
}
catch(err)
{
    res.send(err.errmsg)
}
    

})


router.post('/cityWeather', async function (req, res) {
    const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
    let cityName = req.body.cityName
    let countryName = CityStateToCode[req.body.countryName]
    try {
        const weatherData = await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},${countryName}&units=metric&APPID=${APPID}`)
        const data = JSON.parse(weatherData)
        const IconModified = IconsTransfer[data.weather[0].icon]
        const weatherModified = {
            cityName: data.name, countryName: CodeToCityState[data.sys.country], temperature: data.main.temp, description: data.weather[0].description, icon: `https://uds-static.api.aero/weather/icon/lg/${IconModified}.png`, lon: data.coord.lon, lat: data.coord.lat
        }
        res.send(weatherModified)
    }
    catch (err) {
        res.status(400)
        res.send(err.message)
    }
})

router.post('/sites', async function (req, res) {
    const APIkey = 'AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk'
    let placeObj = req.body
    let cityName = placeObj.cityName
    let countryName = placeObj.countryName
    let result = await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName},${countryName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=${APIkey}&language=EN`)

    result = JSON.parse(result)
    latitude = result.candidates[0].geometry.location.lat
    longitude = result.candidates[0].geometry.location.lng

    result = await requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=bar&radius=2000&key=${APIkey}&pagetoken`)
    result = JSON.parse(result)
    let places = result.results
    let newPlaces = []
    for (p of places) {
        if (p.rating) {
            newPlaces.push({
                siteName: p.name,
                address: p.vicinity,
                openingHours: p.opening_hours ? p.opening_hours.open_now : false,
                rating: p.rating,
            })
        }
    }

    newPlaces.shift()
    newPlaces.sort(function (a, b) {
        return a.rating - b.rating
    })
        .reverse()
    newPlaces = newPlaces.splice(0, 5)
    res.send(newPlaces)

})


router.get('/favorites', async function (req, res) {
    let data = await Favorites.find({})
    res.send(data)
})

router.post('/favorites', async function (req, res) {
    let cityData = req.body
    console.log(cityData)
    const FavObj = {
        siteName: cityData.siteName,
        address: cityData.address,
        openingHours: cityData.openingHours,
        rating: cityData.rating,
    }

    const FavArr = [FavObj]
    const Favdb = await Favorites.findOne({ cityName: cityData.cityName, countryName: cityData.countryName })
    if (Favdb == null) {
        let city = new Favorites({ cityName: cityData.cityName, countryName: cityData.countryName, favoritePlaces: FavArr })
        await city.save()
    }
    else {
        const data = await Favorites.updateOne(
            { cityName: cityData.cityName, countryName: cityData.countryName },
            {
                $push: {
                    favoritePlaces:
                    {
                        siteName: cityData.siteName,
                        address: cityData.address,
                        openingHours: cityData.openingHours,
                        rating: cityData.rating,
                    }
                }
            }
        )
        console.log(data)
    }

    res.send("Thx")
})

router.delete('/favorites', async function (req, res) {
    let cityData = req.body
    const data = await Favorites.findOneAndUpdate(
        { cityName: cityData.cityName, countryName: cityData.countryName },
        {
            $pull: {
                "favoritePlaces": {
                    "address": cityData.address,
                    "siteName": cityData.siteName
                }
            }
        },
        {
            new: false,
            upsert: true
        }
    )
    console.log(data)
    res.send(data)
})


module.exports = router

