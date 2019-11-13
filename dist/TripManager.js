
class TripManager {
    constructor() {
        this.tripData = []
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

    async getCityWeather(destination) {
        let capDestination = {
            cityName: this._stringForAPI(destination.cityName),
            countryName: this._stringForAPI(destination.countryName)
        }
        console.log(capDestination)
        let weather = await $.post("/cityWeather", capDestination)
        return weather
    }

    async getSites(destinationObject){
        let sites = await $.post("/sites",destinationObject)
        return sites
    }
}




