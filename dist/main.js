const render = new Renderer()
const tripManager = new TripManager()

$("#submit").on("click", async function () {
    let destination = {
        cityName: $("#des-city").val(),
        countryName: $("#des-state").val()
    }

    let weather = await tripManager.getCityWeather(destination)
    render.renderWeather(weather)
})

$("#cities").on("click", ".explore", async function () {
    let destination = $(this).siblings("p").text()
    console.log(destination)
    let sites = await tripManager.getSites(destination)
    // let sites = [{ siteName: "Hello", address: "Boo 12,st", openningHours: true, rate: 5 }, { siteName: "Bye", address: "Bee 21,st", openningHours: false, rate: 2.5 }]
    console.log(sites)
    render.renderSites(sites)
})

