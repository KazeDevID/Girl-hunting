//=============================================================================
// RecollectionMode.js
// Copyright (c) 2015 rinne_grid
// This plugin is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//
// Version
// 1.0.0 2015/12/26 公開
// 1.1.0 2016/04/19 回想一覧にサムネイルを指定できるように対応
// 1.1.1 2016/05/03 セーブデータ20番目のスイッチが反映されない不具合を修正
//                  セーブデータ間のスイッチ共有オプション
//                  (share_recollection_switches)を追加
// 1.1.2 2016/05/09 回想用のCGリストのキーを数字から文字列に変更
// 1.1.3 2016/11/23 セーブデータが増えた場合にロード時間が長くなる問題を解消
// 1.1.4 2016/12/23 CG閲覧時にクリック・タップで画像送りができるよう対応
// 1.1.5 2017/01/26 CG・シーンで一部サムネイルが表示されない問題を解消
//=============================================================================

/*:ja
 * @plugindesc 回想モード機能を追加します。
 * @author rinne_grid
 *
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 */

//-----------------------------------------------------------------------------
// ◆ プラグイン設定
//-----------------------------------------------------------------------------
var rngd_recollection_mode_settings = {};

function rngd_hash_size(obj) {
    var cnt = 0;
    for (var o in obj) {
        cnt++;
    }
    return cnt;
}

//-----------------------------------------------------------------------------
// ◆ Scene関数
//-----------------------------------------------------------------------------

//=========================================================================
// ■ Scene_Recollection
//=========================================================================
// 回想用のシーン関数です
//=========================================================================
function Scene_Recollection() {
    this.initialize.apply(this, arguments);
}

Scene_Recollection.prototype = Object.create(Scene_Base.prototype);
Scene_Recollection.prototype.constructor = Scene_Recollection;

Scene_Recollection.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Recollection.prototype.create = function () {
    // Scene_Base.prototype.create.call(this);
    // this.createWindowLayer();
    this.createCommandWindow();
};

// 回想モードのカーソル
Scene_Recollection.rec_list_index = 0;

// 回想モードの再読み込み判定用 true: コマンドウィンドウを表示せず回想リストを表示 false:コマンドウィンドウを表示
Scene_Recollection.reload_rec_list = false;

Scene_Recollection.prototype.createCommandWindow = function () {

    if (Scene_Recollection.reload_rec_list) {
        // 回想モード選択ウィンドウ
        this._rec_window = new Window_RecollectionCommand();
        this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
//        this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
        this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));

        // リロードの場合：選択ウィンドウを非表示にする
        this._rec_window.visible = false;
        this._rec_window.deactivate();
        this.addWindow(this._rec_window);

        // 回想リスト
        this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);

        // リロードの場合：回想リストを表示にする
        this._rec_list.visible = true;
        this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
        this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
        this._mode = "recollection";
        this._rec_list.activate();
        this._rec_list.select(Scene_Recollection.rec_list_index);

        this.addWindow(this._rec_list);

        // CG参照用ダミーコマンド
        this._dummy_window = new Window_Command(0, 0);
        this._dummy_window.deactivate();
        this._dummy_window.visible = false;
        this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
        this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
        this._dummy_window.addCommand('next', 'ok');
        this.addWindow(this._dummy_window);

        Scene_Recollection.reload_rec_list = false;

    } else {
        // 回想モード選択ウィンドウ
        this._rec_window = new Window_RecollectionCommand();
        this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
//        this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
        this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));
        this.addWindow(this._rec_window);

        // 回想リスト
        this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);
        this._rec_list.visible = false;
        this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
        this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
        this._rec_list.select(Scene_Recollection.rec_list_index);
        this.addWindow(this._rec_list);

        // CG参照用ダミーコマンド
        this._dummy_window = new Window_Command(0, 0);
        this._dummy_window.deactivate();
        this._dummy_window.playOkSound = function () { }; // CGﾓｰﾄﾞの場合、OK音を鳴らさない
        this._dummy_window.visible = false;
        this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
        this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
        this._dummy_window.addCommand('next', 'ok');
        this.addWindow(this._dummy_window);
    }
    this._rec_window.setHandler('cancel', this.commandBackTitle.bind(this));

};

//-------------------------------------------------------------------------
// ● 開始処理
//-------------------------------------------------------------------------
Scene_Recollection.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    this._rec_window.refresh();
    this._rec_list.refresh();
    AudioManager.playBgm(rngd_recollection_mode_settings.rec_mode_bgm.bgm);
    Scene_Recollection._rngd_recollection_doing = false;
};

//-------------------------------------------------------------------------
// ● 更新処理
//-------------------------------------------------------------------------
Scene_Recollection.prototype.update = function () {
    Scene_Base.prototype.update.call(this);

};

//-------------------------------------------------------------------------
// ● 「回想を見る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandShowRecollection = function () {
    // モードウィンドウの無効化とリストウィンドウの有効化
    this.do_exchange_status_window(this._rec_window, this._rec_list);
    this._mode = "recollection";
};

//-------------------------------------------------------------------------
// ● 「CGを見る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandShowCg = function () {
    this.do_exchange_status_window(this._rec_window, this._rec_list);
    this._mode = "cg";
};

//-------------------------------------------------------------------------
// ● 「タイトルに戻る」を選択した際のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandBackTitle = function () {
    Scene_Recollection.rec_list_index = 0;
    SceneManager.goto(Scene_Title);
};

//-------------------------------------------------------------------------
// ● 回想orCGモードから「キャンセル」して前の画面に戻った場合のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandBackSelectMode = function () {
    this.do_exchange_status_window(this._rec_list, this._rec_window);
};

//-------------------------------------------------------------------------
// ● 回想orCGモードにおいて、実際の回想orCGを選択した場合のコマンド
//-------------------------------------------------------------------------
Scene_Recollection.prototype.commandDoRecMode = function () {
    var target_index = this._rec_list.index() + 1;
    Scene_Recollection.rec_list_index = target_index - 1;

    if (this._rec_list.is_valid_picture(this._rec_list.index() + 1)) {
        // 回想モードの場合
        if (this._mode == "recollection") {
            Scene_Recollection._rngd_recollection_doing = true;

            DataManager.setupNewGame();
            $gamePlayer.setTransparent(255);
            this.fadeOutAll();
            // TODO: パーティを透明状態にする

            //$dataSystem.optTransparent = false;
            $gameTemp.reserveCommonEvent(rngd_recollection_mode_settings.rec_cg_set[target_index]["common_event_id"]);
            $gamePlayer.reserveTransfer(rngd_recollection_mode_settings.sandbox_map_id, 0, 0, 0);
            SceneManager.push(Scene_Map);

            // CGモードの場合
        } else if (this._mode == "cg") {
            this._cg_sprites = [];
            this._cg_sprites_index = 0;

            // シーン画像をロードする
            rngd_recollection_mode_settings.rec_cg_set[target_index].pictures.forEach(function (name) {
                // CGクリックを可能とする
                var sp = new Sprite_Button();
                sp.setClickHandler(this.commandDummyOk.bind(this));
                sp.processTouch = function () {
                    Sprite_Button.prototype.processTouch.call(this);

                };
                sp.bitmap = ImageManager.loadPicture(name);
                // 最初のSprite以外は見えないようにする
                if (this._cg_sprites.length > 0) {
                    sp.visible = false;
                }

                // TODO: 画面サイズにあわせて、拡大・縮小すべき
                this._cg_sprites.push(sp);
                this.addChild(sp);

            }, this);

            this.do_exchange_status_window(this._rec_list, this._dummy_window);
            this._dummy_window.visible = false;
        }
    } else {
        this._rec_list.activate();
    }
};

Scene_Recollection.prototype.commandDummyOk = function () {

    if (this._cg_sprites_index < this._cg_sprites.length - 1) {
        this._cg_sprites[this._cg_sprites_index].visible = false;
        this._cg_sprites_index++;
        this._cg_sprites[this._cg_sprites_index].visible = true;
        SoundManager.playOk();

        this._dummy_window.activate();
    } else {
        SoundManager.playOk();
        this.commandDummyCancel();
    }
};

Scene_Recollection.prototype.commandDummyCancel = function () {
    this._cg_sprites.forEach(function (obj) {
        obj.visible = false;
        obj = null;
    });
    this.do_exchange_status_window(this._dummy_window, this._rec_list);
};

// コモンイベントから呼び出す関数
Scene_Recollection.prototype.rngd_exit_scene = function () {
    if (Scene_Recollection._rngd_recollection_doing) {
        // Window_RecListを表示する
        Scene_Recollection.reload_rec_list = true;
        SceneManager.push(Scene_Recollection);
    }
};

//-------------------------------------------------------------------------
// ● ウィンドウの無効化と有効化
//-------------------------------------------------------------------------
// win1: 無効化するウィンドウ
// win2: 有効化するウィンドウ
//-------------------------------------------------------------------------
Scene_Recollection.prototype.do_exchange_status_window = function (win1, win2) {
    win1.deactivate();
    win1.visible = false;
    win2.activate();
    win2.visible = true;
};
//-------------------------------------------------------------------------
// ● セーブ・ロード・ニューゲーム時に必要なスイッチをONにする
//-------------------------------------------------------------------------
Scene_Recollection.setRecollectionSwitches = function () {
    // 各セーブデータを参照し、RecollectionMode用のスイッチを検索する
    // スイッチが一つでもONになっている場合は回想をONにする
    for (var i = 1; i <= DataManager.maxSavefiles(); i++) {
        var data = null;
        try {
            data = StorageManager.loadFromLocalFile(i);
        } catch (e) {
            data = StorageManager.loadFromWebStorage(i);
        }
        if (data) {
            var save_data_obj = JsonEx.parse(data);
            var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

            for (var j = 0; j < rec_cg_max; j++) {
                var cg = rngd_recollection_mode_settings.rec_cg_set[j + 1];
                if (save_data_obj["switches"]._data[cg.switch_id] &&
                    save_data_obj["switches"]._data[cg.switch_id] == true) {
                    $gameSwitches.setValue(cg.switch_id, true);
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
// ◆ Window関数
//-----------------------------------------------------------------------------

//=========================================================================
// ■ Window_RecollectionCommand
//=========================================================================
// 回想モードかCGモードを選択するウィンドウです
//=========================================================================
function Window_RecollectionCommand() {
    this.initialize.apply(this, arguments);
}

Window_RecollectionCommand.prototype = Object.create(Window_Command.prototype);
Window_RecollectionCommand.prototype.constructor = Window_RecollectionCommand;

Window_RecollectionCommand.prototype.initialize = function () {	
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.x = rngd_recollection_mode_settings.rec_mode_window.x;
    this.y = rngd_recollection_mode_settings.rec_mode_window.y;
	this.setBackgroundType(2);	
};

Window_RecollectionCommand.prototype.makeCommandList = function () {
    Window_Command.prototype.makeCommandList.call(this);
    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_recollection, "select_recollection");
//    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_cg, "select_cg");
    this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_back_title, "select_back_title");
};

//=========================================================================
// ■ Window_RecollectionList
//=========================================================================
// 回想またはCGを選択するウィンドウです
//=========================================================================
function Window_RecList() {
    this.initialize.apply(this, arguments);
}

Window_RecList.prototype = Object.create(Window_Selectable.prototype);
Window_RecList.prototype.constructor = Window_RecList;

//-------------------------------------------------------------------------
// ● 初期化処理
//-------------------------------------------------------------------------
Window_RecList.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.windowWidth = width;
    this.windowHeight = height;
    this.select(0);
    this._formationMode = false;
	this.setBackgroundType(2);	
    this.get_global_variables();
    this.refresh();

};

Window_RecList.prototype.maxItems = function () {
    return rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);
};

Window_RecList.prototype.itemHeight = function () {
    return (this.height - this.standardPadding()) / rngd_recollection_mode_settings.rec_list_window.item_height;
};

Window_RecList.prototype.maxPageItems = function () {
    return rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);
};

Window_RecList.prototype.maxCols = function () {
    return rngd_recollection_mode_settings.rec_list_window.item_width;
};

Window_RecList.prototype.maxPageRows = function () {
    var pageHeight = this.height;// - this.padding * 2;
    return Math.floor(pageHeight / this.itemHeight());
};

Window_RecList.prototype.drawItem = function (index) {
    var rec_cg = rngd_recollection_mode_settings.rec_cg_set[index + 1];
    var rect = this.itemRect(index);
    var text_height = 0;
    if (rngd_recollection_mode_settings.rec_list_window.show_title_text) {
        if (this._global_variables["switches"][rec_cg.switch_id]) {
            this.contents.drawText(" " + (typeof rec_cg.title[0] == "number" ? $gameActors.actor(rec_cg.title[0])._name : "") + rec_cg.title[1], rect.x - 1, rect.y + 4, this.itemWidth(), 26,
                rngd_recollection_mode_settings.rec_list_window.title_text_align);
        } else {
            this.contents.drawText(rngd_recollection_mode_settings.rec_list_window.never_watch_title_text,
                rect.x - 1, rect.y + 4, this.itemWidth(), 26,
                rngd_recollection_mode_settings.rec_list_window.title_text_align);
        }
        text_height = 30;
    }

    // CGセットのスイッチ番号が、全てのセーブデータを走査した後にTrueであればピクチャ表示
    if (this._global_variables["switches"][rec_cg.switch_id]) {

        var thumbnail_file_name = rec_cg.pictures[0];
        if (rec_cg.thumbnail !== undefined && rec_cg.thumbnail !== null) {
            thumbnail_file_name = rec_cg.thumbnail;
        }

        this.drawRecollection(thumbnail_file_name, 0, 0,
            this.itemWidth() - 0, this.itemHeight() - 0 - text_height, rect.x + 8, rect.y + 4 + text_height);


    } else {
        this.drawRecollection(rngd_recollection_mode_settings.rec_list_window.never_watch_picture_name,
            0, 0, this.itemWidth() - 0,
            this.itemHeight() - 0 - text_height, rect.x + 8, rect.y + 4 + text_height);

    }

};

//-------------------------------------------------------------------------
// ● 全てのセーブデータを走査し、対象のシーンスイッチ情報を取得する
//-------------------------------------------------------------------------
Window_RecList.prototype.get_global_variables = function () {
    this._global_variables = {
        "switches": {}
    };
    var maxSaveFiles = DataManager.maxSavefiles();
    for (var i = 1; i <= maxSaveFiles; i++) {
        if (DataManager.loadGameSwitch(i)) {
            var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

            for (var j = 0; j < rec_cg_max; j++) {
                var cg = rngd_recollection_mode_settings.rec_cg_set[j + 1];
                if ($gameSwitches._data[cg.switch_id]) {
                    this._global_variables["switches"][cg.switch_id] = true;
                }
            }
        }
    }
};
//-------------------------------------------------------------------------
// ● index番目に表示された回想orCGが有効かどうか判断する
//-------------------------------------------------------------------------
Window_RecList.prototype.is_valid_picture = function (index) {
    // CG情報の取得と対象スイッチの取得
    var _rec_cg_obj = rngd_recollection_mode_settings.rec_cg_set[index];
    return (this._global_variables["switches"][_rec_cg_obj.switch_id] == true);

};


(function () {

    //-----------------------------------------------------------------------------
    // ◆ 組み込み関数Fix
    //-----------------------------------------------------------------------------

    Window_Base.prototype.drawRecollection = function (bmp_name, x, y, width, height, dx, dy) {
        var bmp = ImageManager.loadPicture(bmp_name);

        var _width = width;
        var _height = height;
        if (_width > bmp.width) {
            _width = bmp.width - 1;
        }

        if (_height > bmp.height) {
            _height = bmp.height - 1;
        }
        this.contents.blt(bmp, x, y, _width, _height, dx, dy);
    };

    var Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function () {
        Window_TitleCommand_makeCommandList.call(this);
        this.clearCommandList();
        this.addCommand(TextManager.newGame, 'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(TextManager.options, 'options');
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.recollection_title, 'recollection');
    };

    Scene_Title.prototype.commandRecollection = function () {
        SceneManager.push(Scene_Recollection);
    };

    var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    // セーブデータ共有オプションが指定されている場合のみ、カスタマイズ
    if (rngd_recollection_mode_settings["share_recollection_switches"]) {
        DataManager.makeSaveContents = function () {
            // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.

            Scene_Recollection.setRecollectionSwitches();

            var contents = {};
            contents.system = $gameSystem;
            contents.screen = $gameScreen;
            contents.timer = $gameTimer;
            contents.switches = $gameSwitches;
            contents.variables = $gameVariables;
            contents.selfSwitches = $gameSelfSwitches;
            contents.actors = $gameActors;
            contents.party = $gameParty;
            contents.map = $gameMap;
            contents.player = $gamePlayer;

            return contents;
        };

        DataManager.extractSaveContents = function (contents) {
            $gameSystem = contents.system;
            $gameScreen = contents.screen;
            $gameTimer = contents.timer;
            $gameSwitches = contents.switches;
            $gameVariables = contents.variables;
            $gameSelfSwitches = contents.selfSwitches;
            $gameActors = contents.actors;
            $gameParty = contents.party;
            $gameMap = contents.map;
            $gamePlayer = contents.player;

            Scene_Recollection.setRecollectionSwitches();
        };

        DataManager.setupNewGame = function () {
            this.createGameObjects();
            Scene_Recollection.setRecollectionSwitches();
            this.selectSavefileForNewGame();
            $gameParty.setupStartingMembers();
            $gamePlayer.reserveTransfer($dataSystem.startMapId,
                $dataSystem.startX, $dataSystem.startY);
            Graphics.frameCount = 0;
        };
    }

    //-----------------------------------------------------------------------------
    // ◆ DataManager関数
    //-----------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // ● スイッチのみロードする
    //-------------------------------------------------------------------------
    DataManager.loadGameSwitch = function (savefileId) {
        try {
            return this.loadGameSwitchWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    DataManager.loadGameSwitchWithoutRescue = function (savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            this.createGameObjectSwitch();
            this.extractSaveContentsSwitches(JsonEx.parse(json));
            //this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };

    DataManager.createGameObjectSwitch = function () {
        $gameSwitches = new Game_Switches();
    };

    DataManager.extractSaveContentsSwitches = function (contents) {
        $gameSwitches = contents.switches;
    };

})();