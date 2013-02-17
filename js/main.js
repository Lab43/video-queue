var videoWidth = 840
  , videoHeight = Math.round(videoWidth * 9 / 16)
;


(function ($, undefined) {


  // add video
  $('#url-form').on('submit', function (e) {
    e.preventDefault();
    removeError();
    var url = $('#url').val();
    var videoCode = parseUrl(url);

    if (!videoCode) return urlError();

    // reset url input field
    $('#url').val('').blur();

    // add video
    $('#videos')
      .append( buildVideo(videoCode.source, videoCode.code) )
      .fitVids()
      .removeClass('empty')
    ;

    // remove highlighting
    setTimeout(function(){
      $('.video:last').removeClass('highlight');
    },1200);

    // scroll to the new video
    var offset = $('#url-form').outerHeight() * -1.75;
    $.scrollTo('.video:last', 600, {offset: offset});

    updateHash();
  });


  // remove video
  $(document).on('click', 'a.remove', function (e) {
    e.preventDefault();
    $(this).parent().remove();
    if ($('.video').length === 0) {
      $('#videos').addClass('empty');
    }
    updateHash();
  });


  // close error
  $(document).on('click', 'a.close', function (e) {
    e.preventDefault();
    removeError();
  });




  // ==========
  // page ready
  // ==========
  $(function() {


    // size text based on page width
    $('h1').fitText(0.47);
    $('#header p').fitText(3.5, {minFontSize: '12px'});

    // fix video form to top depending on scroll position;
    var fixedTop = $("#url-form"), pos = fixedTop.offset();
    $(window).scroll(function(e) {
      if($(this).scrollTop() > pos.top) { 
        $(fixedTop).addClass('fixed');
      } else {
        $(fixedTop).removeClass('fixed');
      }
    });

    // if there is a hash, load videos
    var hash = window.location.hash.substring(1).split('/');
    // depending on placement of slashes in hash, the hash array could have several empty values
    var validHash = false;
    $.each(hash, function (i, value) {
      if (!value) return;
      validHash = true;
      value = value.split(':');
      var source = value[0] === 'v' ? 'vimeo' : 'youtube';
      $('#videos')
        .append( buildVideo(source, value[1]) )
        .removeClass('empty')
      ;
    });
    if (validHash) {
      $('#videos').fitVids();
      $('.video').removeClass('highlight');
      // scroll to the first video
      var offset = $('#url-form').outerHeight() * -1.75;
      $.scrollTo('.video:first', 0, {offset: offset});
    } else {
      $('#url').focus();
    }

  });




  // =========
  // functions
  // =========

  // construct video embed codes
  function buildVideo (source, videoId) {
    var video = $('<div class="video highlight">');
    var embed = '';
    switch (source) {
      case 'vimeo':
        video.attr('data-id', 'v:' + videoId);
        embed += '<iframe src="http://player.vimeo.com/video/'
        embed += videoId;
        embed += '?title=0&byline=0&portrait=0" width="'+videoWidth+'" height="'+videoHeight+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        break;
      case 'youtube':
        video.attr('data-id', 'y:' + videoId);
        embed += '<iframe id="ytplayer" type="text/html" width="'+videoWidth+'" height="'+videoHeight+'" src="http://www.youtube.com/embed/';
        embed += videoId;
        embed += '?rel=0&showinfo=0&autohide=1" frameborder="0"/>'
        break;
    }
    video.append(embed);
    video.append('</div><a href="#" class="remove" title="Remove this video">Remove Video</a></div>');
    return video;
  }

  // display error message for bad url
  function urlError() {
    removeError();
    $('#url').addClass('invalid');
    $('#url-form .container').append('<div class="error">Sorry, I don&apos;t understand that URL. Video Queue only supports YouTube and Vimeo. URLs should look like <strong>http://www.youtube.com/watch?v=XSGBVzeBUbk</strong> or <strong>http://vimeo.com/1084537</strong>.<a href="#" class="close">Close</a></div>');
  }

  // hide error message
  function removeError() {
    $('#url-form .error').remove();
    $('#url').removeClass('invalid');
  }

  // get video ids and add them to the hash
  function updateHash() {
    var hash = [];
    $('.video').each(function (i, elem) {
      hash.push( $(elem).attr('data-id') );
    });
    window.location.hash = hash.join('/');
  }


  function parseUrl(url) {

    // check if it's a youtube url
    var match = url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
    if (match) return {
      source: 'youtube',
      code: match[1]
    }

    // check if it's a vimeo url
    match = url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);
    if (match) return {
      source: 'vimeo',
      code: match[2]
    }
    
    // url not understood    
    return false;
  }


})(jQuery);