
// Author: Jumar Hamac
// Email: hamacjumar@gmail.com

function _extHints() {
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
            methods = Object.keys(json[name]);
            this.addHints(name, methods);
        }
    }
}
var layoutExtHints = new _extHints();

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
    const url = ext.serverIP+"/ide?cmd=list&dir="+encodeURIComponent("Extensions/Layout/Left/hints/");
    const xhr = new XMLHttpRequest();
    xhr.onload = async function() {
        if(this.status == 404) { return; }
        const data = JSON.parse(this.responseText);
        let file = "", json = {}, link = "", content = "";
       	for(var i=0; i<data.list.length; i++) {
            file = data.list[i];
            link = "./hints/"+file;
            try {
                content = await __dsHelperMakeRequest("get", link);
                json = await JSON.parse(content);
                layoutExtHints.addTipsObject(json);
            } catch( err ) {
                console.log(err);
            } 
        }
    }
    xhr.open("get", url, true);
    xhr.send();
}

const getHint = function(editor, cb, options) {
    
    var WORD = /[\w$]+/, RANGE = 500;
    
    var list = options && options.list || [], seen = {};
    
    function forEach(arr, f, start) {
        for (var i = 0, e = arr.length; i < e; ++i)
        	maybeAdd(typeof(arr[i])=="string"?arr[i]:arr[i].text, start);
    }
    
    function maybeAdd(str, start) {
        if (str.lastIndexOf(start, 0) == 0 && list.indexOf(str) == -1 )
            list.push(str);
    }
    
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var code = editor.getValue();
    var end = cur.ch, start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    var jsKeywords = ("var let const function if else for break case catch class continue debugger default delete do export extends false finally implements import in instanceof interface new null private protected public return static super switch this throw true try typeof void while with yield").split(" ");
    layoutExtHints.addKeywords("jskeywords", jsKeywords);
    
    let words = curLine.trimLeft().split(" ");
    let obj = words.pop();
    let hintIndex = layoutExtHints.hintNames.findIndex(m => obj.startsWith(m+"."));
    
    // look for hints in the ds environment
    if( hintIndex >= 0 && !curLine.endsWith(" ") ) {
        let hname = layoutExtHints.hintNames[hintIndex];
        forEach(layoutExtHints.hints[hname], maybeAdd, obj.substr(obj.lastIndexOf(".")+1)||"");
    }
    else if( obj.includes(".") ) {
        let nms = obj.substr(0, obj.lastIndexOf(".") - 1);
        let regex = null;
        let nmsIndex = layoutExtHints.hintNames.findIndex(m => {
            regex = new RegExp(`${nms}\\s*=\\s*${m}\\.`);
            return regex.test(code);
        });
        let hname = layoutExtHints.hintNames[nmsIndex];
        forEach(layoutExtHints.hints[hname], maybeAdd, obj.substr(obj.lastIndexOf(".")+1)||"");
    }
    else {
        // look for javascript keywords first
        forEach(layoutExtHints.keywords, maybeAdd, curWord);
        
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
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
}

















