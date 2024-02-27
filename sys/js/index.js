/****************************************
* Written for SoftCogs Ltd
* Copyright (C) SoftCogs Ltd. 2018
* Update 2023 (By hamacjumar)
*/


function initializeCodes() {
    let codes = document.getElementsByTagName("CODE"),
        button;
    for(let z = 0; z < codes.length; z++) {
        button = codes[z].children[0];
        if(button.tagName == "BUTTON" && button.classList.contains("copy-button")) {
            button._code =  codes[z].innerText;
            button.addEventListener( "click", function() {
                navigator.clipboard.writeText( this._code );
                ShowPopup();
            })
        }
    }
}
initializeCodes();

_languages = null; _curLang = "en";

function T( id, lang )
{
    var tr = _languages ? _languages.trans[id] : null;
    if( tr ) tr = tr[lang?lang:_curLang]; else return id;
    return (tr ? tr : _languages.trans[id]["en"]); 
}

function getLanguage() 
{
    var params = (new URL(document.location)).searchParams;
    if( params.get("lang") ) {
        _curLang = params.get("lang")
        setLanguage( _curLang )
    }
    else {
        if (window.localStorage.getItem("language") )
            _curLang = window.localStorage.getItem("language");            
        else 
            _curLang =  "en";
    }
}

function setLanguage(newLang)
{
    if (newLang != null) {
        window.localStorage.setItem("language", newLang);
        _curLang = newLang;
    }
}

function getLayouts(folder, onReady) {
    layouts.tutorial = LAYOUTDATA;
    if (onReady != null) onReady();
}

function getTranslation(folder, onReady) {
    _languages = LANGDATA;
    if (onReady != null) onReady();
}

getLanguage();
document.getElementsByTagName("HTML")[0].setAttribute("lang", _curLang);

// sets the theme
setTheme();

var params = (new URL(document.location)).searchParams;
var tutorial =  params.get("id") || "_";
var page =  params.get("page") || "0";
var isHome = params.get("home");
var cmp = params.get("cmp");
const ptf = params.get("p") || "web";

// detect if page is loaded in the WIFI IDE
let isDSExt = false;

// check for the platform
if(ptf == "ide") isDSExt = true;

// add the extension file if viewed in ds wifi ide
if( isDSExt ) {
    const src = document.createElement("script");
    src.setAttribute("src", "/.edit/extension.js");
    document.getElementsByTagName("head")[0].append(src);
}

if(typeof LAYOUTDATA.index == "object") {
    if( !cmp ) cmp = "false";
    if( !isHome ) isHome = "true";
}
else if(typeof LAYOUTDATA.pages == "object") {
    if( !cmp ) cmp = "true";
    if( !isHome ) isHome = "false";
}

if ( tutorial && isHome == "false" ) buildTutorial(tutorial, onTutorialLoaded, page, cmp=="true");
else buildMainPage(tutorial, onPageLoaded), document.getElementById("body").style.display = "block";

function onTutorialLoaded() {

    console.log( "Tutorial is loaded! ");

    const runBtns = document.querySelectorAll(".run-code-btn");
    for(let i=0; i<runBtns.length; i++) {
        let type = runBtns[i].getAttribute("code-type")
        type = "hybrid"
        // if(isDSExt && (type == "ds" || type == "hybrid")) runBtns[i].classList.remove("display-none");
        if(ptf == "web" && type == "hybrid") runBtns[i].classList.remove("display-none");
    }
}

function onPageLoaded() {
    console.log( "Page is loaded! ");
}



/* UTILITIES */
function togglePageTheme() {
    let theme = localStorage.getItem("jdocs_theme");
    if( !theme ) theme = "dark";
    theme = theme == "light" ? "dark" : "light";
    localStorage.setItem("jdocs_theme", theme);
    document.getElementById("theme_css").href =  SYSPATH + "/sys/css/" + theme + ".css";
}

function setTheme( thm ) {
    let theme = localStorage.getItem("jdocs_theme");
    theme = thm || theme || "dark";
    document.getElementById("theme_css").href =  SYSPATH + "/sys/css/" + theme + ".css";
}