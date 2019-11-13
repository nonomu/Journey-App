
class TripManager {
    constructor() {
        this.tripData = []
    }


  async getCityWeather(destinationObject){
    let weather =  await $.post("/cityWeather", destinationObject)
           return  (weather)
        }
    }

    

