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
var airports = mongoose.model('airports', new Schema({ name: String, iata_code: String }));
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"
const FlightsAPIbasicURL = "https://api.skypicker.com/flights?"

require('dotenv').config()
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

router.get('/get/', async function (req, res) {
    res.end()
})
router.post('/flights', async function (req, res) {
    let curCityName = req.body[`currentLocation[cityName]`]
    let curCountryName = req.body[`currentLocation[countryName]`]
    let desCityName = req.body[`destLocation[cityName]`]
    let desCountryName = req.body[`destLocation[countryName]`]
    let fromDate = req.body['dates[fromDate]'].split("/")
    let toDate = req.body['dates[toDate]'].split("/")
    newFromDate = [fromDate[1], fromDate[0], fromDate[2]]
    newToDate = [toDate[1], toDate[0], toDate[2]]
    fromDate = newFromDate.join("/")
    toDate = newToDate.join("/")
    try {
        let curairport = await airports.find(
            { city: curCityName },
            { "iata_code": 1, "_id": 0 })

        let destairport = await airports.find(
            { city: desCityName },
            { "iata_code": 1, "_id": 0 })

        const curiata = curairport[0]._doc.iata_code
        const destiata = destairport[0]._doc.iata_code
        let requestURL = `https://api.skypicker.com/flights?fly_from=airport:${curiata}&fly_to=airport:${destiata}&date_from=${fromDate}&date_to=${toDate}&partner=picky&flight_type=round&curr=ILS&max_stopovers=0&ret_from_diff_airport=0&limit=5`
        if (destiata && curiata) {
            const flightsData = await requestPromise(requestURL)
            const flightsDataParsed = JSON.parse(flightsData)
            res.send(flightsDataParsed.data)
            return
        }
        else {
            return false
        }
    }
    catch (err) {
        res.send(err.errmsg)
    }
})

router.post('/cityWeather', async function (req, res) {
    let cityName = req.body.cityName
    let countryName = CityStateToCode[req.body.countryName]
    try {
        const weatherData = await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},${countryName}&units=metric&APPID=${process.env.Weather_Api_Key}`)
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

router.post('/sites/:type', async function (req, res) {
    const APIkey = process.env.Google_Api_Key
    let type = req.params.type
    let placeObj = req.body
    let cityName = placeObj.cityName
    let countryName = placeObj.countryName
    let result = await requestPromise(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+${cityName}+${countryName}&key=${APIkey}`)
    let sitesOfType = JSON.parse(result)
    let index = 0
    let sitesResults = []
    for (let site of sitesOfType.results) {
        if (site.rating && !site.permenantly_closed && site.opening_hours) {
            let updatedSite = {
                siteName: site.name,
                address: site.formatted_address,
                openingHours: site.opening_hours.open_now,
                rating: site.rating
            }
            sitesResults.push(updatedSite)
        }
        index++
    }
    sitesResults.shift()
    sitesResults.sort(function (a, b) {
        return a.rating - b.rating
    })
        .reverse()
    let fiveSites = sitesResults.splice(0, 5)
    res.send(fiveSites)
})
router.get('/favorites', async function (req, res) {
    let data = await Favorites.find({})
    res.send(data)
})
router.post('/favorites', async function (req, res) {
    let cityData = req.body
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
    }
    res.send("Thx")
})
router.delete('/favorites', async function (req, res) {
    let cityData = req.body
    let data = await Favorites.findOneAndUpdate(
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
            new: true,
            upsert: true
        }
    )
    if (data.favoritePlaces.length == 0)
        data = await Favorites.findOneAndDelete({ cityName: cityData.cityName, countryName: cityData.countryName })
    res.send(data)
})
module.exports = router

// render.renderSites(tripManager.sites)
// $(this).text("Find Flights")
// let currenLocation = $("#user-location")[0].value
// let place = $("#autocomplete")[0].value
// let locations={currenLocation:currenLocation,place:place}
// const flights=await tripManager.getFlights(locations)
// console.log(flights);