const render = new Renderer()
const tripManager = new TripManager()


let userLocation = document.getElementById('user-location');
let autocomplete1 = new google.maps.places.Autocomplete(userLocation, { types: ['(cities)'] });
google.maps.event.addListener(autocomplete1, 'place_changed', async function () {

})
const getFavorites = async () => {
    await tripManager.getFavorites()
}
getFavorites()
let input = document.getElementById('autocomplete');
let autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
google.maps.event.addListener(autocomplete, 'place_changed', async function () {
    let destLocation = $("#autocomplete")[0].value
    await tripManager.getCityWeather(destLocation)
})




$('#date-picker').on('keypress', function (e) {
    console.log(e.which)
    if (e.which == 13) {
        let fromDate = $('#from-date').val()
        let toDate = $('#to-date').val()
        if (fromDate && toDate) {
            const dates = { fromDate, toDate }
            tripManager.setDates(dates)
            render.renderWeather(tripManager.weather)
        } else {
            alert('Please fill in all fields')
        }
    }
})

$("#cities").on("change", "select", async function () {
    let type = $(".types option:selected").val()
    let destLocation = $("#autocomplete")[0].value
    let currentLocation = $("#user-location")[0].value
    tripManager.sites = await tripManager.getSites(destLocation, type)

    $("#sites").empty()
    let sites = tripManager.sites
    render.renderSites(sites)

    for (let site of tripManager.sites) {
        render.renderRating(site.rating, site.letter)
    }

    let locations = { currenLocation: currentLocation, destLocation: destLocation }
    await tripManager.getFlights(locations)
    $(".city-info").append("<button id = find-flights >Find Flights</button>")
})





// $("#cities").on("click", ".explore", async function () {
//     render.renderSites(tripManager.sites)
//     for (let site of tripManager.sites) {
//         render.renderRating(site.rating,site.letter)
//     }
//     let currenLocation = $("#user-location")[0].value
//     let place = $("#autocomplete")[0].value
//     let locations = { currenLocation: currenLocation, place: place }
//     await tripManager.getFlights(locations)
//     $(this).text("Find Flights")
//     $(this).attr("class", "find-flights")


// })

$(function () {
    var dateFormat = "mm/dd/yy",
        from = $("#from-date")
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#to-date").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
})

$("#cities").on("click", ".find-flights", async function () {
    $(this).text("Explore")
    render.renderFlights(tripManager.flights)
    $(this).attr("class", "explore")
})

$("#favorite-text").on("click", async function () {
    if ($(this).hasClass("unclicked")) {
        let sites = await tripManager.getFavorites()
        render.renderFavorites(sites)
        $(this).attr("class", "clicked")
        $("#favorites-container").hide().slideDown("slow")
    } else if ($(this).hasClass("clicked")) {
        $("#favorites-container").slideUp(500)
        $(this).attr("class", "unclicked")
    }
})



$("#sites").on("click", ".fa-plus-circle", function () {
    let destination = $(this).closest("#sites").siblings("#cities").find(".city-info").find("p").text()
    let chosenElement = $(this).closest(".favorite")
    let site = {
        siteName: chosenElement.siblings("p").text(),
        address: chosenElement.siblings(".address").text(),
        openingHours: chosenElement.siblings(".hours").text(),
        rating: chosenElement.siblings(".rating").text(),
        website: chosenElement.closest(".site-info").siblings(".more-info").find("a").attr("href")
    }
    tripManager.addToFavorites(destination, site)
    $(this).attr("class", "fas fa-minus-circle")
})

$("#sites").on("click", ".fa-minus-circle", async function () {
    let destination = $(this).closest("#sites").siblings("#cities").find(".city-info").find("p").text()
    let chosenFavoriteElement = $(this).closest(".favorite")
    let site = {
        siteName: chosenFavoriteElement.siblings("p").text(),
        address: chosenFavoriteElement.siblings(".address").text(),
    }
    await tripManager.removeFromFavorites(destination, site)

    $(this).attr("class", "fas fa-plus-circle")
})

$("#favorites-container").on("click", ".fa-minus-circle", async function () {
    let chosenFavoriteElement = $(this)
    let site = {
        siteName: chosenFavoriteElement.siblings("p").text(),
        address: chosenFavoriteElement.siblings(".address").text(),
    }
    let cityFavoritesLength = ($(this).closest(".city-fav-list").find('.fav-place').length) - 1
    let destination = $(this).closest(".city-fav-list").find('.city-fav-name')[0].innerHTML
    if (cityFavoritesLength == 0)
        $(this).closest('.city-fav-list').remove()
    await tripManager.removeFromFavorites(destination, site)
    let sites = tripManager.sites
    render.renderSites(sites)
    for (let site of tripManager.sites) {
        render.renderRating(site.rating, site.letter)
    }
    $(this).closest('.fav-place').remove()
}
)




