const basicDB= require('./server/models/Favorites')

const new1=new basicDB({CityName:"Noam"})

new1.save()