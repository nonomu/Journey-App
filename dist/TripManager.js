
class TripManager {
    constructor() {
        this.tripData = []
    }

  async getCityWeather(destinationObject){
    await $.post("/cityWeather", destinationObject,function(weather,err){
            return weather
        })
    }

    
    
}

