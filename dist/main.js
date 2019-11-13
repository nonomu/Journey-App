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
    let sites = await tripManager.getSites(destination)
    render.renderSites(sites)
})

$("#sites").on("click",".fa-plus-circle",function(){
    let destination = $(this).closest("#sites").siblings("#cities").find(".city-info").find("p").text()
    let site = {
        siteName: $(this).closest(".favorite").siblings("p").text(),
        address: $(this).closest(".favorite").siblings(".address").text(),
        openningHours: $(this).closest(".favorite").siblings(".hours").text(),
        rating: $(this).closest(".favorite").siblings(".rating").text(),
        // website: $(this).closest(".favorite").siblings(".website").text()
    }
    tripManager.addToFavorites(destination,site)
})
