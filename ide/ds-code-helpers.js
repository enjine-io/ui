// Author: Jumar Hamac
// Email: hamacjumar@gmail.com

function _DSCode_() {
    this.hintNames = [];
    this.hints = {};
    this.keywords = [];
    
    /**    
     * Adds a hints into the CodeEditor.
     * @param {String} name The name of the hint object/namespace. E.g. `ui`, `app`, `gfx`
     * @param {Array} arr An array of childs methods available from the name. 
     */
    this.addHints = function(name, arr) {
        if(this.hintNames.indexOf(name) >= 0 ) return;
        this.hintNames.push(name);
        this.hints[name] = arr;
        this.keywords.push(name);
    }
    this.addKeywords = function(name, arr) {
        this.keywords = this.keywords.concat(arr);
    }
    
    
    /**    
     * Use to add tips as an object.
     * @param {Object} json The json object with
     * 
     * {}
     * 
     */
    this.addTipsObject = function(json) {
        let methods = [];
        for(var name in json) {
            // methods = Object.keys(json[name]);
            this.addHints(name, json[name]);
        }
    }
}
var DSCode = new _DSCode_();

function __dsHelperMakeRequest(method, url, body) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function() {
            reject(xhr.statusText);
        };
        xhr.send(body);
    });
}

// load all hints/tips on the `data/hints/` folder in the Extension.
function loadAllTips() {
    const url = "/ide?cmd=list&dir="+encodeURIComponent("Extensions/Edit/Left/data/hints/");
    const xhr = new XMLHttpRequest();
    xhr.onload = async function() {
        if(this.status == 404) { return; }
        const data = JSON.parse(this.responseText);
        let file = "", json = {}, link = "", content = "";
       	for(var i=0; i<data.list.length; i++) {
            file = data.list[i];
            link = "./data/hints/"+file;
            try {
                content = await __dsHelperMakeRequest("get", link);
                json = await JSON.parse(content);
                DSCode.addTipsObject(json);
            } catch( err ) {
                console.log(err);
            } 
        }
    }
    xhr.open("get", url, true);
    xhr.send();
}

// addFiles to the TernServer
// called in index.js in loadAllFiles function.
const loadFileToTernServer = async function(name, url) {
    let content = "", doc, TS;
    try {
        content = await __dsHelperMakeRequest("get", url);
        // Create a virtual CodeMirror document object
        doc = CodeMirror.Doc(content, "javascript");
        TS = TERNSERVER.addDoc(name, doc);
        main.TernServer.docs[name] = TS;
    } catch( err ) {
        console.log(err);
    }
}

// Load all plugins (.js) file to be Loaded into the TernServer
// called in index.js in onStart function.
const loadPlugins = async function( folder ) {
    let url = "/ide?cmd=list&dir="+encodeURIComponent(folder);
    try {
        let res = await __dsHelperMakeRequest("get", url);
        let data = JSON.parse(res), plg, content, path, doc, files;
        for(var i=0; i<data.list.length; i++) {
            plg = data.list[i];
            if(plg!="ui" && plg!="apkbuilder" && plg!="droidscriptuikit") {
                path = "../../../"+folder+"/"+plg+"/";
                try {
                    files = await __dsHelperMakeRequest("get", url+encodeURIComponent(plg)+"/");
                    files = JSON.parse(files);
                    let i = files.list.findIndex(m => (m.toLowerCase() == plg+".js" || m.toLowerCase() == plg+".inc"));
                    if(i >= 0) {
                        try {
                            content = await __dsHelperMakeRequest("get", path+files.list[i]);
                            doc = CodeMirror.Doc(content, "javascript");
                            TERNSERVER.addDoc(plg, doc);
                        } catch(err) {
                            console.log(err);
                        }
                    }
                } catch(err) {
                    console.log(err);
                }
            }
        }
    } catch(error) {
        console.log(error);
    }
}

// this getHint function is deprecated

/*
const getHint = function(editor, cb, options) {
    
    var WORD = /[\w$]+/, RANGE = 500;
    
    function forEach(arr, f, start) {
        for (var i = 0, e = arr.length; i < e; ++i) f(typeof(arr[i])=="string"?arr[i]:arr[i].text, start);
    }
    function maybeAdd(str, start) {
        if (str.lastIndexOf(start, 0) == 0 && list.indexOf(str) == -1 )
            list.push(str);
    }
    
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var end = cur.ch, start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    var jsKeywords = ("var let const function if else for break case catch class continue debugger default delete do export extends false finally implements import in instanceof interface new null private protected public return static super switch this throw true try typeof void while with yield").split(" ");
    DSCode.addKeywords("jskeywords", jsKeywords);
    
    var list = options && options.list || [], seen = {};
    
    let words = curLine.trimLeft().split(" ");
    let obj = words.pop();
    let hintIndex = DSCode.hintNames.findIndex(m => obj.startsWith(m+"."));
    
    // prioritize result from TernServer
    TERNSERVER.getHint(editor, function( values ) {
        list = values;
    });
    
    // look for hints in the ds environment
    if( hintIndex >= 0 && !curLine.endsWith(" ") ) {
        let hname = DSCode.hintNames[hintIndex];
        forEach(DSCode.hints[hname], maybeAdd, obj.substr(obj.lastIndexOf(".")+1)||"");
    }
    else {
        // look for javascript keywords first
        forEach(DSCode.keywords, maybeAdd, curWord);
        
        // lastly look for any words on the code
        
        var re = new RegExp(word.source, "g");
        for (var dir = -1; dir <= 1; dir += 2) {
          var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
          for (; line != endLine; line += dir) {
            var text = editor.getLine(line), m;
            while (m = re.exec(text)) {
              if (line == cur.line && m[0] === curWord) continue;
              if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
                seen[m[0]] = true;
                if( isNaN( m[0] ) ) {
                    maybeAdd(m[0], curWord||"");
                }
              }
            }
          }
        }
    }
    let completions = {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
    cb( completions );
}
getHint.async = true;

*/

















