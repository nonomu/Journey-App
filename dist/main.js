const render = new Renderer()
const tripManager = new TripManager()
let sites

// $("#")
// tripManager.getFavourites()

let input = document.getElementById('autocomplete');
let autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
google.maps.event.addListener(autocomplete, 'place_changed',async function(){
    let place = $("#autocomplete")[0].value
    let weather = await tripManager.getCityWeather(place)
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
        openingHours: $(this).closest(".favorite").siblings(".hours").text(),
        rating: $(this).closest(".favorite").siblings(".rating").text(),
        website: $(this).closest(".favorite").closest(".site-info").siblings(".more-info").find("a").attr("href")
    }
    
    tripManager.addToFavorites(destination,site)
    $(this).attr("class","fas fa-minus-circle")
})

$("#sites").on("click",".fa-minus-circle",function(){
    let destination = $(this).closest("#sites").siblings("#cities").find(".city-info").find("p").text()
    let site = {
        siteName: $(this).closest(".favorite").siblings("p").text(),
        address: $(this).closest(".favorite").siblings(".address").text(),
        openingHours: $(this).closest(".favorite").siblings(".hours").text(),
        rating: $(this).closest(".favorite").siblings(".rating").text(),
        website: $(this).closest(".favorite").closest(".site-info").siblings(".more-info").find("a").attr("href")
    }
    
    tripManager.removeFromFavorites(destination,site)
    $(this).attr("class","fas fa-plus-circle")
})

