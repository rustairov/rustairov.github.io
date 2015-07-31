
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

var getInfo = function() {
	//app id: 19d57e69
	//key: e0ea60854c1205af43fd7b1203005d59

	//app id: 9cabcbff
	//key: c06f54f8a3fedd00f96b3fe4c97ee262
	//curl -v  -X GET "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/DME/dep/2015/7/31/13?appId=9cabcbff&appKey=c06f54f8a3fedd00f96b3fe4c97ee262&utc=true&numHours=6&codeType=IATA"

	var date = new Date()
		, airport = 'DME'
		, mode = 'dep'
		, year = date.getFullYear().toString()
		, month = (date.getMonth()+1).toString()
		, day = date.getDate().toString()
		, hours = date.getHours().toString()
	;

	var path = airport + '/' + mode + '/' + year + '/' + month + '/' + day + '/' + hours;

	$.get('https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/' + path, {
		appId: '19d57e69',
		appKey: 'e0ea60854c1205af43fd7b1203005d59',
		utc: true,
		numHours: 6,
		codeType: 'IATA'
	}, 'jsonp');

	$.get('https://api.rasp.yandex.net/v1.0/schedule/',{
		apikey: 'c6530a0e-a09c-4e8f-827d-d26d44418119',
		format: 'json',
		station: 'DME',
		lang: 'ru',
		date: new Date().yyyymmdd(),
		transport_types: 'plane',
		system: 'iata',
		show_systems: 'iata'
	}, function(data) {
		console.log(data);
	}, 'jsonp');
};