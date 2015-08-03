
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
	
    this._analyser = context.createAnalyser();
    this._analyser.connect(context.destination);
    this._analyser.minDecibels = -140;
    this._analyser.maxDecibels = 0;
    //TODO what is it?
    this._analyser.fftSize = 64;
    //this._analyser.smoothingTimeConstant = .8;
    this._freqs = new Uint8Array(this._analyser.frequencyBinCount);
    
    this._source = context.createBufferSource();
    this._source.connect(context.destination);
    this._source.loop = true;
    this._source.connect(this._gain);
    this._source.connect(this._analyser);
    
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

Player.prototype.visualize = function() {
    
    this._analyser.getByteFrequencyData(this._freqs);
    
    var canvas = document.querySelector('canvas');
    canvas.width = document.querySelector('.cover').offsetWidth - 1;
    canvas.height = document.querySelector('.cover').offsetHeight - 1;
    var context = canvas.getContext('2d');
    
    for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
        var value = this._freqs[i];
        var percent = value / 256;
        var height = canvas.height * percent;
        var offset = canvas.height - height - 1;
        var barWidth = canvas.width / this._analyser.frequencyBinCount;
        var hue = i / this._analyser.frequencyBinCount * 360;
        /* diffrent styles */
        //context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        context.fillStyle = 'rgba(51,122,183,.3)';
        context.fillRect(i * barWidth, offset, barWidth, height);
    }
    
    requestAnimationFrame(this.visualize.bind(this));  
};


Player.prototype.play = function() {
    this._source.start(0);
    this.visualize();
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