const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")

const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"


router.post('/cityWeather', async function (req, res) {
    const cityName=req.body.cityName
    const countryName=req.body.countryName
    try {
        const weatherData =  await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},q=${countryName}&units=metric&APPID=${APPID}`)
        const data= JSON.parse(weatherData)
        const weatherModified = {
            CityName: data.name , CountryName: data.sys.country, Temperature : data.main.temp,Description:data.weather[0].description, Icon: data.weather[0].icon
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
