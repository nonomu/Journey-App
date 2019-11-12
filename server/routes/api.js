const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")

// const KeyID = ""

router.get('/places/:cityName', async function(req, res){
    // getting city id for the next request
    let cityName = req.params.cityName
    await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk&language=EN`,

    function(err, result){           
        result = JSON.parse(result.body)
        console.log(result);
        
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
