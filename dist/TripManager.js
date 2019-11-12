
class TripManager {
    constructor() {
        this.tripData = []
    }

  async getCityWeather(destinationObject){
    await $.post("/cityWeather", destinationObject,function(err,res){
            let weather = res.body
            return weather
        })
    }

    
    
}

