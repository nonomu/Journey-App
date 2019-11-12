
class Renderer {
    renderWeather(weather) {
        let source = $('#weather-template').html()
        let template = Handlebars.compile(source)
        let newHTML = template(weather)
        $('.weather-container').empty().append(newHTML)
    }
    renderData(allCityData) {
        
    }
}

