
class TripManager {
    constructor() {
        this.favorites = [],
        this.flights=[],
        this.sites=[],
        this.weather = [],
        this.dates = {}
    }

    setDates(dates){
        this.dates = dates
    }
    _stringFromDOM(destination) {
        if(destination){
            let cityCountryArray = destination.split(", ")
            let capDestination = {
                cityName: cityCountryArray[0],
                countryName: cityCountryArray[1]
            }
            return capDestination
        }
    }
     async getFlights(locations){
        let currentLocation = this._stringFromDOM(locations.currenLocation)
        let destLocation =this._stringFromDOM(locations.destLocation)
        const dates = this.dates
        let desAndCurrent= {currentLocation,destLocation,dates}
        console.log(desAndCurrent)
         const flightsData = await $.post('/flights',desAndCurrent)
         let flightsDataModified= flightsData.map(f=>{return {
            cityFrom:f.cityFrom,
            cityTo:f.cityTo, 
            route:f.route.length ,
            price:f.conversion.USD,
            duration: f.fly_duration,
            link: f.deep_link,
            bagPrice: f.bags_price["1"]
         }})
         this.flights=flightsDataModified
         return flightsDataModified
     }
    async getCityWeather(destination) {
        let capDestination = this._stringFromDOM(destination)
        let weather = await $.post('/cityWeather', capDestination)
        let temp = parseInt(weather.temperature)
        weather.temperature = temp
        this.weather = weather
    }

    async getSites(destination, type) {
        let capDestination = this._stringFromDOM(destination)
        let fiveSites = await $.post(`/sites/${type}`, capDestination)
        let newSites = []
        for (let site of fiveSites) {
            let rating = Number.parseFloat(site.rating).toFixed(1)
            site.rating = rating
            newSites.push(site)
        }
        return newSites
    }

    addToFavorites(destination, site) {
        let destObj = this._stringFromDOM(destination)
        
        let favSite = {
            siteName: site.siteName,
            address: site.address,
            openingHours: site.openingHours,
            rating: site.rating
        }
        let favAndDest = {
            cityName: destObj.cityName,
            countryName: destObj.countryName,
            siteName: site.siteName,
            address: site.address,
            openingHours: site.openingHours,
            rating: site.rating
        }

        $.post('/favorites', favAndDest, function (response, err) {
            console.log(response)
        })
    }

    removeFromFavorites(destination, site) {
        let destObj = this._stringFromDOM(destination)
        let siteForDel = {
            cityName: destObj.cityName,
            countryName: destObj.countryName,
            siteName: site.siteName,
            address: site.address,
            openingHours: site.openingHours,
            rating: site.rating,
        }
        let index = 0
        for (let favorite of this.favorites) {
            if (favorite.cityName === siteForDel.cityName && favorite.siteName === siteForDel.siteName && favorite.address === siteForDel.address) {
                this.favorites.splice(index, 1)
                console.log(index)
                console.log(this.favorites)
            }
            index++
        }

        $.ajax({
            method: "DELETE",
            url: `/favorites`,
            data: siteForDel,
            success: function (err, res) {
                console.log(`${res} was succesfully removed`)
            },
            error: function (err) {
                console.log('Delete request did not succeed')
            }

        })


    }
    async getFavorites() {
        let data=await $.get('/favorites')
            return data      
         }
    
        
}

