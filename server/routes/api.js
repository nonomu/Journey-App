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
    let cityName = placeObj.cityName
    let countryName = placeObj.countryName
    let result = await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName},${countryName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=${APIkey}&language=EN`)
    
    result = JSON.parse(result)       
    latitude = result.candidates[0].geometry.location.lat
    longitude = result.candidates[0].geometry.location.lng
    
    result =  await requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&key=${APIkey}&pagetoken`)
    result = JSON.parse(result)
    let places = result.results
    let placesIDs = places.map(p =>  {return p.place_id})

    let placesDetails = []
    for(let p of placesIDs){
        let place = await requestPromise(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${p}&fields=name,rating,formatted_address,type,international_phone_number,opening_hours,website&type=tourist_attraction&key=${APIkey}`)
        place = JSON.parse(place)   
        if(place.result.rating){
            placesDetails.push({
                siteName: place.result.name,
                address: place.result.formatted_address,
                phone: place.result.international_phone_number,
                openingHours: place.result.opening_hours ? place.result.opening_hours.weekday_text : false,
                rating: place.result.rating,
                website: place.result.website
            })
        }           
    }
    
     placesDetails.shift()
     placesDetails.sort(function(a, b){
        return a.rating-b.rating
    })
    .reverse()
    placesDetails = placesDetails.splice(0, 5)
    res.send(placesDetails)
})


router.get('/favorites',async function(req, res){
   let data =await Favorites.find({})
         res.send(data)
})

router.post('/favorites',async function(req, res){
    let cityData =req.body
    console.log(cityData)
    const FavObj={
        siteName: cityData.siteName,
        address:cityData.address,
        openingHours:cityData.openingHours,
        rating:cityData.rating,
        picture:cityData.picture ,
        website:cityData.website }
        console.log(FavObj)
    
    const FavArr = [FavObj]
    const Favdb = await Favorites.findOne({cityName: cityData.cityName,countryName: cityData.countryName})
    if(Favdb==null)  
    {
        let city = new Favorites({cityName:cityData.cityname,countryName:cityData.countryName,favoritePlaces:FavArr})
        await city.save()
    }
    else{
    await Favorites.findOneAndUpdate(
        {cityName:cityData.Cityname,countryName: cityData.countryName},
        { $push: { FavoritePlaces:
                 {	
                 siteName:cityData.siteName,
                address:cityData.address,
                 openingHours:cityData.openingHours,
                 rating:cityData.rating,
                 picture:cityData.picture,
                 website:cityData.website}
                  } }
         )
    }
    res.send("Thx")
})

router.delete('/favorites',async function(req, res){
    let cityData =req.body
    Favorites.findOneAndDelete(
            {cityName:cityData.cityName,countryName: cityData.countryName,siteName: cityData.sit},
            { $pull: { "favoritePlaces": {	
                "address": cityData.address,
                "siteName": cityData.siteName
             }}}
             )
    res.send("Deleted")
})


module.exports = router

