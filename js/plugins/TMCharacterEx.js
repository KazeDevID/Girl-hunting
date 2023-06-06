//=============================================================================
// TMVplugin - キャラクター表示拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.0
// 最終更新日: 2015/11/27
//=============================================================================

/*:
 * @plugindesc イベントに表示位置補正、回転、拡大の機能を追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help イベントのメモ欄にタグを書き込むことで、表示位置の補正、
 * 拡大率の設定、回転角度の設定ができます。
 * 
 * グラフィックの中心を軸に回転させたい場合は angle タグと一緒に
 * <anchorY:0.5> を設定してください。
 * 
 * イベントページが変化した際、次のページでタグ設定がないパラメータは
 * 変化前の状態がそのまま引き継がれます。
 * 
 * メモ欄（イベント）タグ:
 *   <shiftX:0>       # X 方向の表示位置補正値
 *   <shiftY:0>       # Y 方向の表示位置補正値
 *   <angle:0>        # 回転角度
 *   <scaleX:1.0>     # X 方向の拡大率
 *   <scaleY:1.0>     # Y 方向の拡大率
 *   <anchorX:0.5>    # X 方向の中心座標
 *   <anchorY:1.0>    # Y 方向の中心座標
 * 
 * イベントのメモ欄以外に、実行内容の一番上にある注釈コマンド内でも
 * 同様のタグでパラメータを設定することができます。
 * メモ欄と注釈の両方にタグがある場合は注釈が優先されます。
 * 
 * プラグインコマンド:
 *   TMCharacterEx shift 1 5 -3 # イベント１番を右に５、上に３ドットずらす
 *   TMCharacterEx angle 1 90   # イベント１番を右に９０度回転
 *   TMCharacterEx scale 2 1.5 0.5 # イベント２番の幅を５０％拡大、
 *                                   高さを半分に縮小
 * 
 *   イベント番号が 0 の場合は『このイベント』、-1 の場合はプレイヤーが
 *   コマンドの対象となります。
 * 
 * プラグインコマンドの他にイベントコマンド『スクリプト』用のコマンドも
 * あります、イベントコマンド『移動ルートの設定』ではこちらを使用します。
 *   this.setShift(-10, 5)  # このイベントの表示位置を左に１０、下に５ずらす
 *   this.setAngle(180)     # このイベントの上下を反転する
 *   this.setScale(2, 1)    # このイベントの幅だけを２倍に拡大する
 */

var Imported = Imported || {};
Imported.TMCharacterEx = true;

if (!Imported.TMEventBase) {
  Imported.TMEventBase = true;
  (function () {

    //-----------------------------------------------------------------------------
    // Game_Event
    //

    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
      _Game_Event_setupPage.call(this);
      if (this._pageIndex >= 0) {
        this.loadCommentParams();
      }
    };

    Game_Event.prototype.loadCommentParams = function () {
      this._commentParams = {};
      var re = /<([^<>:]+)(:?)([^>]*)>/g;
      var list = this.list();
      for (var i = 0; i < list.length; i++) {
        var command = list[i];
        if (command && command.code == 108 || command.code == 408) {
          for (; ;) {
            var match = re.exec(command.parameters[0]);
            if (match) {
              if (match[2] === ':') {
                this._commentParams[match[1]] = match[3];
              } else {
                this._commentParams[match[1]] = true;
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    };

    Game_Event.prototype.loadTagParam = function (paramName) {
      if (this._commentParams[paramName]) {
        return this._commentParams[paramName];
      } else if (this.event().meta[paramName]) {
        return this.event().meta[paramName];
      } else {
        return null;
      }
    };

  })();
}

(function () {

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //

  var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function () {
    _Game_CharacterBase_initMembers.call(this);
    this.clearTMExParams();
  }

  Game_CharacterBase.prototype.clearTMExParams = function () {
    this._shiftTMExX = 0;
    this._shiftTMExY = 0;
    this._angleTMEx = 0;
    this._scaleTMExX = 1.0;
    this._scaleTMExY = 1.0;
    this._anchorTMExX = 0.5;
    this._anchorTMExY = 1;
  };

  var _Game_CharacterBase_screenX = Game_CharacterBase.prototype.screenX;
  Game_CharacterBase.prototype.screenX = function () {
    return _Game_CharacterBase_screenX.call(this) + this._shiftTMExX;
  };

  var _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
  Game_CharacterBase.prototype.screenY = function () {
    return _Game_CharacterBase_screenY.call(this) + this._shiftTMExY;
  };

  Game_CharacterBase.prototype.screenAngle = function () {
    return this._angleTMEx;
  };

  Game_CharacterBase.prototype.screenScaleX = function () {
    return this._scaleTMExX;
  };

  Game_CharacterBase.prototype.screenScaleY = function () {
    return this._scaleTMExY;
  };

  Game_CharacterBase.prototype.screenAnchorX = function () {
    return this._anchorTMExX;
  };

  Game_CharacterBase.prototype.screenAnchorY = function () {
    return this._anchorTMExY;
  };

  Game_CharacterBase.prototype.setShift = function (shiftX, shiftY) {
    this._shiftTMExX = shiftX;
    this._shiftTMExY = shiftY;
  };

  Game_CharacterBase.prototype.setAngle = function (angle) {
    this._angleTMEx = angle * Math.PI / 180;
  };

  Game_CharacterBase.prototype.setScale = function (scaleX, scaleY) {
    this._scaleTMExX = scaleX;
    this._scaleTMExY = scaleY;
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //

  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function () {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      var param = this.loadTagParam('shiftX');
      this._shiftTMExX = param ? Number(param) : this._shiftTMExX;
      param = this.loadTagParam('shiftY');
      this._shiftTMExY = param ? Number(param) : this._shiftTMExY;
      param = this.loadTagParam('angle');
      this._angleTMEx = param ? Number(param) * Math.PI / 180 : this._angleTMEx;
      param = this.loadTagParam('scaleX');
      this._scaleTMExX = param ? Number(param) : this._scaleTMExX;
      param = this.loadTagParam('scaleY');
      this._scaleTMExY = param ? Number(param) : this._scaleTMExY;
      param = this.loadTagParam('anchorX');
      this._anchorTMExX = param ? Number(param) : this._anchorTMExX;
      param = this.loadTagParam('anchorY');
      this._anchorTMExY = param ? Number(param) : this._anchorTMExY;
    } else {
      this.clearTMExParams();
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'TMCharacterEx') {
      switch (args[0]) {
        case 'shift':
          var character = this.character(args[1]);
          if (character) {
            character.setShift(Number(args[2]), Number(args[3]));
          }
          break;
        case 'angle':
          var character = this.character(args[1]);
          if (character) {
            character.setAngle(Number(args[2]));
          }
          break;
        case 'scale':
          var character = this.character(args[1]);
          if (character) {
            character.setScale(Number(args[2]), Number(args[3]));
          }
          break;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character
  //

  var _Sprite_Character_updateOther = Sprite_Character.prototype.updateOther;
  Sprite_Character.prototype.updateOther = function () {
    _Sprite_Character_updateOther.call(this);
    this.rotation = this._character.screenAngle();
    this.scale.set(this._character.screenScaleX(),
      this._character.screenScaleY());
    this.anchor.set(this._character.screenAnchorX(),
      this._character.screenAnchorY());
  };

})();
