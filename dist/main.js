const render = new Renderer()
const tripManager = new TripManager()

$("#submit").on("click", async function () {
    let destination = {
        city: $("#des-city").val(),
        state: $("#des-state").val()
    }

    console.log(destination)

    let weather = await getCityWeather(destination)
    render.renderWeather(weather)
})
