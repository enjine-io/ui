/**************************************************
 * Written for for SoftCogs Ltd.
 * Copyright (C) SoftCogs Ltd. 2018
 */

let _running = false,
    isSmallDevice = false,
    componentList = [],
    pageJson = {},
    sampStr = "", methodsList = [],
    leftPanelNavs = {}, samples = {},
    docTitle = "", hasTitle = false, toggleLeftNav = false,
    activeLink, activeNavLink, navList, navIsClick = false,
    // demoUrl = "http://localhost:3000";
    demoUrl = "https://enjine-jdocs-3a9b16e42b4b.herokuapp.com";
    let isDSExt = false;

function createComponent(key, val) {
    var str = "";
    return str;
}

function createHeader(tutorial, header) {
    if (header) {
        var str = "";
        str += '<section class="jumbotron text-center bg-light"><div class="xcontainer">';
        if ( header.title ) str += '<h1 class="jumbotron-heading">' + T(header.title) + '</h1>';
        if ( header.subtitle ) str += '<p class="lead text-muted" lbl="introtext">' + T(header.subtitle) + '</p>';
        //str += '<img src="./' + tutorial + '/' + lang + '/img/' + header.feature_img + '" class="rounded mx-auto d-block" alt="' + header.feature_alt + '">';
        str += '</div></section>';
        return str;
    }
    else return ""
}

function createPage( tutorial, step ) {
    var str = "", curHeading = "";

    //for (var z = 0; z < step.stepContent.length; z++) {
    //    let stepContent = step.stepContent[z];

    for (var z in step) {
        var zz = z.split("_");
        var anim = step[z].animation || "";
        var css = step[z].css || "";
        switch (zz[0]) {
            case "title":
                str += `\n<h2 class="jdocs-title bold display-2 ${anim} sm-none" id="overview" style="${css}">${T(step[z].txt)}</h2>\n`;
                docTitle = T(step[z].txt);
                hasTitle = true;
                break;
            case "heading" :
                str += `\n<h4 class="jdocs-heading ${anim}" style="${css}" id="${step[z].txt}">${T(step[z].txt)}</h4>\n`;
                leftPanelNavs[step[z].txt] = { title: T(step[z].txt), navs: {} }; curHeading = step[z].txt;
                break;
            case "subtitle":
                str += `\n<h5 class="jdocs-subtitle method-name ${anim}" style="${css}" id="${T(step[z].txt).replace(/ /g,"-")}">${T(step[z].txt)}</h5>\n`;
                if( curHeading ) leftPanelNavs[curHeading].navs[step[z].txt] = T(step[z].txt)
                break;
            case "text":
                str += `\n<p class="jdocs-text ${anim}" style="${css}" id="${z}">${_S(T(step[z].txt))}</p>\n`;
                break;
            case "tip":
                str += `\n<div class="jdocs-tip ${anim}">${T(step[z].txt)}</div>\n`;
                break;
            case "challenge":
                str += `\n<span class="jdocs-challenge ${anim}" style="${css}" id="${z}">${ _S(T(step[z].txt)) }</span>\n`;
                break;
            case "ol":
                str += '<ol "id="'+z+'">';
                for (var x = 0; x < step[z].content.length; x++) {
                    str += '<li class="jdocs-list-item-ol">'
                    if( step[z].content[x].includes("~") ) str = Bullets(step[z].content[x], str);
                    else str += T(step[z].content[x]);
                    str += '</li>';
                }
                str += '</ol>';
                break;
            case "ul":
                str += '<ul "id="'+z+'">';
                for (var x = 0; x < step[z].content.length; x++) {
                    str += '<li class="jdocs-list-item-ul">'
                    if( step[z].content[x].includes("~") ) str = Bullets(step[z].content[x], str);
                    else str += _S( T(step[z].content[x]) );
                    str += '</li>';
                }
                str += '</ul>';
                break;
            case "table-header":
                str += `
                                <table class="table table-dark table-striped jdocs-table">
                                    <tr class="jdocs-table-header">`;
                var ss = step[z].content//.split("|")
                for (var x = 0; x < ss.length; x++) {
                    var txt = ss[x].replace( /\n/g, "<br>" )
                    str += `
                                        <td class="jdocs-table-header-item bold" style="${css}">${T(txt)}</td>`;
                }
                str += `
                                    </tr>`;
                break;
            case "table-row":
                str += `
                                    <tr class="jdocs-table-row" style="${css}">`;
                var ss = step[z].content//.split("|")
                for ( var x = 0; x < ss.length; x++ ) {
                    var txt = ss[x].replace(/\n/g,"<br>")
                    str += `
                                        <td class="jdocs-table-row-item" style="${css}" valign="top">`
                    if( txt.includes("~") ) str = Bullets(txt, str);
                    else str += _S( T(txt) );
                    str += `</td>`;
                }
                str += `
                                    </tr>`;
                break;
            case "table-footer":
                str += `
                                </table>`;
                break;
            case "img":
                str += `
                                <div class="jdocs-img-container">
                                    <img src="./img/${step[z].src}" style="${css}" class="jdocs-img ${anim}" alt="${ step[z].alt }" />
                                </div>
                `;
                break;
            case "iframe":
                str += `\n<iframe class="${anim}" src="./${tutorial}/iframe/${step[z].src}" width="${ (step[z].width||"50%") }" height="${ (step[z].height||"50%") }"></iframe>\n`;
                break;
            case "overline":
                let id = T(step[z].txt).replace(/ /g,"-");
                str += '<div class="method-name overline" id="'+id+'">' + T( step[z].txt ) + '</div>';
                if( (T( step[z].txt )).toLowerCase().includes( "example" ) );
                {
                    var l = T(step[z].txt).split(" ");
                    var r = T(step[z].txt).replace( l[0]+" ", "" ).replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase()
                    //sampStr += '<a href="#'+ z +'" class="nav-list-items capitalize">' + r + '</a>'
                    samples[z] = r;
                    if( curHeading ) leftPanelNavs[curHeading].navs[step[z].txt] = T(step[z].txt)
                }
                break;
            case "code":

                const json = step[z];
                if( json.sample ) {
                    str +=`
            <div class="sample-code" style="${css}">
                <div class="sample-code-header">${T(json.sample)}</div>
                <textarea id="${z}" class="actual-code" data-id="${z}">${json.txt}
                </textarea>
                <div class="sample-code-footer">
                    <button class="btn btn-dark sample-code-actions" onclick="runSampleCode('${z}')" title="Run [Ctrl+S]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                            <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                        </svg>
                    </button>
                    <button class="btn btn-dark sample-code-actions" onclick="copySampleCode('${z}')" title="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                        </svg>
                    </button>
                    <button class="btn btn-dark sample-code-actions" onclick="saveSampleCode('${ z }')" title="Save">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                        </svg>
                    </button>
                </div>
            </div>
    
            `;
                }
                else
                    str += `\n<pre class="jdocs-sample-code" style="${css}"><code>${ unescape(T(step[z].txt)) }</code></pre>\n`;
                break;
            case "hr":
                str += `\n<div class="jdocs-hr"><div class="jdocs-hr-line" style="${css}"></div></div>\n`;
                break;
            case "br":
                str += "<br/>";
                break;
            case "button": 
                str += `<button type="button" class="btn jdocs-button btn-dark" href="${step[z].url}" target="${step[z].target}" style="${css}">${step[z].txt}</button>`;
                break;
            default:
                break;
        }
    }
    return str;
}

function Bullets(txt, str) 
{
    var bb = txt.split("~");
    str += bb[0];
    str += "<ul>";
    for (var b = 1; b < bb.length; b++) {
        if (txt.includes("^")) {
            var cc = bb[b].split("^");
            str += "<li>" + T(cc[0]);
            str += "<ul>";
            for (var c = 1; c < cc.length; c++) {
                str += "<li>" + T(cc[c]) + "</li>";
            }
            str += "</ul>";
            str += "</li>";
        }
        else
            str += "<li>" + T(bb[b]) + "</li>";
    }
    str += "</ul>";
    return str;
}

function createLastChapter() 
{
    return '<h2 class="display-2">' + (layouts.tutorialLastChapter.title[lang] || layouts.tutorialLastChapter.title['en']) 
    + '</h2><p>' + (layouts.tutorialLastChapter.value[lang] || layouts.tutorialLastChapter.value['en']) + '</p>';
}

function buildHome( home ) {
    //lang = "en";//TEMP GLOBAL OVERRIDE *Remove*
    var htmlStr = "";
    home = home || "home"
    getTranslation( home, function() {
        getLayouts( home, function() {

            var html = "";

            html +='<section class="jumbotron text-center">'
                html +='<div class="xcontainer" >'
                html +='<h1 class="jumbotron-heading">'+ T(layouts.tutorial.header.title) +'</span></h1>'
                html +='<p class="lead text-muted" lbl="introtext">'+ T(layouts.tutorial.header.subtitle) +'</p>'
                html +='</div>'
                html +='</section>'

            html += '<div class="xcontainer">';
            var array = layouts.tutorial.index
            html += '<div class="album py-5 bg-light">'
            html += '<div class="xcontainer">'
            html += '<div class="row">'
            for (let i = 0; i < array.length; i++) 
            {
                const element = array[i];
                var _x = element.card.isHome ? true : false
                html += '<div class="col-md-4">'
                    html += '<div class="card mb-4 box-shadow" onclick="document.location.href=\'./?id='+array[i].card.folder+'&page=0&home='+_x+'\'">'
                        html += '<div class="card-img-top" style="background-color:white;background-image:url(\'./Home' +"/img/"+ array[i].card.img+ '\');"></div>'
                        html += '<div class="card-body">'
                        html += ' <h3 class="card-title">'+T(array[i].card.text)+'</h3>'
                    html += ' </div>'
                    html += '</div>'
                html += '</div>'
            }
            html += '</div>'
            html += '</div>'
            html += '</div>'
            html += '</div>';
            document.getElementById("main").innerHTML = html;
        }
    )});
}

function buildMainPage( home ) {
    //console.log( home )

    //lang = "en";//TEMP GLOBAL OVERRIDE *Remove*
    var htmlStr = "", links = []
    home = home || "home";
    getTranslation( home, function() {
        getLayouts( home, function() {

            // var docTitle = T(layouts.tutorial.header.title);

            var renderAsList = !layouts.tutorial.card;

            let goBackBtnNav = "";
            let vsDpd = ""; // version dropdown

            if(layouts.tutorial.homeLink !== null) {
                goBackBtnNav = `
                <a class="btn btn-link text-white float-left" id="menu-button" href="../${layouts.tutorial.homeLink}.html?id=${layouts.tutorial.homeLink}&page=0&home=true" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                </a>
                `;
            }

            if( layouts.tutorial.header.version ) {
                vsDpd = `
                        <div class="btn-group version-dropdown">
                            <button type="button" class="btn bg-dark text-light">${layouts.tutorial.header.version}</button>
                            <button type="button" class="btn bg-dark text-light dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false">
                                <span class="sr-only">UI Version</span>
                            </button>
                            <div class="dropdown-menu bg-dark">`;
                if(layouts.tutorial.header.versions && layouts.tutorial.header.versions.length) {
                    
                    layouts.tutorial.header.versions.forEach(m => {
                        const v = `../ui-${m.trim()}/ui.html`;
                        vsDpd += 
                                `<a class="dropdown-item text-light" href="${v}">${m}</a>`;
                    });
                    
                } else {
                    vsDpd += `<a class="dropdown-item text-light" href="#">No other version available</a>`;
                }
                vsDpd += `
                            </div>
                        </div>`;
            }

            if(home !== "home") {
                htmlStr += `
                <nav class="navbar navbar-dark bg-dark fixed-top d-flex ${(goBackBtnNav || vsDpd)?"":"justify-content-center"}">
                    <div class="">
                        ${goBackBtnNav}
                        <a class="navbar-brand bold" role="button" id="doc-title">${T(layouts.tutorial.header.title)}</a>
                    </div>
                    ${vsDpd}
                </nav>
                `;
            }

            htmlStr +=`
                <section class="jumbotron text-center bg-dark main-page-header" style="background-image:url('./img/${ layouts.tutorial.header.img }'); background-size:cover;background-position:top; ${ (layouts.tutorial.header.css|| "") }">  
                    <img class="header-cover-sm" src="./img/${layouts.tutorial.header.img}"/>
                    <div class="xcontainer">
            `;

            if(home != "home" && layouts.tutorial.homeLink !== null) {
                htmlStr += `
                        <a href="../${layouts.tutorial.homeLink.split("/").pop()||"index"}.html?id=${layouts.tutorial.homeLink}&page=0&home=true" role="button" class="btn btn-dark goback-btn bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                            ${layouts.tutorial.home || "Home"}
                        </a>
                `;
            }

            htmlStr +=`
                        <h1 class="jumbotron-heading text-light bold ${home=="home" ? "":"sm-none"}" style="${(layouts.tutorial.header.titleStyle || "")}">${T(layouts.tutorial.header.title)}</h1>
            `;

            if( layouts.tutorial.header.version ) htmlStr += vsDpd;

            htmlStr += `
                        <p class="lead" lbl="introtext" style="${(layouts.tutorial.header.subStyle || "color: #cfd8dc;")}">${ T(layouts.tutorial.header.subtitle || "") }</p>
                    </div>
                </section>
            `;

            if(layouts.tutorial.search !== false) {
                htmlStr += `
                    <div class="container search-container">
                        <div class="container-fluid">
                            <div class="search-box-div">
                                <h4 class="card-subtitle mb-3 text-light"><strong>Search</strong></h4>
                                <input type="text" class="form-control bg-dark text-light" placeholder="Enter keyword" onkeyup="onComponentSearch(this, '${home}')">
                                <small id="results-help" class="form-text text-muted mt-2" style="display:none;"></small>
                            </div>
                        </div>
                    </div>
                `;
            }
            else htmlStr += `<hr class="hair-line">`;

            htmlStr += `<div class="container">`;

            var array = layouts.tutorial.index;
            componentList = array;
            components_lst = false;

            htmlStr += `
                    <div class="album py-3" style="background-color:#121212;">
                        <div class="container-fluid">
            `;

            if( renderAsList === true ) htmlStr += `
                            <div class="list-group" id="components-list" datalist="true">
            `;
            else htmlStr += `
                            <div class="row" id="components-list" datalist="false">
            `;

            var element, _x, _cmp

            for (let i = 0; i < array.length; i++)
            {
                element = array[i]
                _x = element.card.isHome
                _cmp = element.card.cmp

                links.push( './?id='+element.card.folder+'&page=0&home='+_x+'&cmp='+_cmp )
                if( renderAsList === true ) {
                    htmlStr += `
                                <a href="./${(element.card.folder.split("/").pop())}/${(element.card.folder.split("/").pop())}.html?id=${element.card.folder}&page=0&home=${element.card.isHome}&cmp=${element.card.cmp}" class="list-group-item list-group-item-action bg-dark" style="background-color:#1d2124 !important;">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1 text-light card-title">${ T(element.card.text) }</h5>
                                    </div>
                                </a>
                    `;
                    // ${element.card.desc ? "<p class=\"mb-1\">"+T(element.card.desc)+"</p>" : ""}
                } else {
                    htmlStr += `
                                <div class="col-md-4 col-lg-3 col-sm-6">
                                    <div class="card mb-4 box-shadow bg-dark" onclick="document.location.href='./${(element.card.folder.split("/").pop())}/${(element.card.folder.split("/").pop())}.html?id=${element.card.folder}&page=0&home=${element.card.isHome}&cmp=${element.card.cmp}'">
                                        <div class="card-img-top" style="background-image:url('./img/${element.card.img}');"></div>
                                        <div class="card-body">
                                        <h3 class="card-title text-light">${ T(element.card.text) }</h3>
                                        <h6 class="card-subtitle mb-2">${ T(element.card.desc) }</h6>
                                        </div>
                                    </div>
                                </div>
                    `;
                }
            }

            htmlStr += `
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("main").innerHTML = htmlStr;
            document.getElementById("body").style = "background-color:#121212; margin-bottom: 100px;";
        }
    )})
}

function buildTutorial( tutorial, onReady, page, cmp ) {
    var htmlStr = "";

    getTranslation( tutorial, function() { getLayouts( tutorial, function() {
        htmlStr += createHeader(tutorial, layouts.tutorial.header);

        let hmeDir = layouts.tutorial.homeLink ? layouts.tutorial.homeLink.split("/").pop() : "";

        htmlStr += `
        <div class="xcontainer full-height">
            <nav id="navbar" class="navbar navbar-dark bg-dark fixed-top" style="display: none;">
                <div>
                    <button class="btn btn-link text-white" id="menu-button" onclick="openLeftPanel(event)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                    <a class="navbar-brand bold" href="#" id="doc-title"></a>
                </div>
            </nav>
            <div id="main-page" class="h-100">
                <div class="left-panel" id="left-panel">`;
        
        if( layouts.tutorial.homeName ) {
            htmlStr += `
                    <h5 class="left-panel-title" style="text-align: center;">
                        <a href="../${hmeDir}.html?page=0&home=true" class="home-name">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                            <span class="bold">${layouts.tutorial.homeName || "Go Back"}</span>
                        </a>
                    </h5>
            `;
        }
                    
        htmlStr += `<div style="padding: 0px 12px;">
                        <input type="text" onkeyup="onMethodSearch( this )" class="form-control" placeholder="Search..." style="background-color:#212529;color:white;margin:48px 0px 20px 0px;">
                    </div>
                    <div id="result-links" class="nav-list"></div>
                    <nav class="nav flex-column" style="width:100%;text-align:left;" id="left-panel-nav">
                        <a class="nav-link active" id="nav-group-overview" href="#overview">Overview</a>
                    </nav>
                </div>
                <div id="main-content" class="main-content" onclick="closeLeftPanel(event)">
        `
        //htmlStr += createIntro(layouts.tutorial.intro);

        if( layouts.tutorial.steps )
        {
            for (var z = 0; z < layouts.tutorial.steps.length; z++) {
                //htmlStr += '<section class="chapter">';
                htmlStr += createPage( tutorial, layouts.tutorial.steps[z] );
                //htmlStr += '</section>';
            }
        }

        else if( layouts.tutorial.pages )
        {
            var z = page;
            var params = (new URL(document.location)).searchParams;
            var tut = params.get("id");
            htmlStr += '                <div style="overflow: hidden">';
            //htmlStr += '<button onclick="PrevPage()">Prev</button>';
            //htmlStr += '<button onclick="NextPage()">Next</button>';
            var nextPage = (parseInt(page) + 1).toString();
            // console.log("Next page:"+nextPage)
            // console.log("tutorial:"+tut) 

            htmlStr += '                    <div id="cf" >';
            // htmlStr += '<div>';
            var layout = layouts.tutorial.pages[z].layout
            htmlStr = drawSlide( htmlStr, tutorial, z, layout );
            htmlStr += '                    </div>';
            // htmlStr += '</div>';
            StartPageTimer();

            // Save the json layouts
            pageJson = layouts.tutorial.pages[z]
        }

        htmlStr+= `
                </div>
            </div>
        </div>
        <div id="mobile-view" class="right-panel">
            <div class="right-panel-content smartphone">
                <iframe src="${ demoUrl }/index" id="demo-frame" onload="onIframeLoaded()"></iframe>
                <div id="demo-loader" class="smartphone-loading"><div class="loader"></div></div>
            </div>
            <div class="mobile-actions">
                <button class="btn btn-dark btn-icon" onclick="showMobileOutput(false)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                </button>
                <button class="btn btn-dark" onclick="toggleTheme()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                        <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

        `;

        //Apply page styles.
        document.getElementById("main").innerHTML = htmlStr;
        document.getElementById("body").style.display = "block";
        document.getElementById("body").style.cssText = layouts.tutorial.style;

        // update doc-title for small and medium devices navigation bar title
        document.getElementById("doc-title").innerText = docTitle;

        // highlight code
        highlightCode();
        initSampleCodes();

        // add the left navigation panel here
        renderLeftNavigation( leftPanelNavs );
        //if( cmp ) renderLeftExamples( samples )
        initLeftNavigation();

        //Display first page.
        setTimeout(function() { TransPage(1) }, 10);
        if (onReady != null) onReady();
    })})
}

function StartPageTimer()
{
    var time = layouts.tutorial.timer ? layouts.tutorial.timer.time : 100
    pageTime = setTimeout(NextPage, time)
    _running = true;
}

function TransPage( dir )
{
    if( document.getElementById('cf') )
    {
        if( !layouts.tutorial.animation ) layouts.tutorial.animation = { in:"fadeIn", out:"fadeOut" }
        var transitionIn = layouts.tutorial.animation.in
        var transitionOut = layouts.tutorial.animation.out
        if( dir ) document.getElementById('cf').classList.add(transitionIn);
        else {
            document.getElementById('cf').classList.remove(transitionIn);
            document.getElementById('cf').classList.add(transitionOut);
        }
    }
}

function NextPage()
{
    //Set defaults.
    if( !layouts.tutorial.timer) 
        layouts.tutorial.timer = { time: 5000, loop:false }

    //Get options.
    var loop = layouts.tutorial.timer.loop
    var numPages = layouts.tutorial.pages.length
    var params = (new URL(document.location)).searchParams;
    var tutorial =  params.get("id") 
    var page =  params.get("page")
    var nextPage = (parseInt(page) + 1).toString();
    if(nextPage<numPages)
    {
        TransPage( 0 );
        setTimeout(function() {document.location.href="./?id=" + tutorial + "&page=" + nextPage;}, 500);
    }
    else if (loop)
    {
        TransPage( 0 );
        setTimeout(function() {document.location.href="./?id=" + tutorial + "&page=0"}, 500);
    }
}

function PrevPage()
{
    var params = (new URL(document.location)).searchParams;
    var tutorial =  params.get("id") 
    var page =  params.get("page")
    var nextPage = (parseInt(page) - 1).toString();
    if(nextPage>=0)
    {
        TransPage( 0 );
        setTimeout(function() {document.location.href="./?id=" + tutorial + "&page=" + nextPage;}, 500);
    }
}

function drawSlide( htmlStr, tutorial, z, split ) 
{
    //No page split
    if( !split )
    {
        if( layouts.tutorial.pages[z].animation ) {
            htmlStr += `<div class="${ layouts.tutorial.pages[z].animation }">`;
            htmlStr += createPage(tutorial, layouts.tutorial.pages[z] );
            htmlStr += '</div>';
        }
        else {
            htmlStr += createPage(tutorial, layouts.tutorial.pages[z] );
        }
        return htmlStr;
    }
    //Vertical centre split
    else if (split == "vcSplit")
    {
        htmlStr += '<div class="row h-100">';
            htmlStr += '<div class="col my-auto">';
                htmlStr += '<div class="'+layouts.tutorial.pages[z].left.animation+'">';
                    htmlStr += createPage(tutorial, layouts.tutorial.pages[z].left);
                htmlStr += '</div>';
            htmlStr += '</div>';
            if( layouts.tutorial.pages[z].right )
            {
                htmlStr += '<div class="col my-auto">';
                    htmlStr += '<div class="'+layouts.tutorial.pages[z].right.animation+'">';
                        htmlStr += createPage(tutorial, layouts.tutorial.pages[z].right);
                    htmlStr += '</div>';
                htmlStr += '</div>';
            }
        htmlStr += '</div>';
        return htmlStr;
    }
    //Horizontal centre split
    else if (split == "hcSplit")
    {
        htmlStr += '<div class="row h-50">';
            htmlStr += '<div class="col my-auto">';
                htmlStr += '<div>';
                    htmlStr += createPage(tutorial, layouts.tutorial.pages[z].top);
                htmlStr += '</div>';
            htmlStr += '</div>';
        htmlStr += '</div>';    
        htmlStr += '<div class="row h-50">';
            htmlStr += '<div class="col">';
                htmlStr += '<div>';
                    htmlStr += createPage(tutorial, layouts.tutorial.pages[z].bottom);
                htmlStr += '</div>';
            htmlStr += '</div>';
        htmlStr += '</div>';   
        return htmlStr;
    }
    //Vertical + horizontal centre split
    else if (split == "vhcSplit")
    {
        htmlStr += '<div class="row h-100">';
            htmlStr += '<div class="col my-auto">';
                htmlStr += '<div>';
                    htmlStr += createPage(tutorial, layouts.tutorial.pages[z].top);
                htmlStr += '</div>';
            htmlStr += '</div>';
            htmlStr += '<div class="col my-auto">';
                htmlStr += '<div>';
                    htmlStr += createPage(tutorial, layouts.tutorial.pages[z].bottom);
                htmlStr += '</div>';
            htmlStr += '</div>';
        htmlStr += '</div>';
        return htmlStr;
    }
}

function highlightCode()
{
    var codeToHighlight = document.getElementsByTagName("CODE");
    for(var z = 0; z < codeToHighlight.length; z++) {
        w3CodeColor(codeToHighlight[z], "js")
        // attachCopyCodeButton(codeToHighlight[z])
    }
}

function renderLeftNavigation( navs ) {
    var nav, navhtml = ''
    for(var id in navs) {
        nav = navs[id]
        navhtml += `
                <a class="nav-link" id="nav-group-${id}" href="#${id}" data-open="${id}-links">${nav.title}`;
        if( Object.keys(nav.navs).length > 0 ) {
            navhtml += ` <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-360 280-560h400L480-360Z"/></svg>`;
        }
        
        navhtml += `
                </a>
        `;

        navhtml += `
                <div id="${id}-links" class="nav-list">`
        for( var t in nav.navs ) {
            // let isExample = nav.navs[t].toLowerCase().includes("example");
            // let text = nav.navs[t];
            // if( isExample ) {
            //     text = text.toLowerCase().split("example")[1].replace(/[^a-zA-Z0-9]/g, " ");
            // }   
            // navhtml += `
            //         <a href="#${nav.navs[t].replace(/ /g,'-')}" class="nav-list-items ${isExample?"capitalize":""}" id="${nav.navs[t].toLowerCase().trim()}" data-parent="${id}-links" data-group="nav-group-${id}">${text}</a>`
        
            //let isExample = nav.navs[t].toLowerCase().includes("example");
            let text = nav.navs[t];
            // if( isExample ) {
            //     text = text.toLowerCase().split("example")[1].replace(/[^a-zA-Z0-9]/g, " ");
            // }   
            navhtml += `
                    <a href="#${nav.navs[t].replace(/ /g,'-')}" class="nav-list-items" id="${nav.navs[t].toLowerCase().trim()}" data-parent="${id}-links" data-group="nav-group-${id}">${text}</a>`
        }
        navhtml += `
                </div>`
    }
    document.getElementById("left-panel-nav").innerHTML += navhtml
}

function renderLeftExamples( samples ) {
    var samhtml = `<a class="nav-link" href="#examples" data-open="sample-links">Examples</a>`
    samhtml += `<div id="sample-links" class="nav-list">`
    for( var id in samples ) samhtml += `<a href="#${id}" class="nav-list-items capitalize">${samples[id]}</a>`
    samhtml += `</div>`
    document.getElementById("left-panel-nav").innerHTML += samhtml
}

function attachCopyCodeButton( elem )
{
    var button = document.createElement( "button" )
    button.classList.add( "copy-button" )
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor"><path d="M9 18q-.825 0-1.412-.587Q7 16.825 7 16V4q0-.825.588-1.413Q8.175 2 9 2h9q.825 0 1.413.587Q20 3.175 20 4v12q0 .825-.587 1.413Q18.825 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.413-.587Q3 20.825 3 20V7q0-.425.288-.713Q3.575 6 4 6t.713.287Q5 6.575 5 7v13h10q.425 0 .713.288.287.287.287.712t-.287.712Q15.425 22 15 22ZM9 4v12V4Z"/></svg>'
    button.innerHTML = svg

    button._code =  elem.innerText

    button.addEventListener( "click", function() {
        navigator.clipboard.writeText( this._code )
        ShowPopup()
    })

    elem.prepend( button )
}

// Create a pop-up div
function CreatePopup()
{
    var html = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
        <symbol id="info-fill" viewBox="0 0 16 16">
            <path fill="currentcolor" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
    </svg>
    <div class="alert alert-info d-flex align-items-center" style="height:50px;" role="alert">
        <svg role="img" aria-label="Success:" style="width:24px;margin-right:12px;"><use xlink:href="#info-fill"/></svg>
        <span id="popup-message">Code copied to clipboard successfully.</span>
    </div>
    `
    var div = document.createElement( "div" )
    div.style.position = "fixed"
    div.style.display = "none"
    div.style.right = "20px"
    div.style.bottom = "12px"
    div.setAttribute( "id", "popup" )
    div.innerHTML = html

    document.body.appendChild( div )
}
CreatePopup()

function ShowPopup( txt )
{
    if( txt ) {
        document.getElementById("popup-message").textContent = txt;
    }
    document.getElementById( "popup" ).style.display = "block"
    setTimeout( function() {
        document.getElementById( "popup" ).style.display = "none"
    }, 1500 )
}

// Render style for text within backticks
function _S( str ) {
    str = str.replace(/`([^`]+)`/g, '<span class="backtick-enclosed">$1</span>');
    str = str.replace( /\\n/g, "<br>" )
    str = str.replace( /\n/g, "<br>" )
    return str;
}

function initLeftNavigation() {
    var navs = document.getElementsByClassName("nav-link");
    activeLink = navs[0];
    for(let i=0; i<navs.length; i++) {
        navs[i].addEventListener( "click", function() {
            if( !this.classList.contains("active") ) {
                this.classList.add("active");
                if(activeLink && activeLink !== this) activeLink.classList.remove("active");
                activeLink = this;

                if( navList ) navList.style.height = 0;

                navList = document.getElementById( this.getAttribute("data-open") );
                if( navList ) navList.style.height = (navList.childElementCount * 30) + "px";

                if( this.innerText == "Methods" || this.innerText == "Examples" ) {
                    //
                }
                else closeLeftPanel()
            } else {
                this.classList.remove( "active" );
                activeLink = null;
                if( navList ) navList.style.height = 0;
            }
        })
    }

    var navsLinks = document.getElementsByClassName( "nav-list-items" );
    for(let i=0; i< navsLinks.length; i++) {
        navsLinks[i].addEventListener( "click", function( e ) {
            
            navIsClick = true;
            setTimeout(() => {
                navIsClick = false;
            }, 1000)

            if( !this.classList.contains( "active" ) ) {
                this.classList.add( "active" );
                if( activeNavLink ) {
                    activeNavLink.classList.remove( "active" );
                }
                activeNavLink = this;
                closeLeftPanel();
            }
        })
    }

    // observe the size of the main panel
    if ('ResizeObserver' in window) {
        // ResizeObserver is supported
  
        const resizeObserver = new ResizeObserver((entries) => {
            // Handle resize events here

            entries.forEach((entry) => {
                const {target, contentRect} = entry;
                const mainPanel = document.getElementById("main-content");
                const navbar = document.getElementById("navbar");
                if(contentRect.width <= 768 && !isSmallDevice) {
                    isSmallDevice = true;
                    mainPanel.style.width = "100%";
                    closeLeftPanel();
                    navbar.style.display = "block";
                }
                else if(contentRect.width > 768 && isSmallDevice) {
                    isSmallDevice = false;
                    mainPanel.style.width = "calc(100% - 16rem)";
                    openLeftPanel();
                    navbar.style.display = "none";
                }
            });
        });
  
        const targetElement = document.getElementById('main-page');
        resizeObserver.observe(targetElement);
    } else {
        // ResizeObserver is not supported
        console.log('ResizeObserver is not supported in this browser.');
    }

    return;

    // Create a condition that targets viewports at least 768px wide
    var mediaQuery = window.matchMedia('(min-width: 992px)')

    function _check( e )
    {
        if( e.matches )
        {
            isSmallDevice = false
            openLeftPanel()
        }
        else {
            isSmallDevice = true
            closeLeftPanel()
        }
    }
    mediaQuery.addListener( _check )

    _check(mediaQuery)
}

function onComponentSearch( e, home )
{
    var cmps =  componentList

    var val = e.value.toLowerCase()
    var array = cmps.filter( e => e.card.text.toLowerCase().includes( val ) )
    var htmlStr = '', element, _x, _cmp, link
    var container = document.getElementById( "components-list" )
    var dataList = container.getAttribute("datalist")

    for (let i = 0; i < array.length; i++) {
        element = array[i]
        _x = element.card.isHome
        _cmp = element.card.cmp

        link = `./${(element.card.folder.split("/").pop())}/${(element.card.folder.split("/").pop())}.html?id=${element.card.folder}&page=0&home=${element.card.isHome}&cmp=${element.card.cmp}`;
        
        if( LAYOUTDATA.list ) {
            htmlStr += `
                        <a href="./${(element.card.folder.split("/").pop())}/${(element.card.folder.split("/").pop())}.html?id=${element.card.folder}&page=0&home=${element.card.isHome}&cmp=${element.card.cmp}" class="list-group-item list-group-item-action bg-dark" style="background-color:#1d2124 !important;">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1 text-light card-title">${ T(element.card.text) }</h5>
                            </div>
                        </a>
            `;
        } else {
            htmlStr += `
                        <div class="col-md-4 col-lg-3 col-sm-6">
                            <div class="card mb-4 box-shadow bg-dark" onclick="document.location.href='./${(element.card.folder.split("/").pop())}/${(element.card.folder.split("/").pop())}.html?id=${element.card.folder}&page=0&home=${element.card.isHome}&cmp=${element.card.cmp}'">
                                <div class="card-img-top" style="background-image:url('./img/${element.card.img}');"></div>
                                <div class="card-body">
                                <h3 class="card-title text-light">${ T(element.card.text) }</h3>
                                <h6 class="card-subtitle mb-2">${ T(element.card.desc) }</h6>
                                </div>
                            </div>
                        </div>
            `;
        }
    }
    container.innerHTML = htmlStr;

    var c = document.getElementById( "results-help" );
    if( array.length && val ) {
        c.style.display = "block";
        c.innerText = array.length +  " results found";
        if( array.length == 1 ) c.innerText = "1 result found";
    }
    else {
        c.style.display = "none";
    }
}

function onMethodSearch( e )
{
    document.getElementById( "result-links" ).innerHTML = ""
    document.getElementById( "result-links" ).style.height = 0 + "px"

    var val = e.value.toLowerCase()

    if( val == "" ) {
        document.getElementById( "result-links" ).style.height = 0
        document.getElementById( "result-links" ).style.marginBottom = "0px"
        return
    }

    var nl = document.getElementsByClassName( "nav-list-items" ),
        txt = "", l = 0, str = ""
    for( var i=0; i < nl.length; i++ ) {
        txt = nl[i].innerText.toLowerCase()
        if( txt.includes(val) ) {
            str += `<a href="${nl[i].href}" class="nav-list-items">${nl[i].innerText}</a>`
            l++
        }
    }

    document.getElementById( "result-links" ).innerHTML = str
    document.getElementById( "result-links" ).style.height = ( l * 24 ) + "px"
    document.getElementById( "result-links" ).style.marginBottom = "32px"
}

function openLeftPanel( e )
{
    var panel = document.getElementById( "left-panel" );
    if( isSmallDevice && panel.style.width == "16rem" ) closeLeftPanel();
    else panel.style.width = "16rem";
}

function closeLeftPanel( e )
{
    var panel = document.getElementById( "left-panel" )
    if( isSmallDevice && panel) {
        panel.style.width = 0;
        // if( e && e.stopPropagation ) e.stopPropagation();
        // let menuBtn = document.getElementById("menu-button");
        // menuBtn.classList.remove("rotate-45");
        // menuBtn.classList.add("rotate-reverse-45");
        // menuBtn.addEventListener("animationend", function() {
        //     menuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
        //         <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
        //     </svg>`;
        // });
    }
}

function hideMenu() {
    document.getElementById("menu-button").style.display = "none"
}

// right-panel and mobile-view output

function getDeviceJDocsID() {
    let jdocsId = localStorage.getItem("jdocs_id");
    if( !jdocsId ) {
        jdocsId = "jdocs-" + new Date().getTime() + "-" + [ Math.floor( Math.random() * 99999) + 10000];
        localStorage.setItem("jdocs_id", jdocsId);
    }
    return jdocsId;
}

function showMobileOutput( show ) {
    const mobileEl = document.getElementById("mobile-view");
    const mainEl = document.getElementById("main-page");
    const hidden = (!mobileEl.style.width || mobileEl.style.width == "0px");

    if(show && hidden) {
        mobileEl.style.width = "25rem";
        mainEl.style.width = "calc(100vw - 25rem)";
    }

    if(!show && !hidden) {
        mobileEl.style.width = "0px";
        mainEl.style.width = "100vw";
    }
}

function runSampleCode(id, value) {

    if(isDSExt === true) return runDSSample(id, value);

    showMobileOutput( true );
    showDemoLoader( true );

    const jdocsId = getDeviceJDocsID();
    // console.log( jdocsId );

    const iframe = document.getElementById("demo-frame");

    const dataToSend = {
        data: value || _CodeMirrorInstances[id].getValue(),
        jdocsId: jdocsId
    };
    
    fetch(`${ demoUrl }/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type of the request body
        },
        body: JSON.stringify( dataToSend ), // Convert the data to JSON string
    }).then( response => {
        if( response.ok ) {
            iframe.src = `${demoUrl}/index?id=${jdocsId}`
            // showDemoLoader( false );
        }
    }).catch( error => {
        console.error('Error:', error);
        showDemoLoader( false );
    });
}

function runDSSample(id, value) {
    if( ext ) {
        ext.Execute("app", value || _CodeMirrorInstances[id].getValue());
        ShowPopup( "App is running on your phone!" );
    }
}

function copySampleCode( id ) {
    navigator.clipboard.writeText( _CodeMirrorInstances[id].getValue() );
    ShowPopup();
}

function saveSampleCode( id ) {
    const jsCodeString = _CodeMirrorInstances[id].getValue();
    const blob = new Blob([jsCodeString], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.js';
    link.click();
    URL.revokeObjectURL(url);
}

function toggleTheme() {
    showDemoLoader( true );
    const jdocsId = getDeviceJDocsID();
    fetch(`${ demoUrl }/toggle-theme?id=${jdocsId}`, {
        method: 'get'
    }).then( response => {
        if( response.ok ) {
            const iframe = document.getElementById("demo-frame");
            iframe.src = iframe.src;
            // showDemoLoader( false );
        }
    }).catch( error => {
        console.error('Error:', error);
        showDemoLoader( false );
    });
}

function onIframeLoaded() {
    showDemoLoader( false );
}

function showDemoLoader( show ) {
    const loader = document.getElementById("demo-loader");
    if( show ) loader.style.visibility = "visible";
    else loader.style.visibility = "hidden";
}

const _CodeMirrorOptions = {
    mode: "javascript",
    theme: "ds-md-javascript",
    styleActiveLine: true,
    lineNumbers: true,
    tabSize: 4,
    lineWrapping: false,
    indentUnit: 4,
    autoCloseBrackets: true,
    extraKeys: {
        "Ctrl-S": function( cm ) { runSampleCode(null, cm.getValue()) },
        "Cmd-S": function( cm ) { runSampleCode(null, cm.getValue()) }
    }
};
const _CodeMirrorInstances = [];

function initSampleCodes() {
    const codes = document.getElementsByClassName("actual-code");
    for(var i=0; i<codes.length; i++) {
        var id = codes[i].getAttribute("data-id");
        _CodeMirrorInstances[id] = CodeMirror.fromTextArea(document.getElementById(id), _CodeMirrorOptions);
    }
}

window.addEventListener("scroll", function() {

    if( navIsClick ) return;

    const methodsTags = document.getElementsByClassName("method-name");
    const navLinkTags = document.getElementsByClassName("title");
    for(let i=methodsTags.length-1; i>=0; i--) {
        let el = methodsTags[i];
        const rect = el.getBoundingClientRect();
        if(rect.top <= 100 && rect.top >= 25) {
            // The element is 50px or less from the top of the screen
            if( activeNavLink ) activeNavLink.classList.remove("active");

            activeNavLink = document.getElementById( el.textContent.toLowerCase().trim() );
            activeNavLink.classList.add( "active" );

            if( navList ) navList.style.height = "0px";
            navList = document.getElementById( activeNavLink.getAttribute("data-parent") );
            if( navList ) navList.style.height = (navList.childElementCount * 30) + "px";

            if( activeLink ) activeLink.classList.remove("active");
            activeLink = document.getElementById( activeNavLink.getAttribute("data-group") );
            activeLink.classList.add("active");

            // activeNavLink.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
            break;
        }
    }

    for(let i=navLinkTags.length-1; i>=0; i--) {
        let el = navLinkTags[i];
        const rect = el.getBoundingClientRect();
        if( rect.top <= 100 ) {
            let navEl = document.getElementById("nav-group-"+el.id);
            if(activeLink && activeLink !== navEl) {
                activeLink.classList.remove("active");
                if( navList ) navList.style.height = "0px";
            }
            navEl.classList.add( "active" );
            navList = document.getElementById( navEl.getAttribute("data-open") );
            if( navList ) navList.style.height = (navList.childElementCount * 30) + "px";
            activeLink = navEl;
            break;
        }
    }
});