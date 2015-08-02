window.AudioContext = window.AudioContext||window.webkitAudioContext;

$(function() {
    var player = new Player();
    
    $('button.btn-file :file').change(function(e) {
        var file = e.target.files[0];
        
        player.load(file);
        
        ID3.loadTags(file.name, function() {
            var tags = ID3.getAllTags(file.name);
            player.artist = tags.artist;
            player.title = tags.title;
            
            if (player.artist && player.title) {
                $('#name').html(player.artist + ' - ' + player.title);
            } else {
                $('#name').html(player.fileName);
            }
            
            if (tags.picture) {
                var image = tags.picture;
                var base64String = '';
                image.data.forEach(function(n) { base64String += String.fromCharCode(n); });
                $('.cover').css('background-image', 'url(data:image/' + image.format + ';base64,' + window.btoa(base64String) + ')');
            } else {
                $('.cover').css('background-image', '');
            }
        }, { 
            tags: ['artist', 'title', 'album', 'year', 'genre', 'lyrics', 'picture'],
            dataReader: FileAPIReader(file)
        });
    });
    
    $('button[aria-label="Play"]').click(function(e) {
        console.log('Play');
        player.play();
    });
    
    $('button[aria-label="Stop"]').click(function(e) {
        console.log('Stop');
        player.stop();
    });
    
    $('button[aria-label="+"]').click(function(e) {
        player.volumeUp();
        
        if (player.volume >= 1.0 ) {
            //disable
        }
    });
    
    $('button[aria-label="-"]').click(function(e) {
        player.volumeDown();
        
        if (player.volume <= -1.0 ) {
            //disable
        }
    });
    
});