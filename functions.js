// KanjiRepeater 2.0
// Julian Wittmann
// 2016-07-05

var kanjiPollingArray;  // Alle noch nicht richtigen Kanji
var kanjiButtonArray;   // Alle Kanji für Zufalls Buttons
var kanjiGradeArray;    // Alle gewählten Kanji

// ID und Index des Lösungs-Kanjis
var kanjiSolutionId;
var kanjiSolutionIndex;

// Fehlerzähler, Anzahl der zu übenden Kanji
var falseKanji;
var correctKanji;
var practicekanjicount;

// Das Kanji
var theKanji;

// Die falschen Kanji
var falseKanjiArray;

// Index des Lösung-Buttons
var buttonIndex;
var buttonCount;


// Index der Lesungen
const kanjiIdx  = 1;
const en_Idx    = 2;
const kun_rdIdx = 3;
const on_rdIdx  = 4;
const ger_Idx   = 5;

// readings
var selectedReadings = new Object;

function newGame() {
    getReadings();
    initNewGame();
    initView();
    initNewKanji();
}

function getReadings() {
    buttonCount = document.getElementById("button-count").value;
    selectedReadings.german   = document.getElementById("show-german").checked;
    selectedReadings.englisch = document.getElementById("show-english").checked;
    selectedReadings.onyomi   = document.getElementById("show-on").checked;
    selectedReadings.kunyomi  = document.getElementById("show-kun").checked;
}

var allReadings = new Object;
allReadings.german   = true;
allReadings.englisch = true;
allReadings.onyomi   = true;
allReadings.kunyomi  = true;

function initNewKanji() {
    getQuestion();
    writeKanji();
    writeButtons();
    // mapButtons();
    writeStatisticPanel();
}

function writeStatisticPanel() {
    str = correctKanji + "/" + practiceKanjiCount + " false: " + falseKanji;
    document.getElementById("statistics").innerHTML = str;
}

function checkButton(buttonID) {
    if (buttonID == buttonIndex) {  //richtige Lösung
        correctKanji++;
        mySplice(kanjiPollingArray, theKanji);
        writeInfoPanel(true, theKanji);
        flashGreen();
    }
    else {                          //falsche Lösung
        falseKanji++;
        writeInfoPanel(false, falseKanjiArray[buttonID]);
        flashRed();
    }

    if (kanjiPollingArray.length < 1) { finalizeGame(); }
    else                              { initNewKanji(); }
}

function writeInfoPanel(bool, kanji) {
    document.getElementById("info-panel-1").innerHTML = theKanji[kanjiIdx] + " = " + getButtonStr(theKanji, allReadings);
    if (bool) {
        document.getElementById("info-panel-2").innerHTML = "-";
    } else {
        document.getElementById("info-panel-2").innerHTML = kanji[kanjiIdx] + " = " + getButtonStr(kanji, allReadings);
    }
}

function finalizeGame() {
    alert("Done");
}

function writeKanji(){
    // Frage Panel beschreiben
     document.getElementById("kanji").innerHTML = theKanji[kanjiIdx];

}

function writeButtons(){
    // Buttons beschreiben
    for (var i = 0; i < buttonCount; i++) {
        if (i === buttonIndex) { // Schreibe Lösung auf den richtigen Button
            document.getElementById("button" + i).innerHTML = getButtonStr(theKanji, selectedReadings);
        } else{ // Schreibe Zufallskanji auf andere Buttons
            document.getElementById("button" + i).innerHTML = getButtonStr(falseKanjiArray[i], selectedReadings);
        }
    }
}

// function mapButtons(){
//     // Frage Panel beschreiben
//      document.getElementById("kanji").innerHTML = theKanji[kanjiIdx];

//     // Buttons beschreiben
//     for (var i = 0; i < buttonCount; i++) {
//         if (i === buttonIndex) { // Schreibe Lösung auf den richtigen Button
//             document.getElementById("button" + i).innerHTML = getButtonStr(theKanji, selectedReadings);
//         } else{ // Schreibe Zufallskanji auf andere Buttons
//             document.getElementById("button" + i).innerHTML = getButtonStr(falseKanjiArray[i], selectedReadings);
//         }
//     }
// }

function changeReading() {
    getReadings();
    writeButtons();
}

function getButtonStr(kanji, readings) {
    var str = "";
    if (readings.german)   { str += "g:&nbsp" + kanji[ger_Idx] + " ";}
    if (readings.englisch) { str += "e:&nbsp" + kanji[en_Idx] + " ";}
    if (readings.kunyomi)  { str += "k:&nbsp" + kanji[kun_rdIdx] + " ";}
    if (readings.onyomi)   { str += "o:&nbsp" + kanji[on_rdIdx] + " ";}
    return str;
}

function getQuestion() {
    // Pool false Kanji from here
    kanjiButtonArray = kanjiGradeArray.concat();

    // get Kanji and Button iDx
    buttonIndex = Math.floor(Math.random() * buttonCount);
    theKanji = kanjiPollingArray[Math.floor(Math.random()*kanjiPollingArray.length)];
    mySplice(kanjiButtonArray, theKanji);

    falseKanjiArray = getFalseKanjiArray();
}

function mySplice(arr, val) {
  for (var i = arr.length; i--;) {
    if (arr[i] === val) {
      arr.splice(i, 1);
    }
  }
}

function getFalseKanjiArray() {
    var arr = [];
    for (var i = 0; i < buttonCount; ++i){
        arr[i] = kanjiButtonArray.splice(Math.floor(Math.random()*kanjiButtonArray.length), 1)[0];
    }
    return arr;
}

function initView() {
    newButtons(buttonCount);
}

function initNewGame () {
    // clean up
    falseKanji   = 0;
    correctKanji = 0;
    kanjiPollingArray = [];
    kanjiButtonArray  = [];
    kanjiGradeArray   = [];

    // getKanji for Practice
    kanjiGradeArray = getKanjiSet();
    kanjiPollingArray = kanjiGradeArray.concat();

    practiceKanjiCount = kanjiGradeArray.length;
}

function getKanjiSet() {
    var arr = [];
    if (document.getElementById("kanji-set1").checked) { arr = arr.concat(grade1); }
    if (document.getElementById("kanji-set2").checked) { arr = arr.concat(grade2); }
    if (document.getElementById("kanji-set3").checked) { arr = arr.concat(grade3); }
    if (document.getElementById("kanji-set4").checked) { arr = arr.concat(grade4); }
    if (document.getElementById("kanji-set5").checked) { arr = arr.concat(grade5); }
    if (document.getElementById("kanji-set6").checked) { arr = arr.concat(grade6); }
    arr.forEach(num);
    return arr;
}

function newButtons(n) {
    buttonCount = parseInt(n);
    var buts = document.getElementById("buttons");
    while (buts.firstChild) {
        buts.removeChild(buts.firstChild);
    }
    createButtonArray();
}

function createButtonArray() {
    for (var i = 0; i < buttonCount; i++) {
       createButton(i);
    }
}

function createButton(i) {
    var b = document.createElement("div");
    // b.setAttribute("type", "button");
    b.setAttribute("id", "button" + i);
    b.setAttribute("class", "button");
    b.setAttribute("data-hurensohn", i);
    b.setAttribute("onClick", "checkButton(this.dataset.hurensohn)");
    document.getElementById("buttons").appendChild(b);
}

function num(v, i, ar) {
    ar[i][0] = i + 1;
}

function flashRed() {
  document.body.classList.add('red')
  window.setTimeout(function() {
    document.body.classList.remove('red')
  }, 600)

}

function flashGreen() {
  document.body.classList.add('green')
  window.setTimeout(function() {
    document.body.classList.remove('green')
  }, 600)
}

/*function flashGreen() {
    document.body.style.animation = "";
    document.body.style.animation = "greenflash 0.6s 2 alternate ease-out";
}

function flashRed() {
    document.body.style.animation = "";
    document.body.style.animation = "greenflash 0.6s 2 alternate ease-out";
}

*/

document.addEventListener("keydown", function(e){
    if(e.keyCode === 56){ // 8
        alert("8");
    } else if (e.keyCode === 71){ // g
        var y = document.getElementById("show-german");
        toggle(y);
        changeReading();
    } else if (e.keyCode === 69){ // e
        var y = document.getElementById("show-english");
        toggle(y);
        changeReading();
    } else if (e.keyCode === 79){ // o
        var y = document.getElementById("show-on");
        toggle(y);
        changeReading();
    } else if (e.keyCode === 75){ // k
        var y = document.getElementById("show-kun");
        toggle(y);
        changeReading();
    }
});


function toggle(x){
    if (x.checked == false){
        x.checked = true
    } else {
        x.checked = false
    }
}
