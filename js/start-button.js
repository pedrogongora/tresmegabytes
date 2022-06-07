
$(document).ready(
  function() {
    $('#circles img').hover(function() {
      $(this).attr('src', 'img/play2.png');
      }, function() {
      $(this).attr('src', 'img/play.png');
    });
  }
);
