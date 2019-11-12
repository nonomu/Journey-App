const render = new Renderer()
const trip = new TripManager()

$("#submit").on("submit",async function () {
    let destination = {
        city: $("#des-city").val(),
        state: $("#des-state").val()
    }

     let weather = await getCityWeather(destination)
     render.renderWeather(weather)
})
