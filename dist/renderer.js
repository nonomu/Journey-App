
class Renderer {
    constructor() {
        this.starTotal = 5
    }

    renderRating(rating,letter) { 
            const starPercentage = (rating / this.starTotal) * 100;
            const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
            $(`.${letter}`).find(".stars-inner").css({width: `${starPercentageRounded}`})
          
    }


    renderWeather(weather) {
        $("#cities").empty()
        $("#sites").empty()
        let source = $("#weather-template").html()
        let template = Handlebars.compile(source)
        let weatherHTML = template(weather)
        $("#cities").append(weatherHTML)
    }

    renderSites(sites) {
        let letters = ["a","b","c","d","e"]

        for (let site in sites) {
            sites[site].letter = letters[site]
        }

        $("#sites").empty()
        let source = $("#site-template").html()
        let template = Handlebars.compile(source)
        let sitesHTML = template({ sites })
        $("#sites").append(sitesHTML)
    }

    renderFavorites(favList) {
        $("#favorites-container").empty()
        let source = $("#favorite-template").html()
        let template = Handlebars.compile(source)
        let favoHTML = template({ favList })
        $("#favorites-container").append(favoHTML)
    }
    renderFlights(flyList) {
        $("#sites").empty()
        let source = $("#flights-template").html()
        let template = Handlebars.compile(source)
        let sitesHTML = template({ flyList })
        $("#sites").append(sitesHTML)
    }

}

