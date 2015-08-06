$(function() {

	var $buttonPlay = $('button#play'),
		$buttonStop = $('button#stop'),
		$buttonVolumeUp = $('button#volumeUp'),
		$buttonVolumeDown = $('button#volumeDown'),
		$pName = $('p#name'),
		$divCover = $('div.cover');

	var loadTags = function(file, datareader) {
		ID3.loadTags(file, function() {
			var tags = ID3.getAllTags(file);
			player.artist = tags.artist;
			player.title = tags.title;

			if (player.artist && player.title) {
				$pName.html(player.artist + ' - ' + player.title);
			} else {
				$pName.html(player.fileName);
			}

			if (tags.picture) {
				var image = tags.picture;
				var base64String = '';
				image.data.forEach(function(n) { base64String += String.fromCharCode(n); });
				$divCover.css('background-image', 'url(data:image/' + image.format + ';base64,' + window.btoa(base64String) + ')');
			} else {
				$divCover.css('background-image', '');
			}
		}, {
			tags: ['artist', 'title', 'album', 'year', 'genre', 'lyrics', 'picture'],
			dataReader: datareader
		});
	};

	var player = new Player();

	/*------------------------------------- Starting demo. You can comment this! -------------------------------------*/
	$divCover.html('<i class="fa fa-refresh fa-spin fa-4x"></i>');
	player.loadURL('sounds/break - i want u.mp3', function() {
		$divCover.html('');
		loadTags('sounds/break - i want u.mp3');
		$buttonPlay.click();
	});
	/*----------------------------------------------------------------------------------------------------------------*/


	$('div.btn-file :file').change(function(e) {
		if (e.target.files.length) {
			var file = e.target.files[0];

			player.loadFile(file, function() {
				loadTags(file.name, FileAPIReader(file));
				$buttonPlay.click();
			});
		}
	});

	$buttonPlay.click(function(e) {
		player.play();
		$(this).addClass('active');
		$buttonStop.removeClass('active');
	});

	$buttonStop.click(function(e) {
		player.stop();
		$(this).addClass('active');
		$buttonPlay.removeClass('active');
	});

	$buttonVolumeUp.click(function(e) {
		player.volumeUp();
		if (player.volume >= 2.0 ) { $(this).prop('disabled', true); }
		if (player.volume < 2.0 ) { $buttonVolumeDown.prop('disabled', false); }
	});

	$buttonVolumeDown.click(function(e) {
		player.volumeDown();
		if (player.volume <= 0.0 ) { $(this).prop('disabled', true); }
		if (player.volume > 0.0 ) { $buttonVolumeUp.prop('disabled', false); }
	});

	$('ul.dropdown-menu li').click(function(e) {
		var $this = $(this),
			eq = $this.children().html();
		$this.parent().children('li.active').removeClass('active');
		$this.addClass('active');
		player.setEqualizer(eq);
		e.preventDefault();
	});
});