
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

var getInfo = function() {
	//app id: 9a4ba65e
	//key: a815ff246e0c1fc37b2c0442e7e1f080

	$.get('https://api.rasp.yandex.net/v1.0/schedule/',{
		apikey: 'c6530a0e-a09c-4e8f-827d-d26d44418119',
		format: 'json',
		station: 'DMD',
		lang: 'ru',
		date: new Date().yyyymmdd(),
		transport_types: 'plane',
		system: 'iata',
		show_systems: 'iata'
	}, function(data) {
		console.log(data);
	});
};
