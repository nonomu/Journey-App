
class TripManager {
    constructor() {
        this.sites = []
    }

    _stringForAPI(string) {
        const brokenString = string.split(" ")
        if (brokenString.length > 1) {
            for (let word in brokenString) {
                let upperCased = brokenString[word][0].toUpperCase() + brokenString[word].slice(1)
                brokenString.splice(word, 1, upperCased)
            }

            string = brokenString.join(" ")
        } else {
            string = brokenString[0][0].toUpperCase() + brokenString[0].slice(1)
        }
        return string
    }

    _stringFromDOM(destination) {
        let cityCountryArray = destination.split(", ")
        let capDestination = {
            cityName: cityCountryArray[0],
            countryName: cityCountryArray[1]
        }
        return capDestination
    }

    async getCityWeather(destination) {
        let capDestination = {
            cityName: this._stringForAPI(destination.cityName),
            countryName: this._stringForAPI(destination.countryName)
        }
        let weather = await $.post("/cityWeather", capDestination)
        let temp = parseInt(weather.temperature)
        weather.temperature = temp
        return weather
    }

    async getSites(destination) {
        let capDestination = this._stringFromDOM(destination)
        let sites = await $.post("/sites", capDestination)
        return sites
    }

    addToFavorites(destination, site) {
        let destObj = this._stringFromDOM(destination)
        let favorite = {
            cityName: destObj.cityName,
            countryName: destObj.countryName,
            siteName: site.siteName,
            address: site.address,
            openningHours: site.openningHours,
            rating: site.rating,
            website: site.website,
            picture: ""
        }
        console.log(favorite)
        $.post('/favorite', favorite, function (response, err) {
            console.log(response)
        })
    }
}




