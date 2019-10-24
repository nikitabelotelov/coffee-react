module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/server.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/mocha/RSerial.ts":
/*!*********************************!*\
  !*** ./server/mocha/RSerial.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Converter_1 = __importStar(__webpack_require__(/*! ../stm/Converter */ \"./server/stm/Converter.ts\"));\r\nvar Message_1 = __importDefault(__webpack_require__(/*! ../usart/Message */ \"./server/usart/Message.ts\"));\r\nvar messages = [\r\n    {\r\n        id: Converter_1.StmMessages.SteamPressure,\r\n        content: '1024'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.Group1Pressure,\r\n        content: '587'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.Group1Temperature,\r\n        content: '882'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.Group2Pressure,\r\n        content: '432'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.Group2Temperature,\r\n        content: '909'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.WaterLevel,\r\n        content: '0'\r\n    },\r\n    {\r\n        id: Converter_1.StmMessages.Relay1,\r\n        content: '0'\r\n    }\r\n];\r\nvar MochaMashine = {\r\n    needWater: '0',\r\n};\r\nvar waterProcess = function () {\r\n    setTimeout(function () {\r\n        messages[5].content = '1';\r\n    }, 10000);\r\n};\r\nsetInterval(function () {\r\n    if (MochaMashine.needWater === '1' && messages[6].content === '0') {\r\n        messages[6].content = '1';\r\n        waterProcess();\r\n    }\r\n    if (MochaMashine.needWater === '0') {\r\n        messages[6].content = '0';\r\n    }\r\n}, 100);\r\nvar RSerial = /** @class */ (function () {\r\n    function RSerial() {\r\n        this._portId = '123';\r\n        this.msg = 0;\r\n    }\r\n    RSerial.prototype.startMessages = function (func) {\r\n        var _this = this;\r\n        setTimeout(function () {\r\n            if (!messages[_this.msg]) {\r\n                _this.msg = 0;\r\n            }\r\n            var msgObject = new Message_1.default();\r\n            var msg = msgObject.getMessageFromString(Converter_1.default.toString(messages[_this.msg]));\r\n            func(msg);\r\n            if (_this.echoAns) {\r\n                var msg_1 = msgObject.getMessageFromString(Converter_1.default.toString({ id: Converter_1.StmMessages.Echo, content: _this.echoAns }));\r\n                _this.echoAns = '';\r\n                func(msg_1);\r\n            }\r\n            _this.msg++;\r\n            _this.startMessages(func);\r\n        }, 100);\r\n    };\r\n    RSerial.prototype.on = function (a, f) {\r\n        this.startMessages(f);\r\n        return this;\r\n    };\r\n    RSerial.prototype.open = function (cb) {\r\n        setTimeout(function () {\r\n            cb && cb();\r\n        }, 1000);\r\n    };\r\n    RSerial.prototype.close = function (cb) {\r\n    };\r\n    RSerial.prototype.write = function (data, cb) {\r\n        var msg = new Message_1.default();\r\n        // @ts-ignore\r\n        var message = msg.getMessageFromCode(data);\r\n        var stmM = Converter_1.default.fromString(message);\r\n        this.echoAns = message;\r\n        console.log('STM:', stmM);\r\n        // @ts-ignore\r\n        switch (stmM.id) {\r\n            case Converter_1.StmCommands.SetRelay1:\r\n                MochaMashine.needWater = stmM.content;\r\n                break;\r\n        }\r\n        setTimeout(function () {\r\n            cb();\r\n        }, 100);\r\n    };\r\n    RSerial.prototype.flush = function (cb) {\r\n    };\r\n    return RSerial;\r\n}());\r\nexports.RSerial = RSerial;\r\n\n\n//# sourceURL=webpack:///./server/mocha/RSerial.ts?");

/***/ }),

/***/ "./server/server.tsx":
/*!***************************!*\
  !*** ./server/server.tsx ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\r\n//import template from '../src/template'; use for SSR\r\nvar ws_1 = __importDefault(__webpack_require__(/*! ws */ \"ws\"));\r\nvar Usart_1 = __importDefault(__webpack_require__(/*! ./usart/Usart */ \"./server/usart/Usart.ts\"));\r\nvar RSerial_1 = __webpack_require__(/*! ./mocha/RSerial */ \"./server/mocha/RSerial.ts\");\r\nvar Converter_1 = __importDefault(__webpack_require__(/*! ./stm/Converter */ \"./server/stm/Converter.ts\"));\r\nvar app = express_1.default(), resourcesPath = path_1.default.join(\"\", \".\");\r\napp.use(express_1.default.static(resourcesPath));\r\nvar port = process.env.PORT || 777;\r\nvar expressServer = app.listen({ port: port }, function () {\r\n    return console.log(\"\\uD83D\\uDE80 Server ready\");\r\n});\r\nvar wss = new ws_1.default.Server({ server: expressServer });\r\nvar clients = {};\r\nvar serial = new RSerial_1.RSerial();\r\nvar messagesFromStm = [];\r\nvar usart = new Usart_1.default(serial);\r\nvar sendMessages = function () {\r\n    messagesFromStm.forEach(function (msg, i) {\r\n        for (var client in clients) {\r\n            try {\r\n                clients[client].ws.send(JSON.stringify({ stm: Converter_1.default.toString(msg) }));\r\n                messagesFromStm.splice(i, 1); //TODO:: check it!\r\n            }\r\n            catch (e) { }\r\n        }\r\n    });\r\n};\r\nusart.msgHandlers.push(function (message) {\r\n    var stm = Converter_1.default.fromString(message);\r\n    messagesFromStm.push(stm);\r\n    sendMessages();\r\n});\r\nwss.on(\"connection\", function connectionListener(ws) {\r\n    var id = Math.random();\r\n    clients[id] = {\r\n        ws: ws\r\n    };\r\n    console.log(\"новое соединение \" + id);\r\n    ws.on(\"close\", function () {\r\n        delete clients[id];\r\n    });\r\n    ws.on(\"message\", function (data) {\r\n        console.log(data);\r\n        // @ts-ignore\r\n        var message = JSON.parse(data);\r\n        if (message.stm) {\r\n            usart.sendMessage(message.stm);\r\n        }\r\n        else if (message.settings) {\r\n            //todo: save settings to file\r\n            // read - change - save\r\n        }\r\n    });\r\n});\r\n\n\n//# sourceURL=webpack:///./server/server.tsx?");

/***/ }),

/***/ "./server/stm/Converter.ts":
/*!*********************************!*\
  !*** ./server/stm/Converter.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar StmMessages;\r\n(function (StmMessages) {\r\n    StmMessages[\"SteamPressure\"] = \"a\";\r\n    StmMessages[\"Group1Pressure\"] = \"b\";\r\n    StmMessages[\"Group1Temperature\"] = \"c\";\r\n    StmMessages[\"Group2Pressure\"] = \"d\";\r\n    StmMessages[\"Group2Temperature\"] = \"e\";\r\n    StmMessages[\"PredictGroupTemperature\"] = \"f\";\r\n    StmMessages[\"Error\"] = \"g\";\r\n    StmMessages[\"Valve1\"] = \"e\";\r\n    StmMessages[\"Valve2\"] = \"f\";\r\n    StmMessages[\"Valve3\"] = \"g\";\r\n    StmMessages[\"Valve4\"] = \"h\";\r\n    StmMessages[\"Valve5\"] = \"k\";\r\n    StmMessages[\"Valve6\"] = \"l\";\r\n    StmMessages[\"Relay1\"] = \"m\";\r\n    StmMessages[\"Relay2\"] = \"n\";\r\n    StmMessages[\"Relay3\"] = \"o\";\r\n    StmMessages[\"Relay4\"] = \"p\";\r\n    StmMessages[\"Relay5\"] = \"q\";\r\n    StmMessages[\"Relay6\"] = \"r\";\r\n    StmMessages[\"Relay7\"] = \"s\";\r\n    StmMessages[\"Relay8\"] = \"t\";\r\n    StmMessages[\"Echo\"] = \"u\";\r\n    StmMessages[\"WaterLevel\"] = \"v\";\r\n})(StmMessages = exports.StmMessages || (exports.StmMessages = {}));\r\nvar StmCommands;\r\n(function (StmCommands) {\r\n    StmCommands[\"SetValve1\"] = \"A\";\r\n    StmCommands[\"SetValve2\"] = \"B\";\r\n    StmCommands[\"SetValve3\"] = \"C\";\r\n    StmCommands[\"SetValve4\"] = \"D\";\r\n    StmCommands[\"SetValve5\"] = \"E\";\r\n    StmCommands[\"SetValve6\"] = \"F\";\r\n    StmCommands[\"SetRelay1\"] = \"G\";\r\n    StmCommands[\"SetRelay2\"] = \"H\";\r\n    StmCommands[\"SetRelay3\"] = \"J\";\r\n    StmCommands[\"SetRelay4\"] = \"K\";\r\n    StmCommands[\"SetRelay5\"] = \"L\";\r\n    StmCommands[\"SetRelay6\"] = \"M\";\r\n    StmCommands[\"SetRelay7\"] = \"N\";\r\n    StmCommands[\"SetRelay8\"] = \"O\";\r\n    StmCommands[\"SetRedCold\"] = \"P\";\r\n    StmCommands[\"SetGreenCold\"] = \"Q\";\r\n    StmCommands[\"SetBlueCold\"] = \"R\";\r\n    StmCommands[\"SetRedHot\"] = \"S\";\r\n    StmCommands[\"SetGreenHot\"] = \"T\";\r\n    StmCommands[\"SetBlueHot\"] = \"U\";\r\n})(StmCommands = exports.StmCommands || (exports.StmCommands = {}));\r\nvar Converter = {\r\n    fromString: function (msg) {\r\n        return { id: msg[0], content: msg.substring(1) };\r\n    },\r\n    toString: function (msg) {\r\n        return \"\" + msg.id + msg.content;\r\n    }\r\n};\r\nexports.default = Converter;\r\n\n\n//# sourceURL=webpack:///./server/stm/Converter.ts?");

/***/ }),

/***/ "./server/usart/Constants.ts":
/*!***********************************!*\
  !*** ./server/usart/Constants.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.default = {\r\n    startBit: 0xFA,\r\n    endBit: 0xFB,\r\n};\r\n\n\n//# sourceURL=webpack:///./server/usart/Constants.ts?");

/***/ }),

/***/ "./server/usart/Message.ts":
/*!*********************************!*\
  !*** ./server/usart/Message.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Constants_1 = __importDefault(__webpack_require__(/*! ./Constants */ \"./server/usart/Constants.ts\"));\r\nvar Message = /** @class */ (function () {\r\n    function Message() {\r\n    }\r\n    Message.prototype.getMessageFromString = function (message) {\r\n        var length = message.length;\r\n        var messageBits = [];\r\n        var code = 0xFF;\r\n        for (var i = 0; i < length; i++) {\r\n            var char = message.charCodeAt(i);\r\n            messageBits.push(char);\r\n            code = code ^ char;\r\n        }\r\n        return [Constants_1.default.startBit, length].concat(messageBits).concat([code, Constants_1.default.endBit]);\r\n    };\r\n    Message.prototype.getMessageFromCode = function (code) {\r\n        var length = code[1];\r\n        var message = '';\r\n        var lastByte = 0xFF;\r\n        if (code.length !== length + 4) {\r\n            return '';\r\n        }\r\n        for (var i = 0; i < length; i++) {\r\n            var char = code[i + 2];\r\n            message = \"\" + message + String.fromCharCode(char);\r\n            lastByte = lastByte ^ char;\r\n        }\r\n        if (code[length + 2] !== lastByte) {\r\n            return '';\r\n        }\r\n        return message;\r\n    };\r\n    return Message;\r\n}());\r\nexports.default = Message;\r\n\n\n//# sourceURL=webpack:///./server/usart/Message.ts?");

/***/ }),

/***/ "./server/usart/Usart.ts":
/*!*******************************!*\
  !*** ./server/usart/Usart.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __spreadArrays = (this && this.__spreadArrays) || function () {\r\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\r\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\r\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\r\n            r[k] = a[j];\r\n    return r;\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Constants_1 = __importDefault(__webpack_require__(/*! ./Constants */ \"./server/usart/Constants.ts\"));\r\nvar Message_1 = __importDefault(__webpack_require__(/*! ./Message */ \"./server/usart/Message.ts\"));\r\nvar buffer_1 = __importDefault(__webpack_require__(/*! buffer */ \"buffer\"));\r\nvar Usart = /** @class */ (function () {\r\n    function Usart(serial) {\r\n        var _this = this;\r\n        this.buffer = [];\r\n        this.msgHandlers = [];\r\n        this.queue = [];\r\n        this.inProgress = false;\r\n        serial.open(function () {\r\n            _this.serial = serial;\r\n            serial.on('data', function (data) {\r\n                _this.buffer = __spreadArrays(_this.buffer, data);\r\n                _this.extractMessage();\r\n            });\r\n            _this.queueProcess();\r\n        });\r\n    }\r\n    Usart.prototype.extractMessage = function () {\r\n        var start = this.buffer.indexOf(Constants_1.default.startBit);\r\n        if (start > -1) {\r\n            this.buffer = this.buffer.slice(start);\r\n            var end = this.buffer.indexOf(Constants_1.default.endBit);\r\n            var message = this.buffer.splice(0, end + 1);\r\n            var msgObject = new Message_1.default();\r\n            var stringMsg_1 = msgObject.getMessageFromCode(message);\r\n            this.msgHandlers.forEach(function (el) { return el(stringMsg_1); });\r\n            this.extractMessage();\r\n        }\r\n    };\r\n    Usart.prototype.sendMessage = function (message) {\r\n        var msgObject = new Message_1.default();\r\n        this.queue.push(msgObject.getMessageFromString(message));\r\n        this.queueProcess();\r\n    };\r\n    Usart.prototype.queueProcess = function () {\r\n        var _this = this;\r\n        if (this.serial && !this.inProgress) {\r\n            if (this.queue.length > 0) {\r\n                var msg = buffer_1.default.Buffer.from(this.queue[0]);\r\n                this.queue = this.queue.slice(1);\r\n                this.inProgress = true;\r\n                this.serial.write(msg, function () {\r\n                    _this.inProgress = false;\r\n                    _this.queueProcess();\r\n                });\r\n            }\r\n        }\r\n    };\r\n    return Usart;\r\n}());\r\nexports.default = Usart;\r\n\n\n//# sourceURL=webpack:///./server/usart/Usart.ts?");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"buffer\");\n\n//# sourceURL=webpack:///external_%22buffer%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ws\");\n\n//# sourceURL=webpack:///external_%22ws%22?");

/***/ })

/******/ });