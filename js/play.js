
/* ---------------------------------------------------------------------------
 * 3 684 586
 *      CC by SA
 *      Pedro A. Góngora
 * play.js:
 *      p5.js javascript code
 * Google Custom Search php code in:
 *    /search.php.txt
 * ---------------------------------------------------------------------------
*/

/* globals for audio */
var canvas;
var sound;
var amplitude;
/* globals for GCS */
var list;
var totalRes = 0;
var readOk = false;

function preload() {
    sound = loadSound('PinoSuarez-BellasArtes.mp3');
    console.log("fin preload");
}

function setup() {
  canvas = createCanvas(50,50);
  canvas.parent("#pulse");
  canvas.mouseClicked(mouseClickedInCanvas);
  amplitude = new p5.Amplitude();
  frameRate(20);
  background(0,255,0);
  readFile();
  //sound.loop();
}

function draw() {
  background(255);

  if (readOk) {
    if (mouseX < width && mouseY < height) {
      fill("#FF6600");
      stroke("#FF6600");
    } else {
      fill(0);
      stroke(0);
    }
    var level = amplitude.getLevel();
    var size = map(level, 0, 1, 0, width*2);
    ellipse(width/2, height/2, size, size);
  }
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function readFile() {
  var xmlhttp = new XMLHttpRequest();
  var url = "list.txt";
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      list = JSON.parse(xmlhttp.response);
      totalRes = list.length;
      console.log("readed " + list.length + " items");
      processList();
      readOk = true;
    }
  };
  xmlhttp.open("GET", url, true);
  try {
    xmlhttp.send();
  } catch (err) {
    console.log("error searching: ".concat(err.message));
  }
}


function processList(start) {
  for (var i = 0; i < totalRes; i++) {
    div = createDiv(list[i]);
    div.id( "res" + i );
    div.addClass("vertical-text");
    div.style("position", "absolute");
    div.style("left", "" + (i*25+18) + "px");
    div.style("bottom", "0px");
    div.parent("#resultsList");
    div.mouseClicked(newOpenModalClosure(div));
  }
  addAClass(".vertical-text", "normalBar");
  setCues();
  $("#blank").css("display", "none");
  sound.loop();
  console.log("fin búsqueda");
}

function setCues() {
  var cueInterval = sound.duration() / totalRes;
  for (var i=0; i < totalRes; i++) {
    sound.addCue(cueInterval*i+.1, spotResult, i);
  }
}

function spotResult(num) {
  addAClass(".spottedBar", "normalBar");
  removeAClass(".spottedBar", "spottedBar");
  removeAClassById("#res".concat(num), "normalBar");
  addAClassById("#res".concat(num), "spottedBar");
  var offset = $("#res"+num).offset();
  var middle = Math.round($('body').innerWidth() / 2);
  $('html, body').animate(
    {
      scrollLeft: offset.left - middle
    },
    300
  );
}

function addAClass(which, what) {
  var elems = selectAll(which);
  for (var i=0; i<elems.length; i++) {
    elems[i].addClass(what);
  }
}

function removeAClass(which, what) {
  var elems = selectAll(which);
  for (var i=0; i<elems.length; i++) {
    elems[i].removeClass(what);
  }
}

function addAClassById(which, what) {
  var elem = select(which);
  elem.addClass(what);
}

function removeAClassById(which, what) {
  var elem = select(which);
  elem.removeClass(what);
}

function mouseClickedInCanvas() {
  if (mouseX < width && mouseY < height) {
    window.location.href = "index.html";
  }
}

function closeModal() {
  if (!sound.isPlaying()) {
    sound.loop();
  }
  var iframe = select("#contenidoExterno");
  iframe.attribute("src", "");
  var modal = select('#modal');
  modal.style("display", "none");
  var num = 0;
  try {
    num = parseInt( $(".spottedBar").first().prop("id").substring(3) );
    var offset = $("#res"+num).offset();
    var middle = Math.round($('body').innerWidth() / 2);
    console.log("num: " + num + ", offset: " + offset.left + ", middle: " + middle);
    $('html, body').animate(
      {
        scrollLeft: offset.left - middle
      },
      300
    );
  } catch (err) {
    console.log(err);
  }
}

function newOpenModalClosure(barra) {
  var bar = barra;
  return function () {
    if (sound.isPlaying()) {
      sound.pause();
    }
    var modal = select('#modal');
    modal.style("display", "block");
    $("#iframeLoading").css("display", "block");
    $("#contenidoExterno").load(function () {$("#iframeLoading").css("display", "none");});
    var modalContent = select(".modal-content");
    var iframe = select("#contenidoExterno");
    var url = bar.html();
    if ( url.includes("www.youtube.com") ) {
      url = url.replace("watch?v=", "embed/");
    }
    try {
        iframe.attribute("src", url);
    } catch(err) {
        console.log(err);
    }
  }
}
