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
    console.log(placeObj)
    let cityName = placeObj.cityName
    let countryName = placeObj.countryName
    
    let result = await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName},${countryName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=${APIkey}&language=EN`)
    result = JSON.parse(result)        
    latitude = result.candidates[0].geometry.location.lat
    longitude = result.candidates[0].geometry.location.lng
    
    result =  await requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=20000&key=${APIkey}&pagetoken`)
    result = JSON.parse(result)
    let places = result.results
    placesIDs = places.map(p =>   {return p.place_id})

    let placesDetails = []
    for(let p of placesIDs){
        let place = await requestPromise(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${p}&fields=name,rating,formatted_address,type,international_phone_number,opening_hours,website&key=${APIkey}`)
        place = JSON.parse(place)   
        let types = ["cafe", "bar", "museum", "night_club", "restaurant", "food", "art_gallery", "spa", "stadium", "shopping_mall", "tourist_attraction", "zoo"]
        for(t of types){
            if(place.result.types.includes(t)){
                placesDetails.push({
                    siteName: place.result.name,
                    address: place.result.formatted_address,
                    phone: place.result.international_phone_number,
                    openningHours: place.result.opening_hours.weekday_text,
                    rating: place.result.rating,
                    website: place.result.website
                })
            } 
        }
         
    }
    res.send(placesDetails)
})


router.get('/favorites',async function(req, res){
   let data =await Favorites.find({})
         res.send(data)
})
router.put('/favorites/add',async function(req, res){
    let cityData =req.body
    const FavObj={
        siteName: cityData.siteName,
        address:cityData.address,
        openningHours:cityData.openningHours,
        rate:cityData.rate,
        picture:cityData.picture ,
        website:cityData.website }
    const FavArr=[FavObj]
    const Favdb= await Favorites.findOne({Cityname: cityData.Cityname,CountryName: cityData.CountryName})
    if(Favdb==null)  
    {
        let city = new Favorites({Cityname:cityData.Cityname,CountryName:cityData.CountryName,FavoritePlaces:FavArr})
        await city.save()
    }
    else{
    await Favorites.update(
        {Cityname:cityData.Cityname,CountryName: cityData.CountryName},
        { $push: { FavoritePlaces:
                 {	
                 siteName:cityData.siteName,
                address:cityData.address,
                 openningHours:cityData.openningHours,
                 rate:cityData.rate,
                 picture:cityData.picture,
                 website:cityData.website}
                  } }
         )
    }
    res.send("Thx")
})
router.put('/favorites/remove',async function(req, res){
    let cityData =req.body
   const data= await Favorites.update(
            {Cityname:cityData.Cityname,CountryName: cityData.CountryName},
                { $pull: { "FavoritePlaces": {	
                    "address": cityData.address,
                    "siteName": cityData.siteName
                 }}}
             )
             console.log(data);
    res.send("Deleted")
})


module.exports = router

