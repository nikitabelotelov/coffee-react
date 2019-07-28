var serialHelperMock = require('./serialHelperMock');
var lenStart = 0;
var ERROR1_ = 0;
var ERROR2_ = 0;
var ERROR3_ = 0;
var ERROR4_ = 0;
var ERROR5_ = 0;
var ERROR6_ = 0;
var ERROR7_ = 0;
var ERROR8_ = 0;
var ERROR9_ = 0;
var lenFinish;
var currentGroup1T;
var currentGroup2T;
var currentParT;
var ERROR1;
var ERROR2;
var ERROR3;
var ERROR4;
var ERROR5;
var ERROR6;
var ERROR7;
var ERROR8;
var ERROR9;
var hash;
var SerialHelper = {
   currentData: {},
   startRec: 0,
   msgNum: 0,
   serial: null,
   receivedUpdateCallback: null,
   onReceiveUpdate: function(callback) {
      this.receivedUpdateCallback = callback;
   },
   SerialOpen: function() {
      const raspi = require('raspi');
      const Serial = require('raspi-serial').Serial;
      raspi.init(() => {
         var serial = new Serial();
         serial.open(() => {
            this.serial = serial;
            serial.on('data', (data) => {
               data.forEach((element) => {
                  this.Received(element);
               });
               this.receivedUpdateCallback(this.currentData);
            });
         });
      });
   },
   Received: function(bufUart) {
      if (this.startRec)
      {
         switch (this.msgNum) {
            case 0:
               this.currentData.tParReceived = bufUart & 0xFF;
               break;
            case 1:
               this.currentData.tParReceived = this.currentData.tParReceived | (bufUart<<8);
               break;
            case 2:
               this.currentData.tParReceived = this.currentData.tParReceived | (bufUart<<16);
               break;
            case 3:
               this.currentData.tParReceived = this.currentData.tParReceived | (bufUart<<24);
               console.log(this.currentData.tParReceived);
               break;
            case 4:
               this.currentData.currentParP = bufUart & 0xFF;
               break;
            case 5:
               this.currentData.currentParP = this.currentData.currentParP | (bufUart<<8);
               break;
            case 6:
               this.currentData.currentParP = this.currentData.currentParP | (bufUart<<16);
               break;
            case 7:
               this.currentData.currentParP = this.currentData.currentParP | (bufUart<<24);

               /*currentParP = currentParP*10/36;
               if (currentParP > 248)
               {
                  currentParP=currentParP-248;
               } else {
                  currentParP = 0;
               }*/
               break;

            case 8:
               this.currentData.currentGroup1P = bufUart & 0xFF;
               break;
            case 9:
               this.currentData.currentGroup1P = this.currentData.currentGroup1P | (bufUart<<8);
               break;
            case 10:
               this.currentData.currentGroup1P = this.currentData.currentGroup1P | (bufUart<<16);
               break;
            case 11:
               this.currentData.currentGroup1P = this.currentData.currentGroup1P | (bufUart<<24);
               this.currentData.currentGroup1P = this.currentData.currentGroup1P / 17;
               break;

            case 12:
               this.currentData.tG1Received = bufUart & 0xFF;
               break;
            case 13:
               this.currentData.tG1Received = this.currentData.tG1Received | (bufUart<<8);
               break;
            case 14:
               this.currentData.tG1Received = this.currentData.tG1Received | (bufUart<<16);
               break;
            case 15:
               this.currentData.tG1Received = this.currentData.tG1Received | (bufUart<<24);
               break;

            case 16:
               this.currentData.currentGroup2P = bufUart & 0xFF;
               break;
            case 17:
               this.currentData.currentGroup2P = this.currentData.currentGroup2P | (bufUart<<8);
               break;
            case 18:
               this.currentData.currentGroup2P = this.currentData.currentGroup2P | (bufUart<<16);
               break;
            case 19:
               this.currentData.currentGroup2P = this.currentData.currentGroup2P | (bufUart<<24);
               this.currentData.currentGroup2P = this.currentData.currentGroup2P / 17;
               break;

            case 20:
               this.currentData.tG2Received = bufUart & 0xFF;
               break;
            case 21:
               this.currentData.tG2Received = this.currentData.tG2Received | (bufUart<<8);
               break;
            case 22:
               this.currentData.tG2Received = this.currentData.tG2Received | (bufUart<<16);
               break;
            case 23:
               this.currentData.tG2Received = this.currentData.tG2Received | (bufUart<<24);
               break;

            case 24:
               this.currentData.recieved = bufUart & 0xFF;
               break;
            case 25:
               this.currentData.recieved = this.currentData.recieved | (bufUart<<8);
               break;
            case 26:
               this.currentData.recieved = this.currentData.recieved | (bufUart<<16);
               break;
            case 27:
               this.currentData.recieved = this.currentData.recieved | (bufUart<<24);
               break;
            case 28:
               if (bufUart<2) {
                  ERROR1_ = bufUart & 0xFF;
               }
               break;
            case 29:
               if (bufUart<2) {
                  ERROR2_ = bufUart & 0xFF;
               }
               break;
            case 30:
               if (bufUart<2) {
                  ERROR3_ = bufUart & 0xFF;
               }
               break;
            case 31:
               if (bufUart<2) {
                  ERROR4_ = bufUart & 0xFF;
               }
               break;
            case 32:
               if (bufUart<2) {
                  ERROR5_ = bufUart & 0xFF;
               }
               break;
            case 33:
               if (bufUart<2) {
                  ERROR6_ = bufUart & 0xFF;
               }
               break;
            case 34:
               if (bufUart<2) {
                  ERROR7_ = bufUart & 0xFF;
               }
               break;
            case 35:
               if (bufUart<2) {
                  ERROR8_ = bufUart & 0xFF;
               }
               break;
            case 36:
               if (bufUart<2) {
                  ERROR9_ = bufUart & 0xFF;
               }
               break;
            case 37:
               hash = ERROR1_+28*ERROR2_ + 28*(ERROR3_+1) +
                  + 28*(ERROR4_+2) + 28*(ERROR5_+3)
                  + 28*(ERROR6_+4) + 28*(ERROR7_+5)
                  + 28*(ERROR8_+6) + 28*(ERROR9_+7);
               hash = (hash == bufUart);
               break;
            default:
               break;
         }
         this.msgNum++;
         if (bufUart == 0xFD) {
            lenFinish++;
            if (lenFinish == 10){
               lenFinish = 0;
               this.startRec = 0;
               if (this.msgNum == 52){
                  if (this.currentData.tParReceived>0
                     && this.currentData.tParReceived < 200
                     && hash == 1
                     && this.currentData.tG2Received < 1500
                     && this.currentData.tG2Received > 0
                     && this.currentData.tG1Received < 1500
                     && this.currentData.tG1Received > 0) {
                     currentGroup1T = this.currentData.tG1Received;
                     currentGroup2T = this.currentData.tG2Received;
                     currentParT = this.currentData.tParReceived;
                     ERROR1 = ERROR1_;
                     ERROR2 = ERROR2_;
                     ERROR3 = ERROR3_;
                     ERROR4 = ERROR4_;
                     ERROR5 = ERROR5_;
                     ERROR6 = ERROR6_;
                     ERROR7 = ERROR7_;
                     ERROR8 = ERROR8_;
                     ERROR9 = ERROR9_;

                  }
               }
               this.msgNum = 0;
            }
         } else {
            lenFinish = 0;
         }

      } else {
         this.msgNum++;
         if (bufUart == 0xFE) {
            lenStart++;
            if (lenStart == 10){
               lenStart = 0;
               this.startRec = 1;
               this.msgNum = 0;
            }
         } else {
            lenStart = 0;
         }
      }

   },
   Transmit: function() {
      let settings = [];
      let setI = 0;
      let setFin = 0;

      for (setI=0;setI<10;setI++) {
         settings[setI] = 0xFE;
      }

      settings[setI + 0] = global.settings.g1TSet & 0xFF;
      settings[setI + 1] = (global.settings.g1TSet>>8) & 0xFF;
      settings[setI + 2] = (global.settings.g1TSet>>16) & 0xFF;
      settings[setI + 3] = (global.settings.g1TSet>>24) & 0xFF;
      settings[setI + 4] = global.settings.g2TSet & 0xFF;
      settings[setI + 5] = (global.settings.g2TSet>>8) & 0xFF;
      settings[setI + 6] = (global.settings.g2TSet>>16) & 0xFF;
      settings[setI + 7] = (global.settings.g2TSet>>24) & 0xFF;
      settings[setI + 8] = global.settings.g1TimeSet & 0xFF;
      settings[setI + 9] = (global.settings.g1TimeSet>>8) & 0xFF;
      settings[setI + 10] = (global.settings.g1TimeSet>>16) & 0xFF;
      settings[setI + 11] = (global.settings.g1TimeSet>>24) & 0xFF;
      settings[setI + 12] = global.settings.g2TimeSet & 0xFF;
      settings[setI + 13] = (global.settings.g2TimeSet>>8) & 0xFF;
      settings[setI + 14] = (global.settings.g2TimeSet>>16) & 0xFF;
      settings[setI + 15] = (global.settings.g2TimeSet>>24) & 0xFF;

      settings[setI + 16] = global.settings.g1AutoMode1 & 0xFF;
      settings[setI + 17] = (global.settings.g1AutoMode1>>8) & 0xFF;
      settings[setI + 18] = (global.settings.g1AutoMode1>>16) & 0xFF;
      settings[setI + 19] = (global.settings.g1AutoMode1>>24) & 0xFF;

      settings[setI + 20] = global.settings.g1AutoMode2 & 0xFF;
      settings[setI + 21] = (global.settings.g1AutoMode2>>8) & 0xFF;
      settings[setI + 22] = (global.settings.g1AutoMode2>>16) & 0xFF;
      settings[setI + 23] = (global.settings.g1AutoMode2>>24) & 0xFF;

      settings[setI + 24] = global.settings.g2AutoMode1 & 0xFF;
      settings[setI + 25] = (global.settings.g2AutoMode1>>8) & 0xFF;
      settings[setI + 26] = (global.settings.g2AutoMode1>>16) & 0xFF;
      settings[setI + 27] = (global.settings.g2AutoMode1>>24) & 0xFF;

      settings[setI + 28] = global.settings.g2AutoMode2 & 0xFF;
      settings[setI + 29] = (global.settings.g2AutoMode2>>8) & 0xFF;
      settings[setI + 30] = (global.settings.g2AutoMode2>>16) & 0xFF;
      settings[setI + 31] = (global.settings.g2AutoMode2>>24) & 0xFF;

      settings[setI + 32] = 0;
      settings[setI + 33] = 0;
      settings[setI + 34] = 0;
      settings[setI + 35] = 0;

      settings[setI + 36] = global.settings.g1_1TimeSet & 0xFF;
      settings[setI + 37] = (global.settings.g1_1TimeSet>>8) & 0xFF;
      settings[setI + 38] = (global.settings.g1_1TimeSet>>16) & 0xFF;
      settings[setI + 39] = (global.settings.g1_1TimeSet>>24) & 0xFF;
      settings[setI + 40] = global.settings.g2_1TimeSet & 0xFF;
      settings[setI + 41] = (global.settings.g2_1TimeSet>>8) & 0xFF;
      settings[setI + 42] = (global.settings.g2_1TimeSet>>16) & 0xFF;
      settings[setI + 43] = (global.settings.g2_1TimeSet>>24) & 0xFF;

      settings[setI + 44] = global.settings.parTSet & 0xFF;
      settings[setI + 45] = (global.settings.parTSet>>8) & 0xFF;
      settings[setI + 46] = (global.settings.parTSet>>16) & 0xFF;
      settings[setI + 47] = (global.settings.parTSet>>24) & 0xFF;


      settings[setI + 48] = (global.settings.rCold) & 0xFF;
      settings[setI + 49] = (global.settings.rCold>>8) & 0xFF;
      settings[setI + 50] = (global.settings.gCold) & 0xFF;
      settings[setI + 51] = (global.settings.gCold>>8) & 0xFF;
      settings[setI + 52] = (global.settings.bCold) & 0xFF;
      settings[setI + 53] = (global.settings.bCold>>8) & 0xFF;
      settings[setI + 54] = (global.settings.aCold) & 0xFF;
      settings[setI + 55] = (global.settings.aCold>>8) & 0xFF;

      settings[setI + 56] = (global.settings.rHot) & 0xFF;
      settings[setI + 57] = (global.settings.rHot>>8) & 0xFF;
      settings[setI + 58] = (global.settings.gHot) & 0xFF;
      settings[setI + 59] = (global.settings.gHot>>8) & 0xFF;
      settings[setI + 60] = (global.settings.bHot) & 0xFF;
      settings[setI + 61] = (global.settings.bHot>>8) & 0xFF;
      settings[setI + 62] = (global.settings.aHot) & 0xFF;
      settings[setI + 63] = (global.settings.aHot>>8) & 0xFF;

      for (setFin=0;setFin<10;setFin++) {
         settings[setFin+setI+64] = 0xFD;
      }

      let buffer = require('buffer').Buffer.from(settings);

      this.serial.write(buffer);
   }
}

module.exports.SerialHelper = serialHelperMock.patchSerialHelperForDebugging(SerialHelper);