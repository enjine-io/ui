//control/element id counter
_ids = 0

//Width/height conversion funcs
function _W(w, m) {
    if(isFinite(w) && typeof w == "number") {
        if( !m ) return parseFloat(w) * 100 + "%";
        if(m == "v") return parseFloat(w) * 100 + "vw";
        return w + m;
    }
    else return w;
}
function _H(h, m) {
    if(isFinite(h) && typeof h == "number") {
        if( !m ) return parseFloat(h) * 100 + "%";
        if(m == "v") return parseFloat(h) * 100 + "vh";
        return h + m;
    }
    else return h;
}

//General util funcs
function _root() { return document.getElementById("root") }
function _popups() { return document.getElementById("popups") }
function _drawer() { return document.getElementById("drawer") }
function _el(id) { return document.getElementById(id) }
function _color(ops="") { if( ops.includes("primary")) return "primary"; else if( ops.includes("secondary")) return "secondary"; else return "default" }
function _variant(ops="") { if( ops.includes("outline")) return "outlined"; else if( ops.includes("text")) return "text"; else return "contained" }
function _size(ops="") { if( ops.includes("small")) return "small"; else if( ops.includes("large")) return "large"; else return "medium" }
function _padding(el, obj, left, top, right, bottom, mode="") {
    mode = mode.toLowerCase();
    obj._padding.left=left, obj._padding.top=top, obj._padding.right=right, obj._padding.bottom=bottom, obj._padding.mode = mode;
    if(mode == "v") {
        left = isFinite(left) ? left*100 : left;
        top = isFinite(top) ? top*100 : top;
        right = isFinite(right) ? right*100 : right;
        bottom = isFinite(bottom) ? bottom*100 : bottom;
    }
    el.style.paddingLeft = _W(mode ? (mode=="v"? left+"vw" : left+mode) : left);
    el.style.paddingTop = _H(mode ? (mode=="v"? top+"vh" : top+mode) : top);
    el.style.paddingRight = _W(mode ? (mode=="v"? right+"vw" : right+mode) : right);
    el.style.paddingBottom = _H(mode ? (mode=="v"? bottom+"vh" : bottom+mode) : bottom);
}
function _margins(el, obj, left, top, right, bottom, mode="") {
    // todo
}

// Create a new ResizeObserver
const _res_obs_ = new ResizeObserver( () => { glob._abs_lay.map( l => { if( l ) l._resize(); }); });

function _devType() {
    const userAgent = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return "mobile";
    else if(/iPad/i.test(userAgent)) return "tablet";
    else return "desktop";
}

//Color helpers
function _colorHelpers() {
    this.rawColors = {aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]};
    this.getHexColor = function(color = "") {
        color = color.toLowerCase();
        if(typeof color == "string" && color.startsWith("#")) {
            var hex = color.replace("#", "");
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return [r, g, b];
        }
        else if(typeof color == "string" && this.rawColors[color]) {
            return this.rawColors[color];
        }
        else return [0, 0, 0];
    }
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
//Holds all absolute layouts
glob._abs_lay = []

//Main UI object
function UI()
{
    //--- HIDDEN PROPERTIES ----
    var self = this
    this._fontFile = ""
    this._clrh = new _colorHelpers()
    this._rgb = {primary: [33, 150, 243], secondary: [245, 0, 87], defaultBlack: [0,0,0], defaultWhite: [255,255,255]}
    this._routes = [] // {path: "#main", view: mainLay, config: {restricted: false}, detroyable: true}
    this._routesObj = []

    // local functions
    function router( event ) {
        // var oldHash = event.oldURL.split("#")[1]
        var newHash = self._getRoute()
        var prevRoute, currRoute, newRoute, n, o

        if(self._routes.length >= 2) {
            n = self._routes.length - 2
            prevRoute = self._routes[n]
        }

        if(prevRoute && newHash == prevRoute.path) {
            // go back
            currRoute = self._routes.pop()

            if(currRoute.view.type == "Dropdown") currRoute.view._onClose()
            else currRoute.view.hide()
            
            // destroyable routes. examples are controls that starts with "show"
            // such as "showActionSheet", "showColorPicker"
            if( currRoute.destroyable ) {
                o = self._routesObj.findIndex(m => m.path == currRoute.path)
                if(o >= 0) self._routesObj.splice(o, 1)
            }
        }
        else {
            currRoute = self._routes[self._routes.length - 1]
            
            if(currRoute && currRoute.path == newHash) {
                if(currRoute.view._route && currRoute.view.visibility == "hide") {
                    currRoute.view.show()
                }
                return
            }

            // push route
            newRoute = self._routesObj.find(m => m.path == newHash)

            if( !newRoute ) return

            self._routes.push( newRoute )

            newRoute.view.show()
            
            // remove same route previously added
            o = self._routes.findIndex(m => m.path == newHash)
            if(o >= 0 && o != (self._routes.length-1)) {
                self._routes.splice(o, 1)
            }
        }
    }
    
    function showRoute( path ) {
        var route = self._routesObj.find(m => m.path == path)
        if(route && route.view) {
            if(route.view.type == "Layout") {
                route.view.show()
                self._routes.push( route )
            }
        }
        else {
            route = self._routesObj.find(m => m.path == "#404")
            if( route ) {
                route.view.show()
                self._routes.push( route )
            }
        }
    }
    
    // Hidden methods
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
    this._getRoute = function() { return window.location.hash || "#main"; }
    this._appendRoute = function( path ) { window.location.hash = path; }

    this._onLoadMain = function() {
        var hash = self._getRoute()
        var route = self._routesObj.find(m => m.path == hash)
        if(route && route.config && route.config.restricted === true) {
            var err403 = self._routes.find(m => m.path == "#403")
            if( err403 ) {
                err403.view.show()
            }
            else console.log("403 Forbidden: Access Denied")
        }
        else showRoute( hash )
    }

    //--- VISIBLE PROPERTIES ---
    this.version = 0.28
    this.theme = {dark:false, primary: "", secondary: ""}
    // this.libs = _hybrid ? app.GetPrivateFolder("Plugins")+"/ui/libs" : "libs"
    this.libs = window._hybrid ? app.GetPrivateFolder("Plugins")+"/ui/libs" : window._cdn ? "https://cdn.jsdelivr.net/gh/enjine-io/ui@main/libs" : "libs"

    //--- VISIBLE METHODS ------
    this.getVersion = function() { return this.version }

    this.setTheme = function( theme ) {
        self.theme.dark = (theme && theme.toLowerCase()=="dark");
        document.getElementById("_id_theme").href = self.libs + (self.theme.dark?"/dark.css" :"/light.css")
        document.getElementById("_id_picker_theme").href = self.libs + "/date-time-picker/css" + (self.theme.dark?"/dark.css" :"/light.css")
        document.getElementById("_id_dtpicker_theme").href = self.libs +"/material-datetime-picker-"+ (self.theme.dark?"dark.css" :"light.css")
        self.setThemeColor( self.theme.primary, self.theme.secondary )
    }

    /** ## setThemeColor
     * Sets the theme color of the app.
     * $$ ui.setThemeColor( primary, secondary ) $$
     * @param {String} primary A hexadecimal color of the form `#rrggbb`
     * @param {String} secondary A hexadecima color of the form `#rrggbb`
     */
    this.setThemeColor = function( primary, secondary )
    {
        if( primary ) {
            self.theme.primary = primary
            document.documentElement.style.setProperty( "--primary", primary )
            var rgb = this._clrh.getHexColor( primary )
            this._rgb.primary = rgb
            document.documentElement.style.setProperty( "--primary-o", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)` )
            document.documentElement.style.setProperty( "--primary-b", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.04)` )
            document.documentElement.style.setProperty( "--primary-h", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.1)` )
        }
        if( secondary ) {
            self.theme.secondary = secondary
            document.documentElement.style.setProperty( "--secondary", secondary )
            var rgb = this._clrh.getHexColor( secondary )
            this._rgb.secondary = rgb
            document.documentElement.style.setProperty( "--secondary-o", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)` )
            document.documentElement.style.setProperty( "--secondary-b", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.04)` )
            document.documentElement.style.setProperty( "--secondary-h", `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.1)` )
        }
    }

    this.setOnContextMenu = function( callback )
    {
        this._ctxCb = callback
        document.getElementById("root").oncontextmenu = this._onctx.bind(this)
    }

    this.script = function( file )
    {
        var scr = document.createElement("script")
        scr.setAttribute("src", file)
        document.getElementsByTagName("head")[0].append(scr)
    }

    this.css = function( file ) {
        const fileref = document.createElement("link")
        fileref.rel = "stylesheet"
        fileref.type = "text/css"
        fileref.href = file
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    this.setFontFile = function( file ) {
        if(typeof file != "string" || !file.includes(".")) return
        self._fontFile = file
        const n = file.split('/')[file.split('/').length-1]
        const name = n.substring(0, n.lastIndexOf("."));
        const css = '@font-face {' +
            'font-family: \''+name+'\'; ' +
            'src: url(\''+file+'\'); '+
        '}'
        const style = document.createElement('style')
        style.innerText = css
        document.head.appendChild(style)
        self._fontName = name
    }

    // {path: "#main", view: mainLay, config: {restricted: false}, destroyable: bin}
    this.addRoute = function( route ) { this._routesObj.push(route); }

    this.goBack = function() { history.back() }

    this.goForward = function() { history.forward() }

    this.show = function(route = "") {
        if( !route.startsWith("#") ) route = "#"+route
        this._appendRoute( route )
    }

    //--- INITIALISATION ---

    if( platform.ios )
    {
        window.alert = function( msg ) {
            console.log( msg )
        }
        window.onerror = function (msg, url, line) {
            var file = url.substring(url.lastIndexOf('/')+1)
            // platform.show("JS: ERROR:" + msg + " "+ file + " line:" + line );
            console.log("JS: ERROR:" + msg + " "+ file + " line:" + line)
        }
    }

    window.addEventListener('hashchange', router)
}

//Single instance of UI object.
ui = new UI()

