
// const render = new Renderer()
// const trip = new TripManager()

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


console.log (distance(31.871295, 34.681617,31.759447, 35.231707,"K"))


const IconsTransfer ={
    "01d": "01",
    "02d": "02",
    "03d": "07",
    "04d":"08",
    "09d":"12",
    "10d":"18",
    "11d":"15",
    "13d":"22",
    "50d":"26",
    "01n": "33",
    "02n": "35",
    "03n": "36",
    "04n":"38",
    "09n":"39",
    "10n":"40",
    "11n":"42",
    "13n":"43",
    "50n":"26",
}
const IconLink="uds-static.api.aero/weather/icon/lg/<Number HERE>.png"
console.log(IconsTransfer["01n"])
