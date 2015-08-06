window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Player
 * @constructor
 */
var Player = function() {
	/* Class variables */
	this.fileName = '';
	this.title = '';
	this.artist = '';
	this.isPlaying = false;
	this.volume = 1;

	this._context = new AudioContext();
	this._gain = this._context.createGain();
	this._gain.gain.value = this.volume;

	this._analyser = this._context.createAnalyser();
	this._analyser.minDecibels = -140;
	this._analyser.maxDecibels = 0;
	this._analyser.fftSize = 64;
	this._freqs = new Uint8Array(this._analyser.frequencyBinCount);

	this._filters = [];
	var frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
	frequencies.forEach(function(frequency) {
		var filter = this._context.createBiquadFilter();
		filter.type = 'peaking';
		filter.frequency.value = frequency;
		this._filters.push(filter);
	}.bind(this));
	this._filters.reduce(function(a, b) {
		a.connect(b);
		return b;
	});

	this._gain.connect(this._filters[0]);
	this._filters[this._filters.length - 1].connect(this._analyser);
	this._analyser.connect(this._context.destination);

	this._visualize();
};

/**
 * Load local file into player
 * @param {Object} file - event.target.files from input change event
 * @param {Function} [callback] - callback after load
 */
Player.prototype.loadFile = function(file, callback) {
	if (this.isPlaying) {
		this.stop();
	}
	this.fileName = file.name;

	this._source = this._context.createBufferSource();
	this._source.loop = true;
	this._source.connect(this._gain);

	this._reader = new FileReader();
	this._reader.onload = function(e) {
		this._context.decodeAudioData(e.target.result, function(buffer) {
			this._source.buffer = buffer;
			if (callback) { callback.apply(this); }
		}.bind(this));
	}.bind(this);

	this._reader.readAsArrayBuffer(file);
};

/**
 * Load file from url
 * @param {String} url - path to file
 * @param {Function} [callback] - callback after load
 */
Player.prototype.loadURL = function(url, callback) {
    if (this.isPlaying) {
        this.stop();
    }
    this.fileName = url.split('/').pop();
    this._source = this._context.createBufferSource();
    this._source.loop = true;
    this._source.connect(this._gain);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        this._context.decodeAudioData(e.target.response, function(buffer) {
            this._source.buffer = buffer;
            if (callback) { callback.apply(this); }
        }.bind(this));
    }.bind(this);

    xhr.send();
};

/**
 * Reload source for start after stop
 * @private
 */
Player.prototype._reload = function() {
	var buffer = this._source.buffer;
	//TODO DRY!
	this._source = this._context.createBufferSource();
	this._source.loop = true;
	this._source.buffer = buffer;
	this._source.connect(this._gain);
};

/**
 * Add visualizer
 * @private
 */
Player.prototype._visualize = function() {
	this._analyser.getByteFrequencyData(this._freqs);

	var canvas = document.querySelector('canvas');
	canvas.width = canvas.parentNode.offsetWidth - 1;
	canvas.height = canvas.parentNode.offsetHeight - 1;
	var context = canvas.getContext('2d');

	for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
		var value = this._freqs[i];
		var percent = value / 256;
		var height = canvas.height * percent;
		var offset = canvas.height - height - 1;
		var barWidth = canvas.width / this._analyser.frequencyBinCount;
		var hue = i / this._analyser.frequencyBinCount * 360;
		//diffrent styles
		//context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
		//context.fillStyle = 'rgba(46,109,164,.3)';
		context.fillStyle = 'rgba(20,20,20,.5)';
		context.fillRect(i * barWidth, offset, barWidth, height);
	}

	requestAnimationFrame(this._visualize.bind(this));
};

/**
 * Play file
 */
Player.prototype.play = function() {
	if (!this.isPlaying && this._source) {
		this._source.start(0);
		this.isPlaying = true;
		console.log('Play');
	}
};

/**
 * Stop file
 */
Player.prototype.stop = function() {
	if (this.isPlaying && this._source) {
		this._source.stop(0);
		this._reload();
		this.isPlaying = false;
		console.log('Stop');
	}
};

/**
 * Volume up
 */
Player.prototype.volumeUp = function() {
	this.volume = this._gain.gain.value += .1;
	console.log('Volume: ' + this.volume);
};

/**
 * Volume down
 */
Player.prototype.volumeDown = function() {
	this.volume = this._gain.gain.value -= .1;
	console.log('Volume: ' + this.volume);
};

/**
 * Set equalaizer settings
 * @param {String} equalaizer - equalaizer name
 */
Player.prototype.setEqualizer = function(equalaizer) {
	var gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	switch(equalaizer) {
		case 'Pop':
			gains = [0.70, 0.79, 0, 1.41, 2.51, 2.51, 1.41, 0, 0.79, 0.70];
			break;
		case 'Rock':
			gains = [3.16, 2.51, 1.99, 1.41, 0.89, 0.85, 1.23, 1.86, 2.51, 2.81];
			break;
		case 'Jazz':
			gains = [2.51, 1.99, 1.41, 1.58, 0.70, 0.70, 0, 1.41, 1.99, 2.51];
			break;
		case 'Classic':
			gains = [3.16, 2.51, 1.99, 1.77, 0.70, 0.70, 0, 1.77, 1.99, 2.23];
			break;
		case 'Bass':
			gains = [3.16, 2.51, 2.23, 1.77, 1.25, 0, 0, 0, 0, 0];
			break;
		default:
			break;
	}

	this._filters.forEach(function(filter, i) {
		filter.gain.value = gains[i];
	});

	console.log('Equalizer: ' + equalaizer);
};