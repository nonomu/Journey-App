const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")
const Transfer =require("./transfer")
const IconsTransfer=Transfer.IconsTransfer
const CityStateToCode=Transfer.CityStateToCode
const CodeToCityState=Transfer.CodeToCityState
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"





router.post('/cityWeather', async function (req, res) {
    const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
    let cityName=req.body.cityName
    let countryName=CityStateToCode[req.body.countryName]
    try {
        const weatherData =  await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},${countryName}&units=metric&APPID=${APPID}`)
        const data= JSON.parse(weatherData)
        const IconModified= IconsTransfer[data.weather[0].icon]
        const weatherModified = {
            cityName: data.name , countryName: CodeToCityState[data.sys.country], temperature : data.main.temp,description:data.weather[0].description, icon: `https://uds-static.api.aero/weather/icon/lg/${IconModified}.png` , lon: data.coord.lon , lat: data.coord.lat
        }
        res.send(weatherModified)
    }
    catch (err) {
         res.status(400)
        res.send(err.message)
        
    }
})

router.post('/sites', async function(req, res){
    const APIkey = 'AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk'
    let placeObj = req.body
    let   cityName = placeObj.cityName
    let countryName = placeObj.countryName
    await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName},${countryName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=${APIkey}&language=EN`,

    function(err, result){           
        result = JSON.parse(result.body)
        console.log(result);
        
        latitude = result.candidates[0].geometry.location.lat
        longitude = result.candidates[0].geometry.location.lng
        requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${APIkey}&pagetoken`,

            function(err, result){           
                result = JSON.parse(result.body)
                let places = result.results
                places = places.filter(p => places.indexOf(p) < 6 && places.indexOf(p) >0)                
                places = places.map(p =>   {return {siteName: p.name, address: p.vicinity, openningHours: p.opening_hours ? p.opening_hours.open_now : false, rate: p.rating}})

                res.send(places)
            })
    })
})

router.post('/favorites', function(req, res){
    let cityData = req.body    
    let city = new Favorites(cityData)
    city.save()
    res.send(city)
})


module.exports = router
