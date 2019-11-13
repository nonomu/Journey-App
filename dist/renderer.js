
class Renderer {
   
    renderWeather(weather) {
        $("#cities").empty()
        let source = $("#weather-template").html()
        let template = Handlebars.compile(source)
        let weatherHTML = template(weather)
        $("#cities").append(weatherHTML)
    }

    renderSites(sites) {
        $("#sites").empty()
        let source = $("#site-template").html()
        let template = Handlebars.compile(source)
        let weatherHTML = template({sites})
        $("#sites").append(weatherHTML)
    }
}

