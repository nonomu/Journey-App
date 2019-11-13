
class TripManager {
    constructor() {
        this.tripData = []
    }


    async getCityWeather(destinationObject) {
        let weather = await $.post("/cityWeather", destinationObject)
        return weather
    }

    async getSites(destinationObject){
        let sites = await $.post("/sites",destinationObject)
        return sites
    }
}




