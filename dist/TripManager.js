
class TripManager {
    constructor() {
        this.favorites = [],
        this.flights=[],
        this.sites=[]
    }


    _stringFromDOM(destination) {
        let cityCountryArray = destination.split(", ")
        let capDestination = {
            cityName: cityCountryArray[0],
            countryName: cityCountryArray[1]
        }
        return capDestination
    }
     async getFlights(destination){
        let capDestination = this._stringFromDOM(destination)
         const flightsData=await $.post('/flights',capDestination)
         console.log(flightsData)
         this.flights= flightsData
     }
    async getCityWeather(destination) {
        let capDestination = this._stringFromDOM(destination)
        let weather = await $.post('/cityWeather', capDestination)
        let temp = parseInt(weather.temperature)
        weather.temperature = temp
        return weather
    }

    async getSites(destination) {
        let capDestination = this._stringFromDOM(destination)
        let sites = await $.post("/sites", capDestination)
        let newSites = []
        for (let site of sites) {
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

