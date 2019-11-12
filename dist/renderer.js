
class Renderer {
    _renderCity(allCityData) {
        let source = $('#wheather-template').html()
        let template = Handlebars.compile(source)
        let newHTML = template({ allCityData })
        $('.weather-container').empty().append(newHTML)
    }
    renderData(allCityData) {
        
    }
}

