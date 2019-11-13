
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
        return weather
    }

    async getSites(destination) {
        let capDestination = this._stringFromDOM(destination)
        let sites = await $.post("/sites", capDestination)
        sites.forEach(s=> this.sites.push(s))
        return this.sites
    }

    addToFavorites(destination, site) {
        let destObj = this._stringFromDOM(destination)
        console.log(destObj)
        let favorite = {
            cityName: destObj[0],
            countryName: destObj[1],
            siteName: site.siteName,
            address: site.address,
            openningHours: site.openningHours,
            rating: site.rating
        }
        $.post('/favorite', favorite, function (response, err) {
            console.log(response)
        })
    }
}




