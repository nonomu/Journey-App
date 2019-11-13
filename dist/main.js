const render = new Renderer()
const tripManager = new TripManager()

$("#submit").on("click", async function(){
    let destination = {
        cityName: $("#des-city").val(),
        countryName: $("#des-state").val()
    }
    
    let weather = await tripManager.getCityWeather(destination)
    render.renderWeather(weather)
})
