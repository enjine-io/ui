/****************************************
 * Written for SoftCogs Ltd
 * Copyright (C) SoftCogs Ltd. 2018
 */
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
    else 
    {   
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
    // add main content to webpage
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + folder + '/layout.json', true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want
        layouts.tutorial = JSON.parse(this.responseText);
        if (onReady != null) onReady();
    };
    xhr.send();
}

function getTranslation(folder, onReady) {
    // add main content to webpage
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + folder + '/lang.json', true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want            
        _languages = JSON.parse(this.responseText);
        if (onReady != null) onReady();
    };
    xhr.send();
}

// function populateLabels(lang) {
//     var labelElements = document.querySelectorAll("[lbl]");
//     labelElements.forEach(function(elem) {
//         if (translations.toc[elem.getAttribute("lbl")] != null) {
//             elem.innerHTML = translations.toc[elem.getAttribute("lbl")][lang];
//         } else if (layouts.tutorial[elem.getAttribute("lbl")] != null) {
//             elem.innerHTML = layouts.tutorial[elem.getAttribute("lbl")][lang];
//         } else {}
//     });
// }

/**************************************
 * 
 * CODE THAT IS EXECUTED WHEN SCRIPT IS LOADED
 * 
 */

getLanguage();
document.getElementsByTagName("HTML")[0].setAttribute("lang", _curLang);
//populateLabels(lang);

var params = (new URL(document.location)).searchParams;
var tutorial =  params.get("id")
var page =  params.get("page")
var isHome = params.get("home") || ""
var cmp = params.get("cmp") || ""

console.log( tutorial );

//console.log( typeof( isHome ) + " : " + isHome )

if ( tutorial && isHome == "false" )
{
    //console.log("BUILDING")
    buildTutorial(tutorial, null, page, cmp=="true" ? true : false );
}
// else if( isHome == "true" )
// {
//     buildMainPage( tutorial )
//     document.getElementById("body").style.display = "block";
// }
else 
{
    //buildHome( tutorial );
    buildMainPage( tutorial );
    document.getElementById("body").style.display = "block";
}

/**********************************
 * ON CHANGE EVENT FOR CHANGING LANGUAGE
 */
//TODO: Change language - GW: TEMP switched off until languages are ready
/*
document.getElementById("changeLanguage").onchange = function() {
    setLanguage(this.value);
    buildTutorial(docURLArray[1].split("#")[0]);
};
*/