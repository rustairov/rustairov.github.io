window.AudioContext = window.AudioContext || window.webkitAudioContext;

var Player = function() {
	/* Class variables */
	this.fileName = '';
	this.title = '';
	this.artist = '';
	this.isPlaying = false;
	this.volume = 0;

	this._context = new (window.AudioContext || window.webkitAudioContext)();
	
    this._gain = this._context.createGain();
	this._gain.connect(this._context.destination);
	this._gain.gain.value = this.volume;
	
    this._analyser = this._context.createAnalyser();
    this._analyser.connect(this._context.destination);
    this._analyser.minDecibels = -140;
    this._analyser.maxDecibels = 0;
    
    this._analyser.fftSize = 64;
    //TODO what is it?
    //this._analyser.smoothingTimeConstant = .8;
    this._freqs = new Uint8Array(this._analyser.frequencyBinCount);
    
    this.visualize();
};

Player.prototype.load = function(file, callback) {
    if (this.isPlaying) {
        this.stop();
    }
    
    this.fileName = file.name;
    
    this._source = this._context.createBufferSource();
    this._source.loop = true;
    this._source.connect(this._context.destination);
    this._source.connect(this._gain);
    this._source.connect(this._analyser);
    
    this._reader = new FileReader();
	this._reader.onload = function(e) {
		this._context.decodeAudioData(e.target.result, function(buffer) {
			this._source.buffer = buffer;
            if (callback) { callback.apply(this); }
		}.bind(this));
	}.bind(this);
    
    this._reader.readAsArrayBuffer(file);
};

Player.prototype._reload = function() {
    var buffer = this._source.buffer;
    
    //TODO DRY!
    this._source = this._context.createBufferSource();
    this._source.loop = true;
    this._source.connect(this._context.destination);
    this._source.connect(this._gain);
    this._source.connect(this._analyser);
    this._source.buffer = buffer;
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
        //context.fillStyle = 'rgba(46,109,164,.3)';
        context.fillStyle = 'rgba(80,80,80,.3)';
        context.fillRect(i * barWidth, offset, barWidth, height);
    }
    
    requestAnimationFrame(this.visualize.bind(this));  
};

Player.prototype.play = function() {
    this._source.start(0);
    this.isPlaying = true;
};

Player.prototype.stop = function() {
    this._source.stop(0);
    this._reload();
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