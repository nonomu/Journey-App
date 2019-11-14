
class Renderer {
   
    renderWeather(weather) {
        $("#cities").empty()
        $("#sites").empty()
        let source = $("#weather-template").html()
        let template = Handlebars.compile(source)
        let weatherHTML = template(weather)
        $("#cities").append(weatherHTML)
    }

    renderSites(sites){
        $("#sites").empty()
        let source = $("#site-template").html()
        let template = Handlebars.compile(source)
        let sitesHTML = template({sites})
        $("#sites").append(sitesHTML)
    }
    renderFavorites(favList){
        $("#favorites").empty()
        let source = $("#favorite-template").html()
        let template = Handlebars.compile(source)
        let favoHTML = template({favList})
        $("#favorites").append(favoHTML)
    }
  
}

