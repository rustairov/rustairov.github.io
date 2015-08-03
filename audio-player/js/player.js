
var Player = function() {
	/* Class variables */
	this.fileName = '';
	this.title = '';
	this.artist = '';
	this.isPlaying = false;
	this.volume = 1;

	var context = new (window.AudioContext || window.webkitAudioContext)();
	this._gain = context.createGain();
	this._gain.connect(context.destination);
	this._gain.gain.value = this.volume;
	this._source = context.createBufferSource();
	this._source.connect(this._gain);
	this._source.connect(context.destination);

	this._reader = new FileReader();
	this._reader.onload = function(e) {
		context.decodeAudioData(e.target.result, function(buffer) {
			this._source.buffer = buffer;
		}.bind(this), function(error) {
			console.error('Error with decoding audio data: ' + error.err);
		});
	}.bind(this);
    
    
};

Player.prototype.load = function(file, callback) {
    this._reader.readAsArrayBuffer(file);

    this.fileName = file.name;
    if (callback) { callback.apply(this); }
};

Player.prototype.play = function() {
    this._source.start(0);
    //this._source[this._source.start ? 'start' : 'noteOn'](0);
    this.isPlaying = true;
};

Player.prototype.stop = function() {
    this._source.stop(0);
    //this._source[this._source.stop ? 'stop' : 'noteOff'](0);
    this.isPlaying = false;
};

Player.prototype.volumeUp = function() {
    this.volume = this._gain.gain.value += .1;
};

Player.prototype.volumeDown = function() {
    this.volume = this._gain.gain.value -= .1;
};

Player.prototype.setEqualizer = function(equalaizer) {
	//set eq
};