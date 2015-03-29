var teleprompter = "Some people live for the fortune. Some people live just for the fame. Some people live for the power, yeah. Some people live just to play the game. Some people think that the physical things. Define what's within. And I've been there before. But that life's a bore. So full of the superficial. Some people want it all. But I don't want nothing at all If it ain't you baby If I ain't got you baby. Some people want diamond rings. Some just want everything. But everything means nothing. If I ain't got you, Yeah"

var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Lietuvių',        ['lt-LT']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenščina',     ['sl-SI']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['Ελληνικά',        ['el-GR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['Українська',      ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',            ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 7;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

var start_m;
var start_s;
var start_d;

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  start_time();
  start_m = new Date().getMinutes();
  start_s = new Date().getSeconds();
  start_d = new Date().getMilliseconds();
  teleControl();
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'img/phone.png';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'img/phone.png';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'img/phone.png';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'img/phone.png';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    var end_m = new Date().getMinutes();
    var end_s = new Date().getSeconds();
    var end_d = new Date().getMilliseconds();
    total_time = ((end_m*6000 + end_s*1000 + end_d) - (start_m*6000 + start_s*1000 + start_d));

    //recording is complete:
    wordReader();
    runTestApp(final_transcript);

    if (ignore_onend) {
      return;
    }
    start_img.src = 'img/phone.png';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {

        interim_transcript += event.results[i][0].transcript;


        interim = event.results[i][0].transcript;
        confidence = event.results[i][0].confidence;


        if(confidence > 0.5){
            splitWords = interim.split(' ');
            var difference = wordArray.length - splitWords.length;
            
            wordArray = [];
            // for (var i = 0; i < splitWords.length; i++){
            //     wordArray.push(splitWords[i]);
            // }
            wordArray = interim_transcript; 
            // console.log("wordArray: " + wordArray);
        }
        // console.log(interim + " " + interim.split(' ').length)
        // console.log(interim)
                // console.log(interim.split(' '))

      }
        if(typeof(wordArray) === "string"){
            position =  wordArray.split(" ").length;
        } 
        if(typeof(wordArray) === "array"){
            position = wordArray.length;
        }

        teleControl();
        console.log(position);
    }

    interim_transcript.toLowerCase();
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
    //adding words to the array

    // endWord = lastWord(interim_transcript);
    // addWord(endWord);

    // savedWord = endWord;
    
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
  };
}
var total_time;

var word_indexer = 0;
var endWord = '';
var savedWord = '';
var wordArray = [];
var splitWords = [];
var confidence = [];

var count_like = 0;
var count_um = 0;
var count_sort = 0;
var count_kind = 0;

// var lastWord = function(o) {
//   return (""+o).replace(/[\s-]+$/,'').split(/[\s-]/).pop();;
// };

// var addWord = function(o) {
//     if (o === savedWord) {
//         return false;
//     } else {

//     return true;
//     }
// }

var reset = function () 
var wordReader = function() {
    if(wordArray > 0){
        splited = wordArray.split(" ");
        for (var i = 0; i < splited.length; i++){
        if (splited[i] === "like") count_like++;
        if (splited[i] === "um") count_um++;
        if (splited[i] === "sort" && splited[i+1] === "of") count_sort++;
        if (splited[i] === "kind" && splited[i+1] === "of") count_kind++;
        }
    }
    console.log("likes " + count_like);
    console.log("um " + count_um);
    console.log("sort " + count_sort);
    console.log("kind " + count_kind);
}

var position = 0;
var positionmarker = 0;
var teleControl = function() {
    $("#teleprompter").html(teleprompter);
    $("#teleprompter").css("opacity",1);
    $("#tele-background").css("opacity","0.5");
    $("#results").css("display","none");
    var windowHeight = $(window).height();
    var tele_length = teleprompter.split(" ").length;
    var teleHeight = $("#teleprompter").height();
    var ratio = position/tele_length;
    var top = (teleHeight-windowHeight)*ratio;
    if(positionmarker!== position){
        // console.log("windowHeight " + windowHeight);
        // console.log("tele_length " + tele_length);
        // console.log("ratio " + ratio);
        // console.log("position " + position);
        // console.log("top " + top);
        // console.log(top);
        $("#teleprompter").css("top",-top);
    }
    positionmarker = position;
}

var display_tele = function() { 
    $("#results").css("display","none");
    $("#tele-wrapper").css("display","block");
    $("#tele-background").css("display","block");

}

var display_subs = function() {
    $("#results").css("display","block");
    $("#tele-wrapper").css("display","none");
    $("#tele-background").css("display","none");

}

var scores = function () { 


}

var minutes = 0;
var seconds = 0;

var start_time = function() {
    var interval = window.setInterval( function() {
        if(seconds === 60){
            seconds = 0;
            minutes++
        }
        var display_seconds = "";
        if(seconds < 10){
            display_seconds = "0" + seconds;
        } else {
            display_seconds = seconds;
        }
        $("#timer p").html(minutes + ":" + display_seconds);
        seconds++;
    }, 1000 );
}

var time = true;

var display_timer = function () {
    if (time) {
      $("#timer p").css("display","none")
      time = false  
      console.log("hello")
    }  else {
        $("#timer p").css("display","block");
        time = true;
    }
}

//create 
// button
//better text
//scoring
// talking rate
// sentiment
// transitions

