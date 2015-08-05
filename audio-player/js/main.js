$(function() {
	var player = new Player();

	$('button.btn-file :file').change(function(e) {
		if (e.target.files.length) {
			var file = e.target.files[0];

			player.load(file, function() {
				$('button#play').click();
			});

			ID3.loadTags(file.name, function() {
				var tags = ID3.getAllTags(file.name);
				player.artist = tags.artist;
				player.title = tags.title;

				if (player.artist && player.title) {
					$('p#name').html(player.artist + ' - ' + player.title);
				} else {
					$('p#name').html(player.fileName);
				}

		        if (tags.picture) {
			        var image = tags.picture;
			        var base64String = '';
			        image.data.forEach(function(n) { base64String += String.fromCharCode(n); });
			        $('div.cover').css('background-image', 'url(data:image/' + image.format + ';base64,' + window.btoa(base64String) + ')');
		        } else {
			        $('div.cover').css('background-image', '');
		        }
			}, {
				tags: ['artist', 'title', 'album', 'year', 'genre', 'lyrics', 'picture'],
				dataReader: FileAPIReader(file)
			});
		}
	});

	$('button#play').click(function(e) {
		player.play();
		$(this).addClass('active');
		$('button#stop').removeClass('active');
	});

	$('button#stop').click(function(e) {
		player.stop();
		$(this).addClass('active');
		$('button#play').removeClass('active');
	});

	$('button#volumeUp').click(function(e) {
		player.volumeUp();
		if (player.volume >= 1.0 ) {
			//disable
		}
	});

	$('button#volumeDown').click(function(e) {
		player.volumeDown();
		if (player.volume <= -1.0 ) {
			//disable
		}
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