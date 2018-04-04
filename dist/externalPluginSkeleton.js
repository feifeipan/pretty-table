/**
 * @plugin External plugin skeleton.
 * Note: keep in mind, that Handsontable instance creates one instance of the plugin class.
 *
 * @param hotInstance
 * @constructor
 */
function ExternalPluginSkeleton(hotInstance) {

    // Call the BasePlugin constructor.
    Handsontable.plugins.BasePlugin.call(this, hotInstance);

    this._superClass = Handsontable.plugins.BasePlugin;

    // Initialize all your public properties in the class' constructor.
    /**
     * yourProperty description.
     *
     * @type {String}
     */
    this.yourProperty = '';
    this.dblclick = 0;
    this.dblclickEl = null;
    this.formatData = {};
    this.txId = 1; //暂时，todo
    this.sheetName = "sheet1"; //暂时，todo
    this.serviceUrl = "http://127.0.0.1:8080/";

    /*
    TYPE_ERROR = -1; // 仅限响应中用来表示错误
    TYPE_BLANK = 0; // 固定用于未赋值的空的单元格
    TYPE_DECIMAL = 1;
    TYPE_BOOL = 2; // 暂时别测，支持没到位
    TYPE_DATE = 3; // 暂时别测，支持没到位
    TYPE_STRING = 4;
    TYPE_LIST = 5; // 该类型仅限内部运算
    */
    this.typeMapping = {
      "decimalValue":1,
      "strValue":4,
      "1": "decimalValue",
      "4": "strValue"
    }
    /**
     * anotherProperty description.
     * @type {Array}
     */
    this.anotherProperty = [];
}

// Inherit the BasePlugin prototype.
ExternalPluginSkeleton.prototype = Object.create(Handsontable.plugins.BasePlugin.prototype, {
    constructor: {
        writable: true,
        configurable: true,
        value: ExternalPluginSkeleton
    },
});

/**
 * Checks if the plugin is enabled in the settings.
 */
ExternalPluginSkeleton.prototype.isEnabled = function() {
    // console.log("isEnabled", !!this.hot.getSettings().externalPluginSkeleton);
    console.log(this.hot);
    console.log(this.hot.getSettings())
    return !!this.hot.getSettings().externalPluginSkeleton;
};

/**
 * The enablePlugin method is triggered on the beforeInit hook. It should contain your initial plugin setup, along with
 * the hook connections.
 * Note, that this method is run only if the statement in the isEnabled method is true.
 */
ExternalPluginSkeleton.prototype.enablePlugin = function() {
    console.log("==enablePlugin==")
    this.yourProperty = 'Your Value';

    // Add all your plugin hooks here. It's a good idea to make use of the arrow functions to keep the context consistent.
    this.addHook("beforeInit", this.onBeforeInit.bind(this));
    this.addHook("afterInit", this.onAfterInit.bind(this));
    this.addHook("afterChange", this.onAfterChange.bind(this));
    this.addHook("afterOnCellMouseDown", this.onAfterOnCellMouseDown.bind(this));
    this.addHook("afterCreateRow", this.onAfterCreateRow.bind(this));

    // The super class' method assigns the this.enabled property to true, which can be later used to check if plugin is already enabled.
    this._superClass.prototype.enablePlugin.call(this);
};

/**
 * The disablePlugin method is used to disable the plugin. Reset all of your classes properties to their default values here.
 */
ExternalPluginSkeleton.prototype.disablePlugin = function() {
    this.yourProperty = '';
    this.anotherProperty = [];

    // The super class' method takes care of clearing the hook connections and assigning the 'false' value to the 'this.enabled' property.
    this._superClass.prototype.disablePlugin.call(this);
};

/**
 * The updatePlugin method is called on the afterUpdateSettings hook (unless the updateSettings method turned the plugin off).
 * It should contain all the stuff your plugin needs to do to work properly after the Handsontable instance settings were modified.
 */
ExternalPluginSkeleton.prototype.updatePlugin = function() {

    // The updatePlugin method needs to contain all the code needed to properly re-enable the plugin. In most cases simply disabling and enabling the plugin should do the trick.
    this.disablePlugin();
    this.enablePlugin();

    this._superClass.prototype.updatePlugin.call(this);
};

/**
 * The beforeInit hook callback
 */
ExternalPluginSkeleton.prototype.onBeforeInit = function() {
    console.log("==onBeforeInit==");
}

/**
 * The afterInit hook callback.
 *
 * @param {String} new language code.
 */
ExternalPluginSkeleton.prototype.onAfterInit = function(lang) {
    console.log("==onAfterInit==");
    var _this = this;

    var postData = {
        "txId": _this.txId,
        "action": {
            "pathname": "/ffpan/path/to/work"
        }
    }

    //todo
    this.invokeService("rest/workbook/create", postData, (resp) => {
        // console.log("==create workbook==");
        // console.log(resp);
        // console.log("==========");

        var postData2 = {
            "txId": _this.txId,
            "action": {
                "sheetName": _this.sheetName,
                "index": 0
            }
        }

        _this.invokeService("rest/sheet/add", postData2, (resp) => {
            // console.log("==add sheet==");
            // console.log(resp);
            // console.log("==========");
        });
    });

    var data = this.hot.getData();
    this.formatData = convertData(data);
}

/**
 * The afterChange hook callback.
 *
 * @param {Array} 2D array containing information about each of the edited cells [[row, prop, oldVal, newVal], ...].
 * @param {String} source Describes the source of the change.
 */
ExternalPluginSkeleton.prototype.onAfterChange = function(changes, source) {
    // afterChange callback goes here.
    console.log("==onAfterChange==");
    console.log(source);
    console.log(changes);

    if (!changes) {
        return false;
    }

    // todo 
    switch (source) {
        case "backend":
            return false;
            break;

        case "showformula":
            return false;
            break;

        default:
            break;
    }


    this.update(changes);

};
/**
 * The afterOnCellMouseDown hook callback. especially for double click callback
 *
 * @param {Object} mousedown event object.
 * @param {Object} Coordinates object containing the visual row and visual column indexes of the clicked cell.
 * @param {Element} Cell's TD (or TH) element.
 */
ExternalPluginSkeleton.prototype.onAfterOnCellMouseDown = function(event, coords, TD) {
    var _this = this;
    ++this.dblclick;
    var nowEl = [coords["row"], coords["col"]].join("-");

    if (this.dblclick >= 2 && this.dblclickEl == nowEl) {
        console.log("==onDblClick==");
        this.dblclick = 0;
        this.dblclickEl = null;
    } else {
        console.log("==onclick==");
        this.dblclickEl = nowEl;
    }

    setTimeout(function() {
        _this.dblclick = 0;
        _this.dblclickEl = null;
    }, 100);

    var v = this.formatData[nowEl];
    console.log("==formatData==", v);
    if (v.formulaString != null) {
        this.hot.setDataAtCell(coords["row"], coords["col"], v["formulaString"], "showformula");
    }
}

/**
 * @param {Object} mousedown event object.
 * @param {Object} Coordinates object containing the visual row and visual column indexes of the clicked cell.
 * @param {Element} Cell's TD (or TH) element.
 */
ExternalPluginSkeleton.prototype.onAfterCreateRow = function(index, amount, source) {
    var postData = {
        "txId": this.txId,
        "action": {
            "sheetName": this.sheetName,
            "rowIndex": index,
            "nRows": amount
        }
    }

    // this.invokeService("rest/sheet/row/insert", postData, (resp) => {

    // });
}

/**
 * The destroy method should de-assign all of your properties.
 */
ExternalPluginSkeleton.prototype.destroy = function() {
    // The super method takes care of de-assigning the event callbacks, plugin hooks and clearing all the plugin properties.
    this._superClass.prototype.destroy.call(this);
};

ExternalPluginSkeleton.prototype.invokeService = function(name, postData, callback, errorCallback) {
    var _this = this;
    let headers = new Headers({
        "Content-Type": "application/json"
    });

    let sentData = {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(postData),
        credentials: 'include'
    };
    var promise = new Promise((reslove, reject) => {
        fetch(_this.serviceUrl + name, sentData)
            .then(response => response.json())
            .then(responseText => {
                let resp = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
                console.log(resp);
                reslove(resp); //这个resp会被外部接收
            }).catch(err => {
                console.log(err);
                reject(err);
            });
    }).catch(err => {
        console.log('request error ' + err.message);
    });

    promise.then(function(resp) {
        //暂时将callback执行actionCode写在一起，后续看情况拆分
        if (resp["statusCode"] == 0) {
            var content = resp["content"];

            var content_type = Object.prototype.toString.call(content);
            switch(content_type){
              case "[object String]":
                callback && callback(resp);
                break;
              case "[object Array]":
                content.forEach(function(item, index){
                var actionCode = item["actionCode"];
                switch(actionCode){
                  case "UpdateCell":
                    _this.notifyUpdateCell(item);
                    break;
                }
              });
              callback && callback(resp);
            }
        } else {
            errorCallback && errorCallback(resp["message"]);
            console.log("invokeService response error : ", resp["message"]);
        }
        // console.log(resp);
    }).catch(function(error) {
        errorCallback && errorCallback(error.message);
        console.error(error);
    });
};

/**
 call update service after change was observed
 **/
ExternalPluginSkeleton.prototype.update = function(changes) {
    //format post data
    /***
    @request body
  {
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "rowIndex": 0,
        "colIndex": 0,
        "value": {
            "type": 1,
            "decimalValue": 1024
        }
    }
}

{
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "rowIndex": 0,
        "columnIndex": 1,
        "formulaString": "A1*4"
    }
}

    @response body
    {
    "txId": 1,
    "action": {
        "sheetName": "test1",
        "rowIndex": 10,
        "columnIndex": 23,
        "value": {
            "integer": 333,
            "valid": true
        },
        "formulaString": null
    }
  }
  ****/
    var c = changes[0];

    var _this = this;

    //添加逻辑 ，如果值没有改变，则不发送update请求
    var forstr = _this.formatData[c[0] + "-" + c[1]]["formulaString"];
    if (forstr == null) {
        if (c[2] == c[3]) { return false; }
    } else {
        if (c[3] == forstr) {
            _this.hot.setDataAtCell(c[0], c[1], _this.formatData[c[0] + "-" + c[1]]["value"], "showformula")
            return false;
        }
    }

    //create structure
    if (/^=/.test(c[3])) {
        var changedArea = {
            "txId": _this.txId,
            "action": {
                "sheetName": _this.sheetName,
                "rowIndex": c[0],
                "columnIndex": c[1],
                "formulaString": c[3].replace(/(^=)/, "")
            }
        }
    } else {
        var changedArea = {
            "txId": _this.txId,
            "action": {
                "sheetName": _this.sheetName,
                "rowIndex": c[0],
                "columnIndex": c[1],
                "value": {}
            }
        };

        var vTypeIndex, vTypeKey, vData;
        if (isNaN(parseFloat(c[3]))) {
            vTypeIndex = 4;
            vTypeKey = "strValue";
            vData = c[3];
        } else {
            vTypeIndex = 1
            vTypeKey = "decimalValue";
            vData = parseFloat(c[3]);
        }

        changedArea["action"]["value"]["type"] = vTypeIndex;
        changedArea["action"]["value"][vTypeKey] = vData;
    }


    this.invokeService("rest/sheet/cell/update ", changedArea, (resp) => {
           
        },
        (errorMessage) => {
           
        });
}

ExternalPluginSkeleton.prototype.notifyUpdateCell = function(respAction){
         // var respAction = resp["action"];
            var row = respAction["rowIndex"];
            var col = respAction["columnIndex"];

            var vKey = this.typeMapping[respAction["value"]["type"]];
            this.hot.setDataAtCell(row, col, respAction["value"][vKey], "backend");
            this.setValidateStyleAtCell(row, col, respAction["value"]["valid"]);
            this.formatData[row + "-" + col] = {
                "value": respAction["value"]["data"],
                "formulaString": respAction["formulaString"],
                "valid": respAction["value"]["valid"]
            };
}

/**
 * The modify ui by validate value
 *
 * @param {String} rowsIndex
 * @param {String} colsIndex
 * @param {Boolean} isvalidate
 */
ExternalPluginSkeleton.prototype.setValidateStyleAtCell = function(row, col, validate) {
    if (validate) {
        console.log("==validate==")
        this.hot.removeCellMeta(row, col, "className");
    } else {
        console.log("==not validate==")
        this.hot.setCellMeta(row, col, "className", "errorCell");
    }
    this.hot.render();
}

function convertData(data) {
   if(data.length == 0){
            return false;
        }
    var col_len = data[0].length;
    var row_len = data.length;
    var newData = {};
    /**
    {
        "0-0":{
            "value","",
            "formulaString":"SUM(0-0:0-1)",
            "valid":true
        },
        "0-1":{
            "value":"Tesla",
            "formulaString":null,
            "valid":true
        }
    }
    **/
    for (var i = 0; i < row_len; i++) {
        for (var j = 0; j < col_len; j++) {
            newData[i + "-" + j] = {
                "value": data[i][j],
                "formulaString": null,
                "valid": true
            }
        }
    }

    return newData;
    // this.formatData = newData;

    // console.log("==newData==", newData);
}



// You need to register your plugin in order to use it within Handsontable.
Handsontable.DefaultSettings.prototype['externalPluginSkeleton'] = true;
Handsontable.plugins.registerPlugin('externalPluginSkeleton', ExternalPluginSkeleton);