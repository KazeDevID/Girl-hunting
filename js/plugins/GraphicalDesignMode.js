//=============================================================================
// GraphicalDesignMode.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.10.0 2018/08/18 メッセージウィンドウおよびサブウィンドウを本プラグインから触れないようにする設定を追加
// 2.9.1 2018/07/10 コアスクリプト1.6.1以降で装備スロットウィンドウを動かした状態で装備画面を起動するとエラーになる問題を修正
// 2.9.0 2018/06/27 ウィンドウが閉じている最中にGDM_LOCK_MESSAGE_WINDOWが実行されたとき、閉じ終わるまで実行を待機するよう修正
// 2.8.2 2018/05/20 YEP_BattleEngineCore.jsとの併用時、デザインモードで一部ウィンドウで透明状態の切り替えが機能しない競合を解消
// 2.8.1 2018/01/30 最新のNW.jsで動作するよう修正
// 2.8.0 2017/07/26 コンソールからの関数実行で直前に編集したウィンドウの位置を変更できる機能を追加
// 2.7.0 2017/04/11 2.6.0の修正で追加ウィンドウの位置変更が正常に動作しない問題を修正
//                  選択肢ウィンドウについて位置変更を一時的に無効化するプラグインコマンドを追加
// 2.6.0 2017/04/07 追加したピクチャやウィンドウについて任意のスイッチがONのときのみ表示できる機能を追加
// 2.5.0 2017/03/11 ウィンドウを非表示にできる機能を追加
// 2.4.0 2017/01/09 カスタムウィンドウに表示する内容に揃えを指定できる機能を追加しました。
// 2.3.1 2016/11/30 RPGアツマールで画面がNowLoadingから進まなくなる場合がある問題を修正しました。
// 2.3.0 2016/11/25 メッセージウィンドウの背景の表示可否を固定にできる機能を追加しました。
// 2.2.1 2016/11/12 Macの場合、Ctrlキーの代わりにoptionキーを使用するようヘルプを追記
// 2.2.0 2016/11/03 ウィンドウごとに使用するフォントを設定できる機能を追加
// 2.1.0 2016/09/28 アイコンサイズをフォントサイズに合わせて自動で拡縮できる機能を追加
//                  操作対象のウィンドウにフォーカスしたときに枠の色を変えて明示する機能を追加
//                  数値項目のプロパティを設定する際にJavaScript計算式を適用できる機能を追加
// 2.0.0 2016/08/22 本体v1.3.0によりウィンドウ透過の実装が変更されたので対応
// 1.1.3 2016/08/05 本体v1.3.0にて表示される警告を抑制
// 1.1.2 2016/07/20 一部のウィンドウでプロパティロード後にコンテンツが再作成されない問題を修正
// 1.1.1 2016/07/17 余白とフォントサイズの変更が、画面切り替え後に元に戻ってしまう問題を修正
// 1.1.0 2016/07/11 メッセージウィンドウのみ位置変更を一時的に無効化するプラグインコマンドを追加
// 1.0.2 2016/04/02 liply_memoryleak_patch.jsとの競合を解消
// 1.0.1 2016/03/28 一部のウィンドウのプロパティを変更しようとするとエラーが発生する現象の修正
// 1.0.0 2016/03/13 初版
// 0.9.0 2016/03/05 ベータ版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc GUI screen design plug-in
 * Save the project (Ctrl + S) after changing the parameter
 * @author トリアコンタン
 *
 * @param デザインモード
 * @desc Start the game in design mode. (ON / OFF)
 * You can adjust the position by drag & drop during mode.
 * @default false
 * @type boolean
 *
 * @param 自動保存
 * @desc When you change the position, it will automatically save the changes. (ON / OFF)
 * Usually, save with Ctrl + S.
 * @default false
 * @type boolean
 *
 * @param モバイル版作成
 * @desc We will create a window layout for mobile version separately. (ON / OFF)
 * Please ON only when you want to change the window layout between mobile version and PC version.
 * @default false
 * @type boolean
 *
 * @param モバイル偽装
 * @desc Impersonate mobile execution. (ON / OFF)
 * Please turn it on when creating and testing the mobile version window.
 * @default false
 * @type boolean
 *
 * @param ウィンドウ透過
 * @desc Transparent display when windows overlap. (ON / OFF)
 * OFF if similar plug-in realizes the same function.
 * @default false
 * @type boolean
 *
 * @param グリッドサイズ
 * @desc Display grid with specified size during window adjustment.When
 * 0 is specified, it is hidden.
 * @default 48
 * @type number
 *
 * @param パディング
 * @desc Default value for window margin. If it is entered, it will be applied. Default: 18
 * @default 0
 * @type number
 *
 * @param フォントサイズ
 * @desc Default value for window font size. If it is entered, it will be applied. Default: 28
 * @default 0
 * @type number
 *
 * @param 行の高さ
 * @desc It is the default value of the row height of the window. If it is entered, it will be applied. Default: 36
 * @default 0
 * @type number
 *
 * @param 背景透明度
 * @desc The background transparency value of the window is the default value. If it is entered, it will be applied. Default: 192
 * @default 0
 * @type number
 *
 * @param アイコンサイズ調整
 * @desc Automatically adjust icon size when font size is changed.
 * @default false
 * @type boolean
 *
 * @param 背景表示可否固定
 * @desc Ignore the display setting of the background specified for each event command in the message window etc and fix it with the setting value of the plug-in.
 * @default false
 * @type boolean
 *
 * @param 右クリックで消去
 * @desc Hide the entire window when right clicking in design mode. (If it is OFF, only frame is erased)
 * @default false
 * @type boolean
 *
 * @param メッセージウィンドウを無視
 * @desc Do not touch messages, choices, numeric input windows with this plug-in. The changed position is not reset.
 * @default false
 * @type boolean
 *
 * @help Display positions of windows and images of each screen such as menu screen and battle screen
 * You can fine-tune it with drag & drop to graphically design the appearance of the screen.
 * Width, height, margin, background image etc can be changed on the screen.
 *
 * In addition to the default screen, as well as the screen added by the plug-in
 * Position customization is possible.
 * (However, operation can not be guaranteed because it depends on the other's implementation)
 *
 * Follow the procedure below.
 *
 * 1. Set the parameter "design mode" to "ON".
 * - It is "ON" by default.
 *
 * 2. Start test play, battle test, event test.
 *
 * 3. Grab the object with the mouse and place it wherever you want.
 * - Normal window operation by mouse is invalid.
 * - Automatically snaps to other windows and screen edges. (Disable with Shift)
 * - Snap to the grid if you press Ctrl. (Option key on Mac)
 * - Ctrl + Z undoes the last change.
 * - Ctrl + Shift + Enter will initialize all changes to the current scene.
 * - Right-click in the window to toggle transparent / opaque of frame.
 * If you have changed the parameter, toggle the display of the entire window.
 * Once hidden, it can not be redisplayed unless the entire screen is reset.
 * - You can change each property by pressing the number key (※) in the window.
 * - If you type "changePos (x, y);" (x: X coordinate, y: Y coordinate) on the console
 * You can change the window position you just edited.
 *
 * 4. Save the customized position with Ctrl + S.
 *
 * 5. Set "Design mode" to "OFF" during normal test play.
 *
 * * Correspondence between numbers and properties (Numeric keys of those who are not numeric keys)
 *
 * 1. Width of window (* 1)
 * 2. Window height (Direct specification) (* 1)
 * 3. Window margin (* 2)
 * 4. Window font size (* 2)
 * 5. Height per row of the window (* 2)
 * 6. Background transparency of window (* 2)
 * 7. Number of rows in the window (* 2)
 * 8. Window background image file name
 * 9. Window font name (* 3)
 *
 * 1 JS calculation formula can be applied. The calculation formula is evaluated only once on the spot you entered.
 * 2 JS calculation formula can be applied. The formula is saved and reevaluated each time the screen is displayed.
 * If you do not know, there is no problem if you set numerical values ​​as before.
 * * 3 It is necessary to load the font. Please use "font load plug-in".
 * Obtained from: raw.githubusercontent.com/triacontane/RPGMakerMV/master/FontLoad.js
 * * 4 For Mac, substitute the Ctrl key with the option key. (It does not react with command key)
 *
 * In addition, you can display additional pictures and windows additionally.
 * For details, refer to "User rewrite area" in the source code.
 * You can also adjust the position by dragging and dropping on addition display.
 *
 * The contents displayed in the window can be adjusted with the following control characters.
 * \\ AL [left] # Left align (even if not filled, it will also be left justified)
 * \\ AL [0] # same as above
 * \ AL [center] # center
 * \\ AL [1] # same as above
 * \\ AL [right] # right align
 * \\ AL [2] # same as above
 *
 * The saved contents are saved in "data / ContainerProperties.json".
 * It is also possible to edit with JSON editor etc.
 *
 * You can also define different window placements for mobile terminals.
 * Mobile placement information is saved in "data / ContainerPropertiesMobile.json".
 *
 * If you enable the mobile impersonation option, running on mobile terminal on PC
 * Can be reproduced. Reproducing the mobile execution, the format of use of audio and video files
 * It may change or audio file playback may not be done.
 *
 * The window whose position has been changed with this plug-in can not be changed afterwards.
 * Therefore, with this plug-in for the window whose position is dynamically changed during the game
 * If you fix the position, it may not be displayed correctly.
 *
 * If the display goes wrong, including those cases
 * It is recommended that you execute Ctrl + Shift + Enter once to initialize all the windows in the screen.
 *
 * Careful! When you add the picture, at the time of deployment
 * It may be excluded as unused file.
 * In that case, it is necessary to take measures such as reinserting deleted files.
 *
 * Caution!
 * Depending on the usage status of other plugins the position and size of the window
 * It may not be saved correctly.
 *
 * Plugin command details
 * Execute from event command "plugin command".
 * (Parameters are separated by a space)
 *
 * GDM cancellation message window
 * GDM_UNLOCK_MESSAGE_WINDOW
 * Temporarily cancel the position change of the message window.
 * The coordinates changed by the plug-in are invalidated
 * The window position specified in the event "Message display" becomes effective.
 *
 * GDM fixed message window
 * GDM_LOCK_MESSAGE_WINDOW
 * Re-enable the position change of the message window.
 * The coordinates changed by the plug-in become effective
 * The window position specified in the event "Message display" is ignored.
 *
 * GDM cancellation _ choice window
 * GDM_UNLOCK_CHOICE_WINDOW
 * Temporarily cancel the position change of the choice window.
 * The coordinates changed by the plug-in are invalidated
 * The window position specified in the event "Show choices" becomes effective.
 *
 * GDM fixed _ choice window
 * GDM_LOCK_CHOICE_WINDOW
 * Re-enable the position change of the message window.
 * The coordinates changed by the plug-in become effective
 * The window position specified in the event "Show Choice" is ignored.
 *
 * Terms of service:
 * It is possible to modify and re-distribute without permission to the author, and use forms (commercial, 18 prohibition etc.)
 There is no restriction on *.
 * This plugin is already yours.
 */
var $dataContainerProperties = null;

(function () {
    'use strict';
    //=============================================================================
    // user rewrite area - start -
        // pictures: Picture information to be displayed on each screen
        // windows: Window information to be displayed on each screen
        // (The filename specified here is specified at deployment time
        // It may be excluded as unused file)
        // * To make copying and pasting easier, we also give a comma to the last item.
    //=============================================================================
    var settings = {
        /* タイトル画面の追加情報 */
        Scene_Title: {
            /* pictures:シーンに追加表示する画像です。無条件で表示されます。 */
            pictures: [
                /* file:「img/pictures/」以下のファイルを拡張子なしで指定します  switchId: 表示条件となるスイッチIDです*/
                { file: '', switchId: 0 },
            ],
            /* windows:シーンに追加表示するウィンドウです。*/
            windows: [
                /* lines:表示内容の配列です。 制御文字が利用できます。「\\i[n]」と「\」をひとつ多く指定してください。*/
                /* switchId:出現条件となるスイッチIDです */
                /* 位置を調整後に新しいウィンドウを追加する場合は、必ず「配列の末尾に追加」してください */
                { lines: [], switchId: 0 },
            ],
        },
        /* メインメニュー画面の追加情報 */
        Scene_Menu: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* 戦闘画面の追加情報 */
        Scene_Battle: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* アイテムメニュー画面の追加情報 */
        Scene_Item: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* スキルメニュー画面の追加情報 */
        Scene_Skill: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* 装備メニュー画面の追加情報 */
        Scene_Equip: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* ステータスメニュー画面の追加情報 */
        Scene_Status: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* オプション画面の追加情報 */
        Scene_Options: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* セーブ画面の追加情報 */
        Scene_Save: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* ロード画面の追加情報 */
        Scene_Load: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* ショップ画面の追加情報 */
        Scene_Shop: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* 名前入力画面の追加情報 */
        Scene_Name: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
        /* ゲームオーバー画面の追加情報 */
        Scene_Gameover: {
            pictures: [
                { file: '', switchId: 0 },
            ],
            windows: [
                { lines: [], switchId: 0 },
            ],
        },
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName = 'GraphicalDesignMode';
    var metaTagPrefix = 'GDM';

    if (!Utils.RPGMAKER_VERSION || Utils.RPGMAKER_VERSION.match(/^1\.2./)) {
        alert('!!!このプラグインは本体バージョン1.3系以降でないと使用できません。!!!');
        return;
    }

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (value == null) return null;
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgEval = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function (text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var checkTypeFunction = function (value) {
        return checkType(value, 'Function');
    };

    var checkType = function (value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    var getClassName = function (object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var paramDesignMode = getParamBoolean(['DesignMode', 'デザインモード']);
    var paramThroughWindow = getParamBoolean(['ThroughWindow', 'ウィンドウ透過']);
    var paramAutoSave = getParamBoolean(['AutoSave', '自動保存']);
    var paramGridSize = getParamNumber(['GridSize', 'グリッドサイズ'], 0) || 0;
    var paramPadding = getParamNumber(['Padding', 'パディング']);
    var paramFontSize = getParamNumber(['FontSize', 'フォントサイズ']);
    var paramLineHeight = getParamNumber(['LineHeight', '行の高さ']);
    var paramBackOpacity = getParamNumber(['LineHeight', '背景透明度']);
    var paramMobileMake = getParamBoolean(['MobileMake', 'モバイル版作成']);
    var paramFakeMobile = getParamBoolean(['FakeMobile', 'モバイル偽装']);
    var paramIconSizeScale = getParamBoolean(['IconSizeScale', 'アイコンサイズ調整']);
    var paramBackgroundFixed = getParamBoolean(['BackgroundFixed', '背景表示可否固定']);
    var paramRightClickHide = getParamBoolean(['RightClickHide', '右クリックで消去']);
    var paramIgnoreMesWindow = getParamBoolean(['IgnoreMesWindow', 'メッセージウィンドウを無視']);

    //=============================================================================
    // Utils
    //  デザインモード判定を追加します。
    //=============================================================================
    Utils.isDesignMode = function () {
        return (this.isOptionValid('test') || this.isOptionValid('btest') || this.isOptionValid('etest')) &&
            this.isNwjs() && paramDesignMode;
    };

    //=============================================================================
    // デザインモードの場合のみ実装する
    //=============================================================================
    if (Utils.isDesignMode()) {

        //=============================================================================
        // グローバル関数
        //=============================================================================
        window.changePos = function (x, y) {
            SceneManager.setLastWindowPosition(x, y);
        };

        //=============================================================================
        // Input
        //  コピーと上書き保存用のボタンを追加定義します。
        //=============================================================================
        Input.keyMapper[67] = 'copy';
        Input.keyMapper[83] = 'save';
        for (var i = 49; i < 58; i++) {
            Input.keyMapper[i] = 'num' + (i - 48);
        }

        var _Input__wrapNwjsAlert = Input._wrapNwjsAlert;
        Input._wrapNwjsAlert = function () {
            _Input__wrapNwjsAlert.apply(this, arguments);
            var _prompt = window.prompt;
            window.prompt = function () {
                var gui = require('nw.gui');
                var win = gui.Window.get();
                var result = _prompt.apply(this, arguments);
                win.focus();
                Input.clear();
                return result;
            };
        };

        var _Input_isRepeated = Input.isRepeated;
        Input.isRepeated = function (keyName) {
            if (keyName === 'ok' && this.isPressed('control')) {
                return false;
            }
            return _Input_isRepeated.apply(this, arguments);
        };

        //=============================================================================
        // TouchInput
        //  ポインタ位置を常に記憶します。
        //=============================================================================
        TouchInput._onMouseMove = function (event) {
            var x = Graphics.pageToCanvasX(event.pageX);
            var y = Graphics.pageToCanvasY(event.pageY);
            this._onMove(x, y);
        };

        //=============================================================================
        // SceneManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        SceneManager.controlNumber = 0;

        var _SceneManager_initialize = SceneManager.initialize;
        SceneManager.initialize = function () {
            _SceneManager_initialize.call(this);
            this.lastWindowX = null;
            this.lastWindowY = null;
            this._lastWindow = null;
            this._windowPositionChanged = false;
            this.infoWindow = '';
            this.infoExtend = '';
            this._copyCount = 0;
            this._infoHelp = 'デザインモードで起動しています。 ';
            this._documentTitle = '';
            this._changeStack = [];
            this.showDevToolsForGdm();
        };

        SceneManager.setLastWindow = function (windowObject) {
            this._lastWindow = windowObject;
        };

        SceneManager.setLastWindowPosition = function (x, y) {
            if (!this._lastWindow) {
                this.setInfoExtend('直前に触れたオブジェクトが存在しないため、この操作は無効です。', 0);
                return;
            }
            this._lastWindow.position.x = x;
            this._lastWindow.position.y = y;
            this._windowPositionChanged = true;
        };

        SceneManager.isWindowPositionChanged = function (windowObject) {
            if (this._windowPositionChanged && windowObject === this._lastWindow) {
                this._windowPositionChanged = false;
                return true;
            }
            return false;
        };

        SceneManager.showDevToolsForGdm = function () {
            var nwWin = require('nw.gui').Window.get();
            if (nwWin.isDevToolsOpen) {
                if (!nwWin.isDevToolsOpen()) {
                    var devTool = nwWin.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    nwWin.focus();
                }
            } else {
                nwWin.showDevTools();
            }
            this.outputStartLog();
        };

        SceneManager.outputStartLog = function () {
            var logValue = [
                '☆☆☆ Welcome, I started in design mode. ☆☆☆ \ n ',
                'In design mode, you can design the screen from the actual game screen by freely setting the placement and properties of the object. \ n ',
                '--------------------Method of operation------------------------- --------------------------------------------- \ n ',
                'Drag and drop: Grab windows and images and reposition them wherever you want. \ n ',
                'Ctrl + mouse: windows and images will snap to the grid. (Option key on Mac) \ n ',
                'Shift + mouse: window and image will not snap to object or screen edge. \ n ',
                'If you type "changePos (x, y);" (x: X coordinate, y: Y coordinate) on the console, you can change the window position just edited. \ n ',
                'Ctrl + S: Save all changes. \ n ',
                'Ctrl + C: Copy the most recent coordinates to the clipboard. \ n ',
                'Ctrl + Z: Undo the last operation you made. \ n ',
                'Ctrl + Shift + Enter: Reset all the displayed screen layouts and load them again. \ n ',
                'Right click: toggles display / non-display of window frame (or whole window). \ n ',
                'Numeric key: If you press within the range of the window, you can change the corresponding property as follows. \ n ',
                '1. Width of the window (* 1) \ n',
                '2. Window height (direct designation) (* 1) \ n',
                '3. Window margin (* 2) \ n',
                '4. Window font size (* 2) \ n',
                '5. Height (* 2) per line of the window \ n',
                '6. Window background transparency (* 2) \ n',
                '7. Number of lines in the window (* 2) \ n',
                '8. Window background image file name \ n',
                '9. Window font name (* 3) \ n',
                '※ 1 JS calculation formula can be applied. The calculation formula is evaluated only once on the spot you entered. \ n ',
                '※ 2 JS calculation formula can be applied. The formula is saved and reevaluated each time the screen is displayed. \ n ',
                'If you do not understand, there is no problem if you set a numerical value as before. \ n ',
                '* 3 It is necessary to load the font beforehand. Please use "font load plug-in". \ n ',
                'Source: raw.githubusercontent.com/triacontane/RPGMakerMV/master/FontLoad.js \ n',
                '※ 4 For Mac, substitute the Ctrl key with the option key. (It does not respond with command key) \ n ',
                '------------------------------------------------------------------- -------------------------------------------------------------------- - \ n ',
                'The following operation log will be displayed. \ n '
            ];
            console.log.apply(console, logValue);
        };

        var _SceneManager_onSceneCreate = SceneManager.onSceneCreate;
        SceneManager.onSceneCreate = function () {
            _SceneManager_onSceneCreate.apply(this, arguments);
            this._changeStack = [];
        };

        SceneManager.pushChangeStack = function (child) {
            var index = child.parent.getChildIndex(child);
            var info = { parent: child.parent, index: index };
            child.saveProperty(info);
            this._changeStack.push(info);
        };

        SceneManager.popChangeStack = function () {
            var info = this._changeStack.pop();
            if (info) {
                var child = info.parent.children[info.index];
                if (child) {
                    child.loadProperty(info);
                    child.saveContainerInfo();
                    return true;
                }
            }
            return false;
        };

        var _SceneManager_update = SceneManager.updateMain;
        SceneManager.updateMain = function () {
            _SceneManager_update.apply(this, arguments);
            this.updateDragInfo();
        };

        SceneManager.updateDragInfo = function () {
            if (Input.isPressed('control') && Input.isTriggered('copy')) {
                SoundManager.playOk();
                if (this.lastWindowX == null || this.lastWindowY == null) return;
                var clipboard = require('nw.gui').Clipboard.get();
                var copyValue = '';
                if (this._copyCount % 2 === 0) {
                    copyValue = this.lastWindowX.toString();
                    this.setInfoExtend('X座標[' + copyValue + ']をクリップボードにコピーしました。', 0);
                } else {
                    copyValue = this.lastWindowY.toString();
                    this.setInfoExtend('Y座標[' + copyValue + ']をクリップボードにコピーしました。', 0);
                }
                clipboard.set(copyValue, 'text');
                this._copyCount++;
            }
            if (Input.isPressed('control') && Input.isTriggered('save')) {
                SoundManager.playSave();
                DataManager.saveDataFileWp();
                this.setInfoExtend('すべての変更を保存しました。', 0);
            }
            if (Input.isPressed('control') && Input.isTriggered('ok')) {
                if (this.popChangeStack()) {
                    SoundManager.playCancel();
                    this.setInfoExtend('左記の番号の操作を元に戻しました。', -1);
                    if (paramAutoSave) DataManager.saveDataFileWp();
                }
            }
            if (Input.isPressed('control') && Input.isPressed('shift') && Input.isPressed('ok')) {
                $dataContainerProperties[this.getSceneName()] = {};
                DataManager.saveDataFileWp();
                location.reload();
            }
            var docTitle = this._infoHelp + this.infoWindow + this.infoExtend;
            document.title = docTitle;
            this._documentTitle = docTitle;
        };

        SceneManager.setInfoExtend = function (value, add) {
            this.controlNumber += add;
            this.infoExtend = ' ' + value;
            console.log(add ? this.controlNumber + (add < 0 ? 1 : 0) + ' : ' + value : value);
            if (paramAutoSave && add !== 0) {
                console.log('自動保存により変更が保存されました。');
            }
        };

        //=============================================================================
        // DataManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        DataManager.saveDataFileWp = function () {
            StorageManager.saveToLocalDataFile(this._databaseFileCp.src, window[this._databaseFileCp.name]);
        };

        //=============================================================================
        // StorageManager
        //  ウィンドウポジションをjson形式で保存する処理を追加定義します。
        //=============================================================================
        StorageManager.saveToLocalDataFile = function (fileName, json) {
            var data = JSON.stringify(json);
            var fs = require('fs');
            var dirPath = this.localDataFileDirectoryPath();
            var filePath = dirPath + fileName;
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, data);
        };

        StorageManager.localDataFileDirectoryPath = function () {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            return path.join(base, 'data/custom/');
        };

        //=============================================================================
        // Scene_Base
        //  ウィンドウをドラッグ＆ドロップします。
        //=============================================================================
        var _Scene_Base_update = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () {
            _Scene_Base_update.apply(this, arguments);
            if (this._windowLayer) this.updateDrag();
        };

        Scene_Base.prototype.updateDrag = function () {
            this._windowLayer.isFrameChanged = false;

            var result = this._windowLayer.children.clone().reverse().some(function (container) {
                return checkTypeFunction(container.processDesign) && container.processDesign();
            }, this);
            if (result) return;
            this.children.clone().reverse().some(function (container) {
                return checkTypeFunction(container.processDesign) && container.processDesign();
            }, this);
        };

        var _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
        Scene_Base.prototype.createWindowLayer = function () {
            if (!(this instanceof Scene_Boot) && !(this instanceof Scene_Map)) this.createGridSprite();
            _Scene_Base_createWindowLayer.apply(this, arguments);
        };

        Scene_Base.prototype.createGridSprite = function () {
            var size = paramGridSize;
            if (size === 0) return;
            var width = Graphics.boxWidth;
            var height = Graphics.boxHeight;
            this._gridSprite = new Sprite();
            this._gridSprite.setFrame(0, 0, width, height);
            var bitmap = new Bitmap(width, height);
            for (var x = 0; x < width; x += size) {
                bitmap.fillRect(x, 0, 1, height, 'rgba(255,255,255,1.0)');
            }
            for (var y = 0; y < height; y += size) {
                bitmap.fillRect(0, y, width, 1, 'rgba(255,255,255,1.0)');
            }
            this._gridSprite.bitmap = bitmap;
            this._gridSprite.moveDisable = true;
            this.addChild(this._gridSprite);
        };

        //=============================================================================
        // PIXI.Container およびそのサブクラス
        //  コンテナをドラッグ＆ドロップします。
        //=============================================================================
        var _PIXI_DisplayObjectContainer_initialize = PIXI.Container.prototype.initialize;
        PIXI.Container.prototype.initialize = function (x, y, width, height) {
            _PIXI_DisplayObjectContainer_initialize.apply(this, arguments);
            this._holding = false;
            this._dx = 0;
            this._dy = 0;
            this.moveDisable = false;
            this._positionLock = false;
        };

        PIXI.Container.prototype.processDesign = function () {
            var result = false;
            if (!this.moveDisable) {
                if (this.processPosition()) {
                    var info = 'X:[' + this.x + '] Y:[' + this.y + ']';
                    SceneManager.lastWindowX = this.x;
                    SceneManager.lastWindowY = this.y;
                    SceneManager.infoWindow = info;
                    SceneManager.infoCopy = '';
                    if (!this._holding) SceneManager.setInfoExtend('位置を変更しました。' + info, 1);
                    result = true;
                }
                if (this.processOpacity()) {
                    SceneManager.setInfoExtend('背景の表示/非表示を変更しました。', 1);
                    result = true;
                }
                if (this.processInput()) {
                    SceneManager.setInfoExtend(this._propLabel + 'の値を' + this._propValue + 'に変更しました。', 1);
                    result = true;
                }
                this.processFrameChange();
            }
            return result;
        };

        if (paramIgnoreMesWindow) {
            Window_Message.prototype.processDesign = function () { };
            Window_NumberInput.prototype.processDesign = function () { };
            Window_ChoiceList.prototype.processDesign = function () { };
        }

        PIXI.Container.prototype.processPosition = function () {
            if (SceneManager.isWindowPositionChanged(this)) {
                return true;
            }
            if (this.isTouchEvent(TouchInput.isTriggered) || (this._holding && TouchInput.isPressed())) {
                if (!this._holding) this.hold();
                var x = TouchInput.x - this._dx;
                var y = TouchInput.y - this._dy;
                if (Input.isPressed('control')) {
                    var size = paramGridSize;
                    if (size !== 0) {
                        x += (x % size > size / 2 ? size - x % size : -(x % size));
                        y += (y % size > size / 2 ? size - y % size : -(y % size));
                    }
                } else if (!Input.isPressed('shift') && !this.isAnchorChanged()) {
                    x = this.updateSnapX(x);
                    y = this.updateSnapY(y);
                }
                this.position.x = x;
                this.position.y = y;
                this._positionLock = true;
                return true;
            } else if (this._holding) {
                this.release();
                return true;
            }
            return false;
        };

        PIXI.Container.prototype.processFrameChange = function () { };

        Window_Base.prototype.processFrameChange = function () {
            if (this._holding || !TouchInput.isMoved()) return;
            if (this.isPreparedEvent() && !this.parent.isFrameChanged) {
                this._windowFrameSprite.setBlendColor([255, 128, 0, 192]);
                this.parent.isFrameChanged = true;
                SceneManager.setLastWindow(this);
            } else {
                this._windowFrameSprite.setBlendColor([0, 0, 0, 0]);
            }
        };

        PIXI.Container.prototype.processOpacity = function () { };

        Window_Base.prototype.processOpacity = function () {
            if (this.isTouchEvent(TouchInput.isCancelled)) {
                SoundManager.playMiss();
                SceneManager.pushChangeStack(this);
                if (paramRightClickHide) {
                    this.visible = !this.visible;
                } else {
                    this.opacity = (this.opacity === 255 ? 0 : 255);
                }
                this.saveContainerInfo();
                return true;
            }
            return false;
        };

        PIXI.Container.prototype.processInput = function () { };

        Window_Base.prototype.processInput = function () {
            if (this.isPreparedEvent()) {
                var params = [
                    ['num1', '横幅', 'width', 1, 2000, null],
                    ['num2', '高さ', 'height', 1, 2000, null],
                    ['num3', 'パディング', '_customPadding', 1, 100, this.updatePadding.bind(this), true],
                    ['num4', 'フォントサイズ', '_customFontSize', 1, 100, this.resetFontSettings.bind(this), true],
                    ['num5', '行の高さ', '_customLineHeight', 1, 2000, this.setFittingHeight.bind(this), true],
                    ['num6', '背景の透明度', '_customBackOpacity', 0, 255, this.updateBackOpacity.bind(this), true],
                    ['num7', '行数', '_customLineNumber', 0, 999, this.setFittingHeight.bind(this), true],
                    ['num8', '背景画像のファイル名', '_customBackFileName', null, null, this.createBackSprite.bind(this), true],
                    ['num9', 'フォント名', '_customFontFace', null, null, this.resetFontSettings.bind(this), true]
                ];
                return params.some(function (param) {
                    return this.processSetProperty.apply(this, param);
                }.bind(this));
            }
            return false;
        };

        Window_Base.prototype.setFittingHeight = function () {
            if (this._customLineNumber) this.height = this.fittingHeight(this._customLineNumber);
        };

        Window_Base.prototype.processSetProperty = function (keyCode, propLabel, propName, min, max,
            callBack, stringFlg) {
            if (this[propName] === undefined) return null;
            if (Input.isTriggered(keyCode)) {
                var result = window.prompt(propLabel + 'を入力してください。', this[propName].toString());
                if (result || (stringFlg && result === '')) {
                    this._windowFrameSprite.setBlendColor([0, 0, 0, 0]);
                    SceneManager.pushChangeStack(this);
                    this[propName] = stringFlg ? getArgString(result) : getArgEval(result, min, max);
                    if (callBack) callBack();
                    this.reDrawContents();
                    SoundManager.playMagicEvasion();
                    this.saveContainerInfo();
                    this._propLabel = propLabel;
                    this._propValue = this[propName];
                    return true;
                }
            }
            return null;
        };

        Window_Base.prototype.reDrawContents = function () {
            this.createContents();
            this.refresh();
        };

        Window_Selectable.prototype.reDrawContents = function () {
            Window_Base.prototype.reDrawContents.apply(this, arguments);
            this.updateCursor();
        };

        PIXI.Container.prototype.isAnchorChanged = function () {
            return false;
        };

        Sprite.prototype.isAnchorChanged = function () {
            return this.anchor.x !== 0 || this.anchor.y !== 0;
        };

        PIXI.Container.prototype.hold = function () {
            this._holding = true;
            this._dx = TouchInput.x - this.x;
            this._dy = TouchInput.y - this.y;
            SceneManager.pushChangeStack(this);
        };

        Window_Base.prototype.hold = function () {
            PIXI.Container.prototype.hold.call(this);
            this._windowBackSprite.setBlendColor([255, 255, 255, 192]);
            this._windowContentsSprite.setBlendColor([255, 128, 0, 192]);
        };

        Sprite.prototype.hold = function () {
            PIXI.Container.prototype.hold.call(this);
            this.setBlendColor([255, 255, 255, 192]);
        };

        PIXI.Container.prototype.release = function () {
            this._holding = false;
            this.saveContainerInfo();
        };

        Window_Base.prototype.release = function () {
            PIXI.Container.prototype.release.call(this);
            this._windowBackSprite.setBlendColor([0, 0, 0, 0]);
            this._windowContentsSprite.setBlendColor([0, 0, 0, 0]);
        };

        Sprite.prototype.release = function () {
            PIXI.Container.prototype.release.call(this);
            this.setBlendColor([0, 0, 0, 0]);
        };

        PIXI.Container.prototype.updateSnapX = function (x) {
            var minDistanceL = 16, minIndexL = -1, minDistanceR = 16, minIndexR = -1;
            var children = this.parent.children, endX = x + this.width;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                if (child !== this && this.isSameInstance(child) && child.isTouchable() && child.isOverlapY(this)) {
                    var distanceL = Math.abs(x - child.endX);
                    if (minDistanceL > distanceL) {
                        minDistanceL = distanceL;
                        minIndexL = i;
                    }
                    var distanceR = Math.abs(endX - child.x);
                    if (minDistanceR > distanceR) {
                        minDistanceR = distanceR;
                        minIndexR = i;
                    }
                }
            }
            if (minDistanceL > Math.abs(x)) return 0;
            if (minDistanceR > Math.abs(Graphics.boxWidth - endX)) return Graphics.boxWidth - this.width;
            if (minDistanceR > minDistanceL) {
                return minIndexL === -1 ? x : children[minIndexL].endX;
            } else {
                return minIndexR === -1 ? x : children[minIndexR].x - this.width;
            }
        };

        PIXI.Container.prototype.updateSnapY = function (y) {
            var minDistanceU = 16, minIndexU = -1, minDistanceD = 16, minIndexD = -1;
            var children = this.parent.children, endY = y + this.height;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                if (child !== this && this.isSameInstance(child) && child.isTouchable() && child.isOverlapX(this)) {
                    var distanceU = Math.abs(y - child.endY);
                    if (minDistanceU > distanceU) {
                        minDistanceU = distanceU;
                        minIndexU = i;
                    }
                    var distanceD = Math.abs(endY - child.y);
                    if (minDistanceD > distanceD) {
                        minDistanceD = distanceD;
                        minIndexD = i;
                    }
                }
            }
            if (minDistanceU > Math.abs(y)) return 0;
            if (minDistanceD > Math.abs(Graphics.boxHeight - endY)) return Graphics.boxHeight - this.height;
            if (minDistanceD > minDistanceU) {
                return minIndexU === -1 ? y : children[minIndexU].endY;
            } else {
                return minIndexD === -1 ? y : children[minIndexD].y - this.height;
            }
        };

        PIXI.Container.prototype.isSameInstance = function () {
            return false;
        };

        Window_Base.prototype.isSameInstance = function (objectContainer) {
            return objectContainer instanceof Window_Base;
        };

        Sprite.prototype.isSameInstance = function (objectContainer) {
            return objectContainer instanceof Sprite;
        };

        PIXI.Container.prototype.isTouchPosInRect = function () {
            var tx = TouchInput.x;
            var ty = TouchInput.y;
            return (tx >= this.x && tx <= this.endX &&
                ty >= this.y && ty <= this.endY);
        };

        Sprite.prototype.isTouchPosInRect = function () {
            if (this.isTransparent()) return false;
            var dx = TouchInput.x - this.x;
            var dy = TouchInput.y - this.y;
            var sin = Math.sin(-this.rotation);
            var cos = Math.cos(-this.rotation);
            var rx = this.x + Math.floor(dx * cos + dy * -sin);
            var ry = this.y + Math.floor(dx * sin + dy * cos);
            return (rx >= this.minX() && rx <= this.maxX() &&
                ry >= this.minY() && ry <= this.maxY());
        };

        Sprite.prototype.isTransparent = function () {
            var dx = TouchInput.x - this.x;
            var dy = TouchInput.y - this.y;
            var sin = Math.sin(-this.rotation);
            var cos = Math.cos(-this.rotation);
            var bx = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
            var by = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
            return this.bitmap.getAlphaPixel(bx, by) === 0;
        };

        Sprite.prototype.screenWidth = function () {
            return (this.width || 0) * this.scale.x;
        };

        Sprite.prototype.screenHeight = function () {
            return (this.height || 0) * this.scale.y;
        };

        Sprite.prototype.screenX = function () {
            return (this.x || 0) - this.anchor.x * this.screenWidth();
        };

        Sprite.prototype.screenY = function () {
            return (this.y || 0) - this.anchor.y * this.screenHeight();
        };

        Sprite.prototype.minX = function () {
            return Math.min(this.screenX(), this.screenX() + this.screenWidth());
        };

        Sprite.prototype.minY = function () {
            return Math.min(this.screenY(), this.screenY() + this.screenHeight());
        };

        Sprite.prototype.maxX = function () {
            return Math.max(this.screenX(), this.screenX() + this.screenWidth());
        };

        Sprite.prototype.maxY = function () {
            return Math.max(this.screenY(), this.screenY() + this.screenHeight());
        };

        PIXI.Container.prototype.isTouchable = function () {
            return false;
        };

        Window_Base.prototype.isTouchable = function () {
            return (this.opacity > 0 || this.contentsOpacity > 0) && this.visible && this.isOpen();
        };

        Window_BattleLog.prototype.isTouchable = function () {
            return Window.prototype.isTouchable.call(this) && this._lines.length > 0;
        };

        Sprite.prototype.isTouchable = function () {
            return this.visible && this.bitmap != null && this.scale.x !== 0 && this.scale.y !== 0;
        };

        PIXI.Container.prototype.isTouchEvent = function (triggerFunc) {
            return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
        };

        PIXI.Container.prototype.isPreparedEvent = function () {
            return this.isTouchable() && this.isTouchPosInRect();
        };

        PIXI.Container.prototype.isRangeX = function (x) {
            return this.x <= x && this.endX >= x;
        };

        PIXI.Container.prototype.isRangeY = function (y) {
            return this.y <= y && this.endY >= y;
        };

        PIXI.Container.prototype.isOverlapX = function (win) {
            return this.isRangeX(win.x) || this.isRangeX(win.endX) || win.isRangeX(this.x) || win.isRangeX(this.endX);
        };

        PIXI.Container.prototype.isOverlapY = function (win) {
            return this.isRangeY(win.y) || this.isRangeY(win.endY) || win.isRangeY(this.y) || win.isRangeY(this.endY);
        };

        Object.defineProperty(PIXI.Container.prototype, 'endX', {
            get: function () {
                return this.x + this.width;
            },
            set: function (value) {
                this.x = value - this.width;
            },

            configurable: true
        });

        Object.defineProperty(PIXI.Container.prototype, 'endY', {
            get: function () {
                return this.y + this.height;
            },
            set: function (value) {
                this.y = value - this.height;
            },

            configurable: true
        });

        //=============================================================================
        //  Window_Selectable
        //   通常のタッチ操作を無効化します。
        //=============================================================================
        Window_Selectable.prototype.processTouch = function () { };
        Window_BattleActor.prototype.processTouch = function () { };
        Window_BattleEnemy.prototype.processTouch = function () { };
    }

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (paramThroughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function (window) { };

        WindowLayer.prototype._canvasClearWindowRect = function (renderSession, window) { };
    }

    if (paramFakeMobile) {
        Utils.isMobileDevice = function () {
            return true;
        };
    }

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandGraphicalDesignMode(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandGraphicalDesignMode = function (command) {
        switch (getCommandName(command)) {
            case '解除_メッセージウィンドウ':
            case '_UNLOCK_MESSAGE_WINDOW':
                SceneManager._scene._messageWindow.unlockPosition();
                break;
            case '固定_メッセージウィンドウ':
            case '_LOCK_MESSAGE_WINDOW':
                var win = SceneManager._scene._messageWindow;
                if (win.isClosing()) {
                    win.setCloseListener(win.lockPosition)
                } else {
                    win.lockPosition();
                }
                break;
            case '解除_選択肢ウィンドウ':
            case '_UNLOCK_CHOICE_WINDOW':
                SceneManager._scene._messageWindow._choiceWindow.unlockPosition();
                break;
            case '固定_選択肢ウィンドウ':
            case '_LOCK_CHOICE_WINDOW':
                var win = SceneManager._scene._messageWindow._choiceWindow;
                if (win.isClosing()) {
                    win.setCloseListener(win.lockPosition)
                } else {
                    win.lockPosition();
                }
                break;
        }
    };

    //=============================================================================
    // DataManager
    //  ContainerProperties.jsonの読み込み処理を追記します。
    //=============================================================================
    DataManager._databaseFileCp = { name: '$dataContainerProperties', src: 'ContainerProperties.json' };
    if (paramMobileMake && Utils.isMobileDevice()) {
        DataManager._databaseFileCp.src = 'ContainerPropertiesMobile.json';
    }

    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        _DataManager_loadDatabase.apply(this, arguments);
        var errorMessage = this._databaseFileCp.src + 'が見付かりませんでした。';
        this.loadDataFileAllowError(this._databaseFileCp.name, this._databaseFileCp.src, errorMessage);
    };

    DataManager.loadDataFileAllowError = function (name, src, errorMessage) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            } else {
                DataManager.onDataFileNotFound(name, errorMessage);
            }
        };
        xhr.onerror = function () {
            DataManager.onDataFileNotFound(name, errorMessage);
        };
        window[name] = null;
        xhr.send();
    };

    DataManager.onDataFileNotFound = function (name, errorMessage) {
        window[name] = {};
        console.warn(errorMessage);
    };

    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        return _DataManager_isDatabaseLoaded.apply(this, arguments) && window[this._databaseFileCp.name];
    };

    //=============================================================================
    // SceneManager
    //  現在のシーン名を返します。
    //=============================================================================
    SceneManager.getSceneName = function () {
        return getClassName(this._scene);
    };

    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function () {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene) {
            this._scene.updateCustomContainer();
        }
    };

    //=============================================================================
    // Scene_Base
    //  ウィンドウ追加時に位置をロードします。
    //=============================================================================
    var _Scene_Base_addWindow = Scene_Base.prototype.addWindow;
    Scene_Base.prototype.addWindow = function (child) {
        _Scene_Base_addWindow.apply(this, arguments);
        child.loadContainerInfo();
    };

    var _Scene_Base_addChild = Scene_Base.prototype.addChild;
    Scene_Base.prototype.addChild = function (child) {
        _Scene_Base_addChild.apply(this, arguments);
        child.loadContainerInfo();
    };

    var _Scene_Base_createWindowLayer2 = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function () {
        this.createCustomPicture();
        _Scene_Base_createWindowLayer2.apply(this, arguments);
        this.createCustomWindow();
    };

    Scene_Base.prototype.createCustomPicture = function () {
        var setting = settings[getClassName(this)];
        if (setting) {
            var pictures = setting.pictures;
            this._customPictures = [];
            if (pictures) {
                pictures.forEach(function (picture) {
                    if (!picture.file) return;
                    var sprite = new Sprite();
                    sprite.bitmap = ImageManager.loadPicture(picture.file, 0);
                    this._customPictures.push(sprite);
                    this.addChild(sprite);
                    sprite.switchId = picture.switchId || 0;
                }.bind(this));
            }
        }
    };

    Scene_Base.prototype.createCustomWindow = function () {
        var setting = settings[getClassName(this)];
        if (setting) {
            var windows = setting.windows;
            this._customWindows = [];
            if (windows) {
                windows.forEach(function (windowItem) {
                    if (!windowItem.lines || windowItem.lines.length < 1) return;
                    var win = new Window_Custom(windowItem.lines);
                    this._customWindows.push(win);
                    win.switchId = windowItem.switchId || 0;
                }.bind(this));
            }
            this.updateCustomWindowVisible();
        }
    };

    Scene_Base.prototype.updateCustomContainer = function () {
        if (this._customPictures) {
            this.updateCustomPicture();
        }
        if (this._customWindows) {
            this.updateCustomWindow();
        }
    };

    Scene_Base.prototype.updateCustomPicture = function () {
        this._customPictures.forEach(function (picture) {
            if (picture.switchId > 0) {
                picture.visible = $gameSwitches.value(picture.switchId);
            }
        });
    };

    Scene_Base.prototype.updateCustomWindow = function () {
        this.updateCustomWindowVisible();
        if (!this._windowAdd) {
            this._customWindows.forEach(function (windowItem) {
                this.addWindow(windowItem);
            }, this);
            this._windowAdd = true;
        }
    };

    Scene_Base.prototype.updateCustomWindowVisible = function () {
        this._customWindows.forEach(function (windowItem) {
            if (windowItem.switchId > 0) {
                if ($gameSwitches.value(windowItem.switchId)) {
                    windowItem.show();
                } else {
                    windowItem.hide();
                }
            }
        }, this);
    };

    //=============================================================================
    // PIXI.Container
    //  表示位置のセーブとロードを行います。
    //=============================================================================
    Object.defineProperty(PIXI.Container.prototype, 'x', {
        get: function () {
            return this.position.x;
        },
        set: function (value) {
            if (this._positionLock) return;
            this.position.x = value;
        }
    });

    Object.defineProperty(PIXI.Container.prototype, 'y', {
        get: function () {
            return this.position.y;
        },
        set: function (value) {
            if (this._positionLock) return;
            this.position.y = value;
        }
    });

    PIXI.Container.prototype.loadContainerInfo = function () {
        var sceneName = SceneManager.getSceneName();
        var parentName = getClassName(this.parent);
        var sceneInfo = $dataContainerProperties[sceneName];
        if (sceneInfo) {
            var containerInfo = sceneInfo[parentName];
            var key = [this.parent.getChildIndex(this), getClassName(this)];
            if (containerInfo && containerInfo[key]) {
                this.loadProperty(containerInfo[key]);
                this._positionLock = true;
            }
        }
    };

    PIXI.Container.prototype.unlockPosition = function () {
        this._positionLock = false;
        this._customPositionX = this.position.x;
        this._customPositionY = this.position.y;
    };

    PIXI.Container.prototype.lockPosition = function () {
        this._positionLock = true;
        if (this._customPositionX) {
            this.position.x = this._customPositionX;
        }
        if (this._customPositionY) {
            this.position.y = this._customPositionY;
        }
    };

    PIXI.Container.prototype.loadProperty = function (containerInfo) {
        this.position.x = containerInfo.x;
        this.position.y = containerInfo.y;
    };

    Window_Base.prototype.loadProperty = function (containerInfo) {
        PIXI.Container.prototype.loadProperty.apply(this, arguments);
        this.width = containerInfo.width;
        this.height = containerInfo.height;
        this.opacity = containerInfo.opacity;
        this.visible = this.visible && !containerInfo.hidden;
        this._customFontSize = containerInfo._customFontSize;
        this._customPadding = containerInfo._customPadding;
        this._customLineHeight = containerInfo._customLineHeight;
        this._customBackOpacity = containerInfo._customBackOpacity;
        this._customBackFileName = containerInfo._customBackFileName;
        this._customFontFace = containerInfo._customFontFace;
        this.updatePadding();
        this.resetFontSettings();
        this.updateBackOpacity();
        this.createContents();
        this.refresh();
        this.createBackSprite();
    };

    Window_Base.prototype.refresh = function () { };

    Window_Selectable.prototype.loadProperty = function (containerInfo) {
        Window_Base.prototype.loadProperty.apply(this, arguments);
        this.updateCursor();
    };

    PIXI.Container.prototype.saveContainerInfo = function () {
        var sceneName = SceneManager.getSceneName();
        var parentName = getClassName(this.parent);
        if (!$dataContainerProperties[sceneName]) $dataContainerProperties[sceneName] = {};
        var sceneInfo = $dataContainerProperties[sceneName];
        if (!sceneInfo[parentName]) sceneInfo[parentName] = {};
        var containerInfo = sceneInfo[parentName];
        var key = [this.parent.getChildIndex(this), getClassName(this)];
        if (!containerInfo[key]) containerInfo[key] = {};
        this.saveProperty(containerInfo[key]);
        if (paramAutoSave) {
            DataManager.saveDataFileWp();
        }
    };

    PIXI.Container.prototype.saveProperty = function (containerInfo) {
        containerInfo.x = this.x;
        containerInfo.y = this.y;
    };

    Window_Base.prototype.saveProperty = function (containerInfo) {
        PIXI.Container.prototype.saveProperty.apply(this, arguments);
        containerInfo.width = this.width;
        containerInfo.height = this.height;
        containerInfo.opacity = this.opacity;
        containerInfo.hidden = !this.visible;
        containerInfo._customFontSize = this._customFontSize;
        containerInfo._customPadding = this._customPadding;
        containerInfo._customLineHeight = this._customLineHeight;
        containerInfo._customBackOpacity = this._customBackOpacity;
        containerInfo._customBackFileName = this._customBackFileName;
        containerInfo._customFontFace = this._customFontFace;
    };

    //=============================================================================
    // Window_Base
    //  プロパティの値をカスタマイズします。
    //=============================================================================
    var _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function (x, y, width, height) {
        _Window_Base_initialize.apply(this, arguments);
        this._customFontSize = this.standardFontSize();
        this._customPadding = this.standardPadding();
        this._customLineHeight = this.lineHeight();
        this._customLineNumber = 0;
        this._customBackOpacity = this.standardBackOpacity();
        this._customBackSprite = null;
        this._customBackFileName = '';
        this._customFontFace = '';
    };

    Window_Base.prototype.createBackSprite = function () {
        if (this._customBackFileName) {
            if (!this._customBackSprite) {
                this._customBackSprite = new Sprite();
                this.addChildToBack(this._customBackSprite);
            }
            this._customBackSprite.bitmap = ImageManager.loadPicture(this._customBackFileName, 0);
        } else if (this._customBackSprite) {
            this.removeChild(this._customBackSprite);
            this._customBackSprite = null;
        }
        if (Utils.isDesignMode() && this._customBackSprite && this._customBackSprite.bitmap) {
            var bitmap = this._customBackSprite.bitmap;
            bitmap._image.onerror = function () {
                this._customBackFileName = '';
                this._customBackSprite.bitmap._isLoading = false;
                this._customBackSprite.bitmap = null;
                this._customBackSprite = null;
                SceneManager.popChangeStack();
                SceneManager.setInfoExtend('ファイルが見付からなかったので、左記の番号の変更を戻しました。', -1);
            }.bind(this);
        }
    };

    var _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function (x, y, width, height) {
        _Window_Selectable_initialize.apply(this, arguments);
        this._customLineNumber = this.maxRows();
    };

    var _Window_Base_standardFontFace = Window_Base.prototype.standardFontFace;
    Window_Base.prototype.standardFontFace = function () {
        return this._customFontFace ? this._customFontFace : _Window_Base_standardFontFace.apply(this, arguments);
    };

    var _Window_Base_standardFontSize = Window_Base.prototype.standardFontSize;
    Window_Base.prototype.standardFontSize = function () {
        return this._customFontSize ? eval(this._customFontSize) :
            paramFontSize ? paramFontSize : _Window_Base_standardFontSize.apply(this, arguments);
    };

    var _Window_Base_standardPadding = Window_Base.prototype.standardPadding;
    Window_Base.prototype.standardPadding = function () {
        return this._customPadding ? eval(this._customPadding) :
            paramPadding ? paramPadding : _Window_Base_standardPadding.apply(this, arguments);
    };

    var _Window_Base_lineHeight = Window_Base.prototype.lineHeight;
    Window_Base.prototype.lineHeight = function () {
        return this._customLineHeight ? eval(this._customLineHeight) :
            paramLineHeight ? paramLineHeight : _Window_Base_lineHeight.apply(this, arguments);
    };

    var _Window_Base_standardBackOpacity = Window_Base.prototype.standardBackOpacity;
    Window_Base.prototype.standardBackOpacity = function () {
        return this._customBackOpacity ? eval(this._customBackOpacity) :
            paramBackOpacity ? paramBackOpacity : _Window_Base_standardBackOpacity.apply(this, arguments);
    };

    Window_Base._iconSrcWidth = Window_Base._iconWidth;
    Window_Base._iconSrcHeight = Window_Base._iconHeight;

    Window_Base.prototype.getIconScale = function () {
        var defaultFontSize = _Window_Base_standardFontSize.apply(this, arguments);
        var fontSize = this.contents.fontSize;
        return paramIconSizeScale && defaultFontSize !== fontSize ? fontSize / defaultFontSize : null;
    };

    Window_Base.prototype.changeIconSize = function () {
        var iconScale = this.getIconScale();
        if (iconScale) {
            Window_Base._iconWidth *= iconScale;
            Window_Base._iconHeight *= iconScale;
        }
    };

    Window_Base.prototype.restoreIconSize = function () {
        var iconScale = this.getIconScale();
        if (iconScale) {
            Window_Base._iconWidth = Window_Base._iconSrcWidth;
            Window_Base._iconHeight = Window_Base._iconSrcHeight;
        }
    };

    var _Window_Base_drawActorIcons = Window_Base.prototype.drawActorIcons;
    Window_Base.prototype.drawActorIcons = function (actor, x, y, width) {
        this.changeIconSize();
        _Window_Base_drawActorIcons.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_drawItemName = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function (item, x, y, width) {
        this.changeIconSize();
        _Window_Base_drawItemName.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_processDrawIcon = Window_Base.prototype.processDrawIcon;
    Window_Base.prototype.processDrawIcon = function (iconIndex, textState) {
        this.changeIconSize();
        _Window_Base_processDrawIcon.apply(this, arguments);
        this.restoreIconSize();
    };

    var _Window_Base_drawIcon = Window_Base.prototype.drawIcon;
    Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
        var iconScale = this.getIconScale();
        if (iconScale) {
            var bitmap = ImageManager.loadSystem('IconSet');
            var pw = Window_Base._iconSrcWidth;
            var ph = Window_Base._iconSrcHeight;
            var sx = iconIndex % 16 * pw;
            var sy = Math.floor(iconIndex / 16) * ph;
            var dw = Math.floor(pw * iconScale);
            var dh = Math.floor(ph * iconScale);
            var dx = x;
            var dy = y + (this.lineHeight() - dh) / 2 - 2;
            this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, dw, dh);
        } else {
            _Window_Base_drawIcon.apply(this, arguments);
        }
    };

    var _Window_Base_setBackgroundType = Window_Base.prototype.setBackgroundType;
    Window_Base.prototype.setBackgroundType = function (type) {
        if (!paramBackgroundFixed) {
            _Window_Base_setBackgroundType.apply(this, arguments);
        }
    };

    var _Window_Base_updateClose = Window_Base.prototype.updateClose;
    Window_Base.prototype.updateClose = function () {
        var prevClose = this.isClosing();
        _Window_Base_updateClose.apply(this, arguments);
        if (this._callBack && prevClose && !this.isClosing()) {
            this._callBack();
            this._callBack = null;
        }
    };

    Window_Base.prototype.setCloseListener = function (callBack) {
        this._callBack = callBack;
    };

    // for RPG MV 1.6.1
    var _Window_EquipItem_refresh = Window_EquipItem.prototype.refresh;
    Window_EquipItem.prototype.refresh = function () {
        if (!this._actor) {
            return;
        }
        _Window_EquipItem_refresh.apply(this, arguments);
    };

    /**
     * Window_Custom
     * 任意配置可能なウィンドウです。
     * @constructor
     */
    function Window_Custom() {
        this.initialize.apply(this, arguments);
    }

    Window_Custom._textAligns = {
        'left': 0,
        '0': 0,
        'center': 1,
        '1': 1,
        'right': 2,
        '2': 2
    };

    Window_Custom.prototype = Object.create(Window_Selectable.prototype);
    Window_Custom.prototype.constructor = Window_Custom;

    Window_Custom.prototype.initialize = function (lines) {
        this._lines = lines || [];
        Window_Selectable.prototype.initialize.call(this, 0, 0, 320, this.fittingHeight(this._lines.length));
        this.refresh();
    };

    Window_Custom.prototype.refresh = function () {
        this.createContents();
        Window_Selectable.prototype.refresh.apply(this, arguments);
    };

    Window_Custom.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        var text = this._lines[index];
        this.resetTextColor();
        text = this.changeTextAlign(text);
        if (this._textAlign > 0) {
            rect.x = this.getTextAlignStartX(text);
        }
        this.drawTextEx(text, rect.x, rect.y);
    };

    Window_Custom.prototype.getTextAlignStartX = function (text) {
        var width = this.drawTextEx(text, this.contentsWidth(), 0);
        if (this._textAlign === 1) {
            return this.contentsWidth() / 2 - width / 2;
        } else {
            return this.contentsWidth() - width;
        }
    };

    Window_Custom.prototype.maxItems = function () {
        return this._lines.length;
    };

    Window_Custom.prototype.changeTextAlign = function (text) {
        this._textAlign = 0;
        text = text.replace(/\\al\[(.*)]/gi, function () {
            this._textAlign = Window_Custom._textAligns[arguments[1].toLowerCase()] || 0;
            return '';
        }.bind(this));
        return text;
    };
})();
