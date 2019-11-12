const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")
const IconsTransfer ={
    "01d": "01",
    "02d": "02",
    "03d": "07",
    "04d":"08",
    "09d":"12",
    "10d":"18",
    "11d":"15",
    "13d":"22",
    "50d":"26",
    "01n": "33",
    "02n": "35",
    "03n": "36",
    "04n":"38",
    "09n":"39",
    "10n":"40",
    "11n":"42",
    "13n":"43",
    "50n":"26",
}
const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"

router.post('/cityWeather', async function (req, res) {
    const cityName=req.body.city
    const countryName=req.body.state
    try {
        const weatherData =  await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},q=${countryName}&units=metric&APPID=${APPID}`)
        const data= JSON.parse(weatherData)
        const IconModified= IconsTransfer[data.weather[0].icon]
        const weatherModified = {
            name: data.name , country: data.sys.country, temp : data.main.temp,description:data.weather[0].description, Icon: `https://uds-static.api.aero/weather/icon/lg/${IconModified}.png`
        }
        res.send(weatherModified)
    }
    catch (err) {
         res.status(400)
        res.send(err.message)
        
    }

})

router.get('/places/:cityName', async function(req, res){
    // getting city id for the next request
    let cityName = req.params.cityName
    await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk`,

    function(err, result){           
        result = JSON.parse(result.body)
        latitude = result.candidates[0].geometry.location.lat
        longitude = result.candidates[0].geometry.location.lng
        requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk&pagetoken`,

            function(err, result){           
                result = JSON.parse(result.body)
                
                res.send(result)
            })
    })
})




module.exports = router
