var videoWidth = 840
  , videoHeight = Math.round(videoWidth * 9 / 16)
;


(function ($, undefined) {


  // add video
  $('#video-form').on('submit', function (e) {
    e.preventDefault();
    hideError();
    var url = $('#field-url').val();
    var match = url.match(/http:\/\/(?:www\.)?(vimeo|youtube)\.com\/(?:watch\?v=)?(.*?)(?:\z|$|&)/);
    if (!match) return urlError();

    // reset url input field
    $('#field-url').val('').blur();

    // add video
    $('#videos')
      .append( buildVideo(match[1], match[2]) )
      .fitVids()
      .removeClass('empty')
    ;

    // remove highlighting
    setTimeout(function(){
      $('.video:last').removeClass('highlight');
    },1200);

    // scroll to the new video
    $.scrollTo('.video:last', 600);

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
    hideError();
  });




  // ==========
  // page ready
  // ==========
  $(function() {


    // size text based on page width
    $('h1').fitText(0.48);
    $('#header p').fitText(3.5, {minFontSize: '16px'});
    $('h2').fitText(3, {minFontSize: '14px'});
    $('input, button').fitText(4, {minFontSize: '16px'});


    // fix video form to top depending on scroll position;
    var fixedTop = $("#video-form"), pos = fixedTop.offset();
    $(window).scroll(function(e) {
      if($(this).scrollTop() > pos.top) { 
        $(fixedTop).addClass('fixed');
      } else {
        $(fixedTop).removeClass('fixed');
      }
    });

    // if there is a hash, load videos
    var hash = window.location.hash.substring(1).split('/');
    if (hash.length) {
      $.each(hash, function (i, value) {
        if (!value) return;
        value = value.split('_');
        var source = value[0] === 'v' ? 'vimeo' : 'youtube';
        $('#videos')
          .append( buildVideo(source, value[1]) )
          .removeClass('empty')
        ;
      });
      $('#videos').fitVids();
      $('.video').removeClass('highlight');
      $.scrollTo('#video-form');
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
        video.attr('data-id', 'v_' + videoId);
        embed += '<iframe src="http://player.vimeo.com/video/'
        embed += videoId;
        embed += '?title=0&byline=0&portrait=0" width="'+videoWidth+'" height="'+videoHeight+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        break;
      case 'youtube':
        video.attr('data-id', 'y_' + videoId);
        embed += '<iframe id="ytplayer" type="text/html" width="'+videoWidth+'" height="'+videoHeight+'" src="http://www.youtube.com/embed/';
        embed += videoId;
        embed += '?rel=0&showinfo=0" frameborder="0"/>'
        break;
    }
    video.append(embed);
    video.append('</div><a href="#" class="remove" title="Remove this video">Remove Video</a></div>');
    return video;
  }

  // display error message for bad url
  function urlError() {
    $('#video-form').addClass('show-error');
  }

  // hide error message
  function hideError() {
    $('#video-form').removeClass('show-error');
  }

  // get video ids and add them to the hash
  function updateHash() {
    var hash = [];
    $('.video').each(function (i, elem) {
      hash.push( $(elem).attr('data-id') );
    });
    window.location.hash = hash.join('/');
  }


})(jQuery);