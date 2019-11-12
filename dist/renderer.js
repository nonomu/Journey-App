
class Renderer {
   
    renderWeather(weather) {
        $("#main-container").empty()
        let source = $("#weather-template").html()
        let template = Handlebars.compile(source)
        let newHTML = template(weather)
        $("#main-container").append(newHTML)
    }

    renderData(allCityData) {
        
    }
}

