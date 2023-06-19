
//control/element id counter.
_ids = 0

//Width/height conversion funcs.
// function _W(w) {
//     if( typeof( w ) == "string" ) return w
//     if( isNaN(parseInt(w)) ) return ( w ? w.replace("%","vw") : null);
//     else return w>=0 ? (w*100)+"%" : null
// }
function _W(w) {
    if(isFinite(w) && w) return parseFloat(w) * 100 + "%";
    else return w;
}
// function _H(h) {
//     if( typeof( h ) == "string" ) return h
//     if( isNaN(parseInt(h)) ) return ( h ? h.replace("%","vh") : null);
//     else return h>=0 ? (h*100)+"%" : null
// }
function _H(h) {
    if(isFinite(h) && h) return parseFloat(h) * 100 + "%";
    else return h;
}

//General util funcs
function _root() { return document.getElementById("root") }
function _popups() { return document.getElementById("popups") }
function _el(id) { return document.getElementById(id) }
function _color(ops) { if( ops && ops.includes("primary")) return "primary"; else if( ops && ops.includes("secondary")) return "secondary"; else return "default" }
function _variant(ops) { if( ops && ops.includes("outline")) return "outlined"; else if( ops && ops.includes("text")) return "text"; else return "contained" }
function _size(ops) { if( ops && ops.includes("small")) return "small"; else if( ops && ops.includes("large")) return "large"; else return "medium" }
// function to resize absolute layouts
function _resAbsLayouts() { for( var id in glob.absLayouts ) if( glob.absLayouts[id] ) glob.absLayouts[id]._resize() }
function _devType() {
    const userAgent = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return "mobile";
    else if(/iPad/i.test(userAgent)) return "tablet";
    else return "desktop";
}

//OS detection
platform = {
    mobile : navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)!=null,
    ios : navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i)!=null,
    android : navigator.userAgent.match(/(android)/i)!=null,
    type: _devType()
}

//Polyfills
global = window

//Other
glob = {}
glob.absLayouts = {}

// document.addEventListener("touchstart", handlePointerDown, {passive: false} )

//Main UI object
function UI()
{

    //--- HIDDEN PROPERTIES ----
    var self = this
    this._fontFile = ""

    //--- VISIBLE PROPERTIES ---
    this.theme = { dark:false, primary: "", secondary: "" }
    this.libs = _hybrid ? app.GetPrivateFolder("Plugins")+"/ui/libs" : "libs"
    this.version = 0.21

    //--- VISIBLE METHODS ------
    this.getVersion = function() { return this.version }

    this.showPopup = function( msg, options ) { return new Popup( msg, options ) }

    this.setTheme = function( theme ) {
        self.theme.dark = (theme && theme.toLowerCase()=="dark");
        document.getElementById("_id_theme").href = self.libs+(self.theme.dark?"/dark.css" :"/light.css")
        document.getElementById("_id_picker_theme").href = self.libs + "/date-time-picker/css" + (self.theme.dark?"/dark.css" :"/light.css")
        
        self.setThemeColor( self.theme.primary, self.theme.secondary )
    }

    /** ## setThemeColor ##
     * Sets the theme color of the app.
     * $$ ui.setThemeColor( primary, secondary ) $$
     * @param {String} primary A hexadecimal color of the form `#rrggbb`
     * @param {String} secondary A hexadecima color of the form `#rrggbb`
     */
    this.setThemeColor = function( primary, secondary )
    {
        function _toDec( d ) {
            return parseInt(d, 16)
        }
        if( primary ) {
            self.theme.primary = primary
            document.documentElement.style.setProperty( "--primary", primary )
            var hex = primary.replace("#","").trim().match(/.{1,2}/g) || []
            var x = {
                r: _toDec(hex[0]),
                g: _toDec(hex[1]),
                b: _toDec(hex[2])
            }
            document.documentElement.style.setProperty( "--primary-o", `rgba(${x.r}, ${x.g}, ${x.b}, 0.5)` )
            document.documentElement.style.setProperty( "--primary-b", `rgba(${x.r}, ${x.g}, ${x.b}, 0.04)` )
        }
        if( secondary ) {
            self.theme.secondary = secondary
            document.documentElement.style.setProperty( "--secondary", secondary )
            var hex = secondary.replace("#","").trim().match(/.{1,2}/g) || []
            var x = {
                r: _toDec(hex[0]),
                g: _toDec(hex[1]),
                b: _toDec(hex[2])
            }
            document.documentElement.style.setProperty( "--secondary-o", `rgba(${x.r}, ${x.g}, ${x.b}, 0.5)` )
            document.documentElement.style.setProperty( "--secondary-b", `rgba(${x.r}, ${x.g}, ${x.b}, 0.04)` )
        }
    }

    this._onctx = function( event )
    {
        if( this._ctxCb ) {
            this._ctxCb()
            var e = event || window.event
            e.preventDefault && e.preventDefault()
            e.stopPropagation && e.stopPropagation()
            e.cancelBubble = true
            e.returnValue = false
            return false
        }
    }

    this.setOnContextMenu = function( callback )
    {
        this._ctxCb = callback
        document.getElementById("root").oncontextmenu = this._onctx.bind(this)
    }

    this.script = function( file )
    {
        var scr = document.createElement( "script" )
        scr.setAttribute( "src", file )
        document.getElementsByTagName( "head" )[ 0 ].append( scr )
    }

    this.setFontFile = function( file ) {
        if( typeof(file) != "string" || !file.includes(".") ) return;
        self._fontFile = file;
        const n = file.split('/')[file.split('/').length-1]
        const name = n.substr(0, n.lastIndexOf("."));
        const css = '@font-face {' +
            'font-family: \''+name+'\'; ' +
            'src: url(\''+file+'\'); '+
        '}';
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);
        self._fontName = name;
    }

    //--- INITIALISATION ---

    if( platform.ios )
    {
        window.alert = function( msg ) {
            // platform.show( msg )
            console.log( msg )
        }
        window.onerror = function (msg, url, line) {
            var file = url.substring(url.lastIndexOf('/')+1)
            // platform.show("JS: ERROR:" + msg + " "+ file + " line:" + line );
            console.log( "JS: ERROR:" + msg + " "+ file + " line:" + line )
        };
    }
}

//Single instance of UI object.
ui = new UI()

