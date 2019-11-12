const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")

const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"

router.post('/cityWeather', async function (req, res) {
    const cityName=req.body.cityName
    const countryName=req.body.countryName
    try {
        const weatherData =  await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},q=${countryName}&units=metric&APPID=${APPID}`)
        res.send(JSON.parse(weatherData))
    }
    catch (err) {
         res.status(400)
        res.send(err.message)
        
    }

})

module.exports = router
