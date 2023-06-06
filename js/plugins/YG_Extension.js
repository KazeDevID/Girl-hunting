//"use strict"
Imported.YG_Extension = true;
/*:
 * @author Yeehaw Games
 * @plugindesc Made by Yeehaw Games
 * @help If you have any questions or problems, feel free to contact me on
 * https://www.patreon.com/Yeehaw
 *
 * @help
 * 1. yg.function.autoSave() - для автоматического сохранения используется значение
 * из переменной DataManager.maxSavefiles задается, в т.ч., в настройках плагина
 * YEP_SaveCore.js. Для активации вызовите функцию yg.function.autoSave() в
 * произвольном месте любого ивента.
 *
 * @param Public functions ---------
 * @default
 *
 * @param yg.function.autoSave()
 * @parent --- Public functions -----
 * @desc Функция автоматического сохранения
 * @default function does not need parameters
 *
 * @param
 * @default
 * @param Scene Title --------------
 * @default
 *
 * @param Command Start Position
 * @desc Стартовая позиция для отрисовки пунктов меню
 * @type number
 * @default 300
 *
 * @param Command Interval
 * @desc Интервал между пунктами меню (from X to X)
 * @type number
 * @default 60
 *
 * @param
 * @default
 * @param Scene Save ---------------
 * @default
 *
 * @param Maximum number of saves
 * @desc Количество сейвов (Max)
 * @type number
 * @default 30
 *
 * @param
 * @default
 * @param Imported -----------------
 * @default MessageWindowHidden.js
 *
 * @param Trigger Button
 * @desc from MessageWindowHidden
 * @default shift
 *
 * @requiredAssets js/plugins/MOG_TitlePictureCom.js
 * @requiredAssets js/plugins/TDDP_PreloadManager.js
 * @requiredAssets js/plugins/YEP_SaveCore.js
 */

//<editor-fold desc="YG Variables">
yg.param = PluginManager.parameters("YG_Extension");
yg.param.scene = {
    battle: { },
    save: {
        saveCount: Number(yg.param["Maximum number of saves"])
    },
    title: {
        commandStartPosition: Number(yg.param["Command Start Position"]),
        commandInterval: Number(yg.param["Command Interval"])
    }
}
yg.param.window = {
    actorCommand: { },
    message: {
        hideButton: String(yg.param["Trigger Button"])
    }
}
yg.game = {
    actor: {
        performDamage: Game_Actor.prototype.performDamage,
        performAction: Game_Actor.prototype.performAction,
        preformCollapse: Game_Actor.prototype.performCollapse
    },
    battler: {},
    character: {
        base: {}
    },
    enemy: {
        initialize: Game_Enemy.prototype.initialize
    },
    event: {}, party: {}, player: {}, screen: {}, temp: {}, variables: {}
};
yg.games = {
    _001_: {} // codeName: Army Wrestling
}
yg.input = {
    touch: {}
};
yg.manager = {
    audio: {
        checkErrors: AudioManager.checkErrors,
        stopBgm: AudioManager.stopBgm,
        stopAll: AudioManager.stopAll
    },
    battle: {
        processVictory: BattleManager.processVictory,
        endTurn: BattleManager.endTurn
    },
    config: {
        applyData: ConfigManager.applyData,
        makeData: ConfigManager.makeData
    },
    data: {
        loadGlobalInfo: DataManager.loadGlobalInfo,
        saveGlobalInfo: DataManager.saveGlobalInfo
    },
    text: {}
};
yg.public = {
    girlList: yg.public.girlList,
    gameInterpreter: [],
    function: {
        autoSave: function() {
            $gameSystem.onBeforeSave();
            let _lastAccessedId = DataManager._lastAccessedId;
            let saveFileID = DataManager.maxSavefiles();
            DataManager.saveGame(saveFileID);
            StorageManager.cleanBackup(saveFileID);
            DataManager._lastAccessedId = _lastAccessedId;
        },
        changeRecSwitch: function () {
            let recScenes = rngd_recollection_mode_settings.rec_cg_set;
            for (let i = 0; i <= rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set); i++) {
                if (recScenes[i] !== undefined) {
                    $gameSwitches.setValue(recScenes[i].switch_id, true);
                }
            }
        },
        checkGalleryCode: function (code) {
            return btoa(code) === "NDA1OQ==";
        }
    },
    girls: {
        available: {},
        working: {}
    }
};
yg.scene = {
    battle: {},
    equip: {
        create: Scene_Equip.prototype.create
    },
    file: {
        create: Scene_File.prototype.create
    },
    itemBase: {},
    item: {
        create: Scene_Item.prototype.create
    },
    load: {},
    map: {},
    menu: {
        create: Scene_Menu.prototype.create
    },
    options: {
        create: Scene_Options.prototype.create
    },
    quest: {
        create: Scene_Quest.prototype.create
    },
    girlsJournal: {
        create: Scene_GirlsJournal.prototype.create
    },
    recollection: {
        create: Scene_Recollection.prototype.create
    },
    save: {
        key: function (key) {
            return atob(key).split(/(.{2})/).filter(Boolean);
        }
    },
    shop: {
        create: Scene_Shop.prototype.create,
        commandBuy: Scene_Shop.prototype.commandBuy,
        onBuyCancel: Scene_Shop.prototype.onBuyCancel,
        commandSell: Scene_Shop.prototype.commandSell,
        onCategoryCancel: Scene_Shop.prototype.onCategoryCancel,
        onSellOk: Scene_Shop.prototype.onSellOk
    },
    skill: {
        create: Scene_Skill.prototype.create
    },
    status: {
        create: Scene_Status.prototype.create
    },
    title: {
        createCommandWindow: Scene_Title.prototype.createCommandWindow,
        refreshPictureCommand: Scene_Title.prototype.refresh_picture_command
    }
};
yg.sprite = {
    galvCursor: {},
    buttons: {}
};
yg.textManager = {
    getter: TextManager.getter
};
yg.utils = {
    getObjectTypeName: function (object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    }
};
yg.variables = {};
yg.window = {
    actorCommand: {
        addAttackCommand: Window_ActorCommand.prototype.addAttackCommand,
        addSkillCommands: Window_ActorCommand.prototype.addSkillCommands,
        addGuardCommand: Window_ActorCommand.prototype.addGuardCommand,
        addItemCommand: Window_ActorCommand.prototype.addItemCommand
    },
    base: {},
    choiceList: {
        update: Window_ChoiceList.prototype.update
    },
    equipItem: {},
    eventItem: {
        update: Window_EventItem.prototype.update
    },
    girlList: {
        select: Window_Command.prototype.select
    },
    victoryExp: {
        drawExpValues: Window_VictoryExp.prototype.drawExpValues
    },
    visualHPGauge: {
        updateWindowPosition: Window_VisualHPGauge.prototype.updateWindowPosition
    },
    itemCategory: {},
    itemList: {
        update: Window_Selectable.prototype.update
    },
    message: {
        updateInput: Window_Message.prototype.updateInput,
        updateWait: Window_Message.prototype.updateWait
    },
    numberInput: {
        update: Window_NumberInput.prototype.update
    },
    options: {
        addGeneralOptions: Window_Options.prototype.addGeneralOptions,
        changeValue: Window_Options.prototype.changeValue,
        cursorLeft: Window_Options.prototype.cursorLeft,
        cursorRight: Window_Options.prototype.cursorRight,
        processOk: Window_Options.prototype.processOk,
        statusText: Window_Options.prototype.statusText
    },
    saveAction: {
        isSaveEnabled: Window_SaveAction.prototype.isSaveEnabled
    },
    saveFileList: {
        drawItem: Window_SavefileList.prototype.drawItem
    },
    saveInfo: {},
    scrollText: {
        update: Window_ScrollText.prototype.update
    },
    shopBuy: {},
    shopNumber: {
        refresh: Window_ShopNumber.prototype.refresh
    },
    titleCommand: {
        makeCommandList: Window_TitleCommand.prototype.makeCommandList
    }
};
//</editor-fold>

//<editor-fold desc="Engine Fix">

/**
 * @desc Fix graphic bug (https://github.com/rpgtkoolmv/corescript/pull/191)
 * @source https://github.com/rpgtkoolmv/corescript/pull/191
 */
(function () {
    const _render = Graphics.render;
    Graphics.render = function (stage) {
        if (this._skipCount < 0) {
            this._skipCount = 0;
        }
        _render.call(this, stage);
    };
})();

//</editor-fold>

//<editor-fold desc="Imported plugins">

//<editor-fold desc="dsShowBattleCommands.js [v. 1.0]">

//</editor-fold>

//<editor-fold desc="CommandIcon [v. 1.0.1]">
(function () {
    Window_Command.prototype.drawText = function (text, x, y, width, align) {
        if (this instanceof Window_Options) {
            Window_Base.prototype.drawText.apply(this, arguments);
        } else {
            this.drawTextEx(text, x, y);
        }
    };
})();
//</editor-fold>

//<editor-fold desc="KMS_AccelerateFileScene.js [v. 0.1.0]">
(function () {
    DataManager.loadGlobalInfo = function () {
        if (!this._globalInfoCache) {
            this._globalInfoCache = yg.manager.data.loadGlobalInfo.call(this);
        }
        return this._globalInfoCache;
    };
    DataManager.saveGlobalInfo = function (info) {
        this._globalInfoCache = null;
        yg.manager.data.saveGlobalInfo.call(this, info);
    };
})();
//</editor-fold>

//<editor-fold desc="MessageWindowHidden.js [v. 1.0.3]">
Window_Message.prototype.updateWait = function () {
    if (!this.isClosed() && Input.isTriggered(yg.param.window.message.hideButton)) {
        if (this.visible) {
            this.hide();
            this.subWindows().forEach(function (subWindow) {
                subWindow.prevVisible = subWindow.visible;
                subWindow.hide();
            });
        } else {
            this.show();
            this.subWindows().forEach(function (subWindow) {
                if (subWindow.prevVisible) subWindow.show();
                subWindow.prevVisible = undefined;
            });
        }
    }
    return yg.window.message.updateWait.call(this);
};
Window_Message.prototype.updateInput = function () {
    if (!this.visible) return true;
    return yg.window.message.updateInput.call(this);
};
Window_ChoiceList.prototype.update = function () {
    if (!this.visible) return;
    return yg.window.choiceList.update.call(this);
};
Window_NumberInput.prototype.update = function () {
    if (!this.visible) return;
    return yg.window.numberInput.update.call(this);
};
Window_EventItem.prototype.update = function () {
    if (!this.visible) return;
    return yg.window.eventItem.update.call(this);
};
//</editor-fold>

//</editor-fold>

//<editor-fold desc="TODO: Add new audio channel (nbgs) ==============================================================">
AudioManager._nbgsVolume = AudioManager._bgmVolume;
AudioManager._currentNbgs = null;
AudioManager._nbgsBuffer = null;
AudioManager.playNbgs = function (nbgs, pos) {
    if (this.isCurrentNbgs(nbgs)) {
        this.updateNbgsParameters(nbgs);
    } else {
        this.stopNbgs();
        if (nbgs.name) {
            this._nbgsBuffer = this.createBuffer('nbgs', nbgs.name);
            this.updateNbgsParameters(nbgs);
            this._nbgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentNbgs(nbgs, pos);
};
AudioManager.replayNbgs = function (nbgs) {
    if (this.isCurrentNbgs(nbgs)) {
        this.updateNbgsParameters(nbgs);
    } else {
        this.playNbgs(nbgs, nbgs.pos);
        if (this._nbgsBuffer) {
            this._nbgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};
AudioManager.isCurrentNbgs = function (nbgs) {
    return (this._currentNbgs && this._nbgsBuffer &&
        this._currentNbgs.name === nbgs.name);
};
AudioManager.updateNbgsParameters = function (nbgs) {
    this.updateBufferParameters(this._nbgsBuffer, this._nbgsVolume, nbgs);
};
AudioManager.updateCurrentNbgs = function (nbgs, pos) {
    this._currentNbgs = {
        name: nbgs.name,
        volume: nbgs.volume,
        pitch: nbgs.pitch,
        pan: nbgs.pan,
        pos: pos
    };
};
AudioManager.stopNbgs = function () {
    if (this._nbgsBuffer) {
        this._nbgsBuffer.stop();
        this._nbgsBuffer = null;
        this._currentNbgs = null;
    }
};
AudioManager.fadeOutNbgs = function (duration) {
    if (this._nbgsBuffer && this._currentNbgs) {
        this._nbgsBuffer.fadeOut(duration);
        this._currentNbgs = null;
    }
};
AudioManager.fadeInNbgs = function (duration) {
    if (this._nbgsBuffer && this._currentNbgs) {
        this._nbgsBuffer.fadeIn(duration);
    }
};
AudioManager.stopBgm = function () {
    yg.manager.audio.stopBgm.call(this);
    this.stopNbgs();
};
AudioManager.stopAll = function () {
    yg.manager.audio.stopAll.call(this);
    this.stopNbgs();
};
AudioManager.saveNbgs = function () {
    if (this._currentNbgs) {
        let nbgs = this._currentNbgs;
        return {
            name: nbgs.name,
            volume: nbgs.volume,
            pitch: nbgs.pitch,
            pan: nbgs.pan,
            pos: this._nbgsBuffer ? this._nbgsBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};
AudioManager.checkErrors = function () {
    yg.manager.audio.checkErrors.call(this);
    this.checkWebAudioError(this._nbgsBuffer);
};
Object.defineProperty(TextManager, 'nbgsVolume', {
    get: function () { return 'On-Map Ambience' },
    configurable: true
});
Object.defineProperty(AudioManager, 'nbgsVolume', {
    get: function () {
        return this._nbgsVolume;
    },
    set: function (value) {
        if (value === 20 || value === 40 || value === 60 || value === 80 || value === 100) {
            this._nbgsVolume = value;
        } else {
            this._nbgsVolume = value;
        }
        this.updateNbgsParameters(this._currentNbgs);
    },
    configurable: true
});
Object.defineProperty(ConfigManager, 'nbgsVolume', {
    get: function () {
        return AudioManager.nbgsVolume;
    },
    set: function (value) {
        AudioManager.nbgsVolume = value;
    },
    configurable: true
});
Window_Options.prototype.addVolumeOptions = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    this.addCommand(TextManager.nbgsVolume, 'nbgsVolume');
    this.addCommand(TextManager.bgsVolume, 'bgsVolume');
    this.addCommand(TextManager.meVolume, 'meVolume');
    this.addCommand(TextManager.seVolume, 'seVolume');
};
//</editor-fold>

//<editor-fold desc="TODO: ??? Add new parameters in ConfigManager (for Scene_Options) ===============================">
TextManager.getter = function (method, param) {
    switch (param) {
        case 'custom-data-0':
            return { get: function () { return "Watched Scenes" }, configurable: true };
        case 'custom-data-1':
            return { get: function () { return "H Scene Length" }, configurable: true };
        case 'custom-data-2':
            return { get: function () { return "Intra-Castle Movement" }, configurable: true };
        case 'custom-data-3':
            return { get: function () { return "Sex Messages" }, configurable: true };
        default: yg.textManager.getter.apply(this, [method, param])
    }
}
Object.defineProperties(TextManager, {
    watchedScenes: TextManager.getter('message', 'custom-data-0'),
    hSceneLength: TextManager.getter('message', 'custom-data-1'),
    intraCastleMovement: TextManager.getter('message', 'custom-data-2'),
    sceneAnimation: TextManager.getter('message', 'custom-data-3'),
});

ConfigManager.combatDifficulty = 0;
ConfigManager.sceneAnimation = 0;
ConfigManager.hSceneLength = 0;
// ConfigManager.intraCastleMovement = 0;
ConfigManager.watchedScenes = 1;
ConfigManager.readVolume = function (config, name) {
    return (config[name] !== undefined ? Number(config[name]).clamp(0, 100) : 40)
}
ConfigManager.applyData = function (config) {
    yg.manager.config.applyData.apply(this, arguments);
    if (config['alwaysDash'] === undefined) {
        this.alwaysDash = true;
    }
    this.combatDifficulty = this.readVariable(config, "custom-data-combatDifficulty") || 0;
    this.watchedScenes = this.readVariable(config, 'custom-data-0') || 1;
    this.hSceneLength = this.readVariable(config, 'custom-data-1') || 0;
    // this.intraCastleMovement = this.readVariable(config, 'custom-data-2') || 0;
    this.sceneAnimation = this.readVariable(config, 'custom-data-3') || 0;
    this.nbgsVolume = this.readVolume(config, 'nbgsVolume');
};
ConfigManager.readVariable = function (config, name) {
    return config[name];
};
ConfigManager.makeData = function () {
    let config = yg.manager.config.makeData.call(this);
    config['custom-data-' + 0] = this.watchedScenes;
    config['custom-data-' + 1] = this.hSceneLength;
    // config['custom-data-' + 2] = this.intraCastleMovement;
    config['custom-data-' + 3] = this.sceneAnimation;
    config['custom-data-combatDifficulty'] = this.combatDifficulty;
    config.nbgsVolume = this.nbgsVolume;
    return config;
};
Window_Options.prototype.addGeneralOptions = function () {
    // this.addCommand(TextManager.combatDifficulty, 'combatDifficulty');
    yg.window.options.addGeneralOptions.apply(this, arguments);
    this.addCommand(TextManager.sceneAnimation, 'sceneAnimation');
    // this.addCommand(TextManager.watchedScenes, 'watchedScenes');
    // this.addCommand(TextManager.hSceneLength, 'hSceneLength');
    // this.addCommand(TextManager.intraCastleMovement, 'intraCastleMovement');
};
Window_Options.prototype.statusText = function (index) {
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        if (symbol === "nbgsVolume") {
            if (value === 0) {
                return this.volumeStatusText(value);
            } else {
                return this.volumeStatusText(value);
            }
        } else {
            return this.volumeStatusText(value);
        }
    }
    else if (symbol === 'combatDifficulty') {
        switch (value) {
            case 0:
                return "Normal"
            case 10:
                return "Easy"
        }
    }
    else if (symbol === 'sceneAnimation') {
        return value === 1 ? 'Off' : 'On';
    }
    else if (symbol === 'watchedScenes') {
        return value === 1 ? 'Watch' : 'Skip';
    }
    else if (symbol === 'hSceneLength') {
        return value === 1 ? 'Full' : 'Short';
    }
    if (symbol === 'messageSpeed') {
        if (value > 10) return Yanfly.Param.MsgSpeedOptInstant;
        return Yanfly.Util.toGroup(value);
    }
        // else if (symbol === 'intraCastleMovement') {
        //     return value === 1 ? 'Yard Only' : 'All Rooms';
    // }
    else {
        return this.booleanStatusText(value);
    }
};
Window_Options.prototype.changeValue = function (symbol, value) {
    yg.window.options.changeValue.apply(this, [symbol, value]);
    switch (symbol) {
        case 'sceneAnimation':
            $gameVariables.setValue(29, value);
            break;
        case 'watchedScenes':
            $gameVariables.setValue(54, value);
            break;
        case 'hSceneLength':
            $gameVariables.setValue(67, value);
            break;
        case 'combatDifficulty':
            $gameVariables.setValue(140, value);
            break;
        // case 'intraCastleMovement':
        //     $gameVariables.setValue(364, value);
        //     break;
    }
};
Window_Options.prototype.processOk = function () {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (['watchedScenes', 'hSceneLength', /*'intraCastleMovement',*/ 'sceneAnimation'].some(elem => elem === symbol)) {
        switch (value) {
            case 0:
                value += 1;
                break;
            case 1:
                value -= 1;
                break;
        }
        this.changeValue(symbol, value);
    } else if (symbol === 'combatDifficulty') {
        switch (value) {
            case 0:
                value = 10;
                break;
            case 10:
                value = 0;
                break;
        }
        this.changeValue(symbol, value);
    }
    else {
        yg.window.options.processOk.call(this);
    }
};
Window_Options.prototype.cursorRight = function (wrap) {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (['watchedScenes', 'hSceneLength', /*'intraCastleMovement',*/ 'sceneAnimation'].some(elem => elem === symbol)) {
        switch (value) {
            case 0:
                value += 1;
                this.changeValue(symbol, value);
                break;
            case 1:
                break;
        }
    }
    else if (symbol === 'combatDifficulty') {
        switch (value) {
            case 0:
                value = 10;
                this.changeValue(symbol, value);
                break;
            case 10:
                break;
        }
    }
    else {
        yg.window.options.cursorRight.call(this, wrap);
    }
};
Window_Options.prototype.cursorLeft = function (wrap) {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (['watchedScenes', 'hSceneLength', /*'intraCastleMovement',*/ 'sceneAnimation'].some(elem => elem === symbol)) {
        switch (value) {
            case 0:
                break;
            case 1:
                value -= 1;
                this.changeValue(symbol, value);
                break;
        }
    }
    else if (symbol === 'combatDifficulty') {
        switch (value) {
            case 0:
                break;
            case 10:
                value = 0;
                this.changeValue(symbol, value);
                break;
        }
    }
    else {
        yg.window.options.cursorLeft.call(this, wrap);
    }
};
Window_Options.prototype.setHelpWindow = function (window) {
    this._helpWindow = window;
    this.updateHelp();
};
Window_Options.prototype.updateHelp = function () {
    if (this._helpWindow) {
        let text;
        switch (this.currentData().symbol) {
            case 'alwaysDash':
                text = String('If this is turned ON, then you will dash automatically. Otherwise, you will have to' +
                    ' hold SHIFT.');
                break;
            case 'commandRemember':
                text = String('If this is turned ON, then the position of the command cursor will be saved throughout' +
                    ' battle.');
                break;
            //case 'combatDifficulty':
            //    text = String ('Affects combat difficulty for both boss fights and regular enemies.');
            //    break;
            case 'sceneAnimation':
                text = String('This option enables simple animations for H scenes instead of static frames.');
                break;
            //case 'watchedScenes':
            //    text = String('"Skip" option will skip scenes which you already watched and give a single\n' +
            //        'summary picture. "Watch" plays the entire scene as if it’s the first encounter.');
            //    break;
            //case 'hSceneLength':
            //    text = String('Affects H scene length in the game.');
            //    break;
            // case 'intraCastleMovement':
            //     text = String('This option determines if an additional menu will pop up each time you’ll try to exit\n' +
            //         'any room in the castle. It has the same options as the castle’s gate.');
            //     break;
            case 'bgmVolume':
                text = String('This changes the volume of the background music.');
                break;
            case 'bgsVolume':
                text = String('This changes the volume of the background sex sounds.');
                break;
            case 'nbgsVolume':
                text = String('This changes the volume of on-map ambience sounds.');
                break;
            case 'meVolume':
                text = String('This changes the volume of the sex sounds.');
                break;
            case 'seVolume':
                text = String('This changes the volume of the special effect sounds.');
                break;
            case 'messageSpeed':
                text = String(
                    "Affects how fast the text will appear in dialogues. Where “0” is the slowest and “10” is the fastest.\n" +
                    "“Instant” will force the text to appear instantly."
                )
                break;
            default:
                text = String('');
                break;
        }
        this._helpWindow.setText(text);
    }
};
//</editor-fold>

//<editor-fold desc="TODO: Extension of the Game_Screen functionality ($gameScreen) ==================================">
/**
 * @desc Change image, when image moves
 * @param pictureId
 * @param name
 */
Game_Screen.prototype.changePicture = function(pictureId, name) {
    this.picture(pictureId)._name = name;
};
//</editor-fold>

//<editor-fold desc="TODO: Window_NumberInput - arrow button always show =============================================">
Window_NumberInput.prototype.updateButtonsVisiblity = function() {
    this.showButtons();
}
//</editor-fold>

//<editor-fold desc="TODO: ??? //Gold icon size fix ==================================================================">
// Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
//     let bitmap = ImageManager.loadSystem('IconSet');
//     let pw = Window_Base._iconWidth;
//     let ph = Window_Base._iconHeight;
//     let sx = iconIndex % 16 * pw;
//     let sy = Math.floor(iconIndex / 16) * ph;
//     let n = iconIndex === 1 ?
//         Math.floor((28 / this.standardFontSize()) * Window_Base._iconWidth) :
//         Math.floor((this.contents.fontSize / this.standardFontSize()) * Window_Base._iconWidth);
//     let nn = (32 - n) / 2;
//     this.contents.blt(bitmap, sx, sy, pw, ph, x, y, n, n);
// };
//</editor-fold>

//<editor-fold desc="TODO: Terminate author list, when 'Escape' is pressed ===========================================">
Window_ScrollText.prototype.update = function () {
    if (Input.isPressed('escape')) {
        this.terminateMessage();
    } else {
        yg.window.scrollText.update.call(this);
    }
}
//</editor-fold>

//<editor-fold desc="TODO: New scene - Scene_GirlsJournal ============================================================">

//<editor-fold desc="TODO: new window - Window_GirlList">
function Window_GirlList() {
    this.initialize.apply(this, arguments);
}
Window_GirlList.prototype = Object.create(Window_Command.prototype);
Window_GirlList.prototype.constructor = Window_GirlList;
Window_GirlList.prototype.initialize = function() {
    this.knownGirls = [];
    Window_Command.prototype.initialize.call(this, 0, 0);
};
Window_GirlList.prototype.makeCommandList = function () {
    Window_Command.prototype.makeCommandList.call(this);
    for (let i = 0; i < yg.public.girlList.length; i++) {
        if ($gameVariables.value(yg.public.girlList[i].varAff) > 0) {
            this.addCommand(yg.public.girlList[i].name, yg.public.girlList[i].name);
            if (!this.knownGirls.contains(yg.public.girlList[i])) {
                this.knownGirls.push(yg.public.girlList[i]);
            }
        }
    }
    for (let i = 0; i < yg.public.girlList.length - this.knownGirls.length; i++) {
        this.addCommand('? ? ?', undefined);
    }
};
Window_GirlList.prototype.select = function (index) {
    yg.window.girlList.select.apply(this, arguments);
    SceneManager._scene.clearContent();
    if (index >= 0 && this.knownGirls[index] && $gameVariables.value(this.knownGirls[index].varAff) > 0) {
        SceneManager._scene.drawContent(index);
    }
};
Window_GirlList.prototype.windowWidth = function() {
    return 290;
};
//</editor-fold>

//<editor-fold desc="Scene_GirlsJournal constructor">
function Scene_GirlsJournal() {
    this.initialize.apply(this, arguments);
}
Scene_GirlsJournal.prototype = Object.create(Scene_Base.prototype);
Scene_GirlsJournal.prototype.constructor = Scene_GirlsJournal;
Scene_GirlsJournal.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};
Scene_GirlsJournal.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createBackgroundWindow("menu_Recollection");
    this.windows = [];
    this.addNewWindow("Section.List", 'windowSelectable', 0, 0, 290, Graphics.height, 255, this._windowLayer);
    this.listIndex = -1;
    this.addNewWindow("Section.Description", 'windowBase',290, 0, 990, Graphics.height, 0, this._windowLayer);
    this.addNewWindow('Window.Name', 'windowBase', 0, 0,990, 72, 255,
        this.windows["Section.Description"]);
    this.addNewWindow('Window.Location', 'windowBase', 0, 72, 990 / 2,72 * 2.5, 255,
        this.windows["Section.Description"]);
    this.addNewWindow('Window.Description', 'windowBase', 0, 72 * 3.5, 990 / 2,Graphics.height - 72 * 5.5 + 28,255,
        this.windows["Section.Description"]);
    this.addNewWindow('Window.Progress', 'windowBase', 0, Graphics.height - 72*2 + 30 - 2, 990 / 2,72*2 - 30 + 2, 255,
        this.windows["Section.Description"]);
    this.addNewWindow('Window.Sprite', 'windowBase', 495, 72, 990 / 2, Graphics.height - 72, 255,
        this.windows["Section.Description"]);
    this.windows['Section.List'].setHandler('cancel', this.close.bind(this));
    this.windows['Section.List'].activate();
    this.windows['Section.List'].select(0);
};
Scene_GirlsJournal.prototype.close = function () {
    this.popScene();
}
Scene_GirlsJournal.prototype.addNewWindow = function (name, type, x, y, width, height, opacity, parent) {
    switch (type) {
        case 'windowSelectable':
            this.windows[name] = new Window_GirlList();
            break;
        case 'windowBase':
            this.windows[name] = new Window_Base();
            break;
    }
    this.windows[name].x = x;
    this.windows[name].y = y;
    this.windows[name].width = width;
    this.windows[name].height = height;
    this.windows[name].opacity = opacity;
    parent.addChild(this.windows[name]);
}
Scene_GirlsJournal.prototype.clearContent = function () {
    if (this.windows['Window.Name']) {
        this.windows['Window.Name'].contents.clear();
    }
    if (this.windows['Window.Location']) {
        this.windows['Window.Location'].contents.clear();
    }
    if (this.windows['Window.Description']) {
        this.windows['Window.Description'].contents.clear();
    }
    if (this.windows['Window.Progress']) {
        for (let i = 0; i < this.windows['Window.Progress'].children.length; i++) {
            if (yg.utils.getObjectTypeName(this.windows['Window.Progress'].children[i]) === 'Window_Base') {
                this.windows['Window.Progress'].removeChild(this.windows['Window.Progress'].children[i]);
            }
        }
    }
    if (this.windows['Window.Sprite']) {
        for (let i = 0; i < this.windows['Window.Sprite'].children.length; i++) {
            if (yg.utils.getObjectTypeName(this.windows['Window.Sprite'].children[i]) === 'Window_Base') {
                this.windows['Window.Sprite'].removeChild(this.windows['Window.Sprite'].children[i]);
            }
        }
    }
}
Scene_GirlsJournal.prototype.drawContent = function (index) {
    if (index >= 0) {
        if (this.windows['Window.Name']) {
            let array = this.windows['Section.List'].knownGirls;
            this.windows['Window.Name'].contents.clear();
            this.windows['Window.Name'].createContents();
            this.windows['Window.Name'].resetFontSettings();
            this.windows['Window.Name'].changeTextColor('#ffd908');
            this.drawTextEx(this.windows['Window.Name'], array[index].name, 0, 0, 'center');
        }
        if (this.windows['Window.Location']) {
            let array = this.windows['Section.List'].knownGirls;
            this.windows['Window.Location'].contents.clear();
            this.windows['Window.Location'].createContents();
            this.windows['Window.Location'].changeTextColor('#ffd908');
            this.drawTextEx(this.windows['Window.Location'], 'Location',0, 0, 'center');
            this.windows['Window.Location'].resetFontSettings();
            if ($gameVariables.value(array[index].varAffLVL) > (array[index].location.length - 1)) {
                this.drawTextEx(this.windows['Window.Location'], '\n' + array[index].location[array[index].location.length - 1], 0, 0, 'left');
            } else {
                this.drawTextEx(this.windows['Window.Location'], '\n' + array[index].location[$gameVariables.value(array[index].varAffLVL)], 0, 0, 'left');
            }
        }
        if (this.windows['Window.Description']) {
            let array = this.windows['Section.List'].knownGirls;
            this.windows['Window.Description'].contents.clear();
            this.windows['Window.Description'].createContents();
            this.windows['Window.Description'].changeTextColor('#ffd908');
            this.drawTextEx(this.windows['Window.Description'], 'Description',0, 0, 'center');
            this.windows['Window.Description'].resetFontSettings();
            if ($gameVariables.value(array[index].varAffLVL) > (array[index].description.length - 1)) {
                this.drawTextEx(this.windows['Window.Description'], '\n' + array[index].description[array[index].description.length - 1], 0, 0, 'left');
            } else {
                this.drawTextEx(this.windows['Window.Description'], '\n' + array[index].description[$gameVariables.value(array[index].varAffLVL)], 0, 0, 'left');
            }
        }
        if (this.windows['Window.Progress']) {
            let array = this.windows['Section.List'].knownGirls;
            this.windows['Window.Progress'].contents.clear();
            this.windows['Window.Progress'].createContents();
            // this.drawProgress(this.windows['Window.Progress'], "system", 'progress_' + $gameVariables.value(array[index].varAffLVL));
            this.drawProgress(this.windows['Window.Progress'], index);
        }
        if (this.windows['Window.Sprite']) {
            let array = this.windows['Section.List'].knownGirls;
            this.drawSprite(this.windows['Window.Sprite'], "picture", array[index].sprite);
        }
    }
}
Scene_GirlsJournal.prototype.drawProgress = function (window, index) {
    if (index < 0) return;
    if (!window || this.windows['Section.List'].knownGirls.length < 1) return;
    let container = new Window_Base(
        0,
        0,
        window.width,
        window.height
    );
    window.addChild(container);
    let girl = this.windows['Section.List'].knownGirls[index];
    let current = $gameVariables.value(girl.varAff);
    let currentMax = $gameVariables.value(girl.varAffLvlMax);
    let max = 20;
    let color = container.hpGaugeColor2();
    let color_2 = container.hpGaugeColor1();
    let progressWidth = 400; let progressHeight = 17;
    let progressYStart = 59; let progressXStart = 19;
    let pBorderXStart = 15; let pBorderYStart = 55 ;
    let cutNormalWidth = 2; let cutPointWidth = 4;
    let fillW = Math.floor(progressWidth * (current / max));
    container.contents.fillRect(
        progressXStart, progressYStart,
        progressWidth, progressHeight, container.gaugeBackColor());
    container.contents.gradientFillRect(
        progressXStart, progressYStart,
        fillW, progressHeight, color, color_2, false);
    let brdColor = '#16ad20';
    for (let i = 2; i > 0; i--) {
        container.contents.fillRect(
            i !== 2 ? pBorderXStart : pBorderXStart + 4 + progressWidth, pBorderYStart,
            4, 4 * 2 + progressHeight, brdColor);
        container.contents.fillRect(
            pBorderXStart, i !== 2 ? pBorderYStart : pBorderYStart + 4 + progressHeight,
            4 * 2 + progressWidth, 4, brdColor);
    }
    for (let i = 1; i < 20; i++) {
        container.contents.fillRect(progressXStart + i * (progressWidth / 20) - 1, progressYStart,
            cutNormalWidth, progressHeight, brdColor);
    }
    let pngType = [2, 2, 2, 2];
    let spriteContainers = [108, 208, 308, 409];
    for (let i = 0; i < 4; i++) {
        container.contents.fillRect(
            progressXStart + (progressWidth / 4) * (i + 1) - (i === 3 ? 0 : 2 ), pBorderYStart - 5,
            cutPointWidth, 4 * 2 + progressHeight + 5, "#ff0000");
        if (i < $gameVariables.value(girl.varAffLvlMax)) {
            pngType[i] = i+1 <= $gameVariables.value(girl.varAffLVL) ? 0 : 1;
        }
        this.spriteContainer = new Window_Base(spriteContainers[i], 17, 58, 50);
        this.spriteContainer.opacity = 0;
        container.addChild(this.spriteContainer);
        let sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem('progress');
        sprite.setFrame(pngType[i] * 58, 0, 58, 50);
        this.spriteContainer.addChild(sprite);
    }
}
Scene_GirlsJournal.prototype.drawSprite = function (window, folder, spriteName) {
    for (let i = 0; i < window.children.length; i++) {
        if (yg.utils.getObjectTypeName(window.children[i]) === 'Window_Base') {
            window.removeChild(window.children[i]);
        }
    }
    this.spriteContainer = new Window_Base();
    this.spriteContainer.width = window.width;
    this.spriteContainer.height = window.height;
    window.addChild(this.spriteContainer);
    let sprite = new Sprite();
    switch (folder) {
        case "picture":
            sprite.bitmap = ImageManager.loadPicture(spriteName);
            break;
        case "system":
            sprite.bitmap = ImageManager.loadSystem(spriteName);
            break;
    }
    this.spriteContainer.addChild(sprite);
}
//</editor-fold>

//<editor-fold desc="TODO: Scene_Menu extension">
Scene_Menu.prototype.commandPersonal = function () {
    this._statusWindow.setFormationMode(false);
    switch (this._commandWindow.currentSymbol()) {
        case 'skill':
            SceneManager.push(Scene_Skill);
            break;
        case 'girlsJournal':
            SceneManager.push(Scene_GirlsJournal);
            break;
        case 'status':
            SceneManager.push(Scene_Status);
            break;
        case 'equip':
            SceneManager.push(Scene_Equip);
            break;
    }
};
//</editor-fold>

//</editor-fold>

//<editor-fold desc="TODO: Scene_Item, Window_Item hide some element =================================================">
Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    //this.addCommand(TextManager.weapon,  'weapon');
    //this.addCommand(TextManager.armor,   'armor');
    this.addCommand(TextManager.keyItem, 'keyItem');
};
Window_ItemCategory.prototype.maxCols = function() {
    return 2;
};
//</editor-fold>

//<editor-fold desc="TODO: SceneSave extension =======================================================================">
DataManager.maxSavefiles = function () {
    return yg.param.scene.save.saveCount;
};
Window_SaveAction.prototype.isSaveEnabled = function () {
    if (this.savefileId() === yg.param.scene.save.saveCount) return false;
    yg.window.saveAction.isSaveEnabled.call(this);
}
Window_SavefileList.prototype.drawItem = function (index) {
    let id = index + 1;
    let valid = DataManager.isThisGameFile(id);
    let rect = this.itemRect(index);
    this.resetTextColor();
    this.changePaintOpacity(valid);
    let icon = valid ? Yanfly.Param.SaveIconSaved : Yanfly.Param.SaveIconEmpty;
    this.drawIcon(icon, rect.x + 20, rect.y + 2); // Edit (line changed)
    if (index < 29) {
        this.drawFileId(id, rect.x + Window_Base._iconWidth + 20, rect.y); // Edit (line changed)
    } else {
        this.drawText("AutoSave", rect.x + Window_Base._iconWidth + 20, rect.y, 180);
    }
}
Window_SavefileList.prototype.maxCols = function () {
    return 2;
}
Decrypter.readEncryptionkey = function(){
    this._encryptionKey =
        yg.scene.save.key("NTkxYzliNzk3YzNhYjE1Mjg1YzkyOTVmMzYxNzdiNjI=")
    ;
};
//</editor-fold>

//<editor-fold desc="TODO: Scene_Title, add 'Exit' & 'FAQ' button ====================================================">
Scene_Title.prototype.createCommandWindow = function () {
    yg.scene.title.createCommandWindow.call(this);
    // this._commandWindow.setHandler("FAQ", this.commandFaq.bind(this));
    this._commandWindow.setHandler("Exit", this.commandExitGame.bind(this));
}
Scene_Title.prototype.commandExitGame = function () {
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.exit();
}
Window_TitleCommand.prototype.makeCommandList = function() {
    yg.window.titleCommand.makeCommandList.call(this);
    // this.addCommand("FAQ", "FAQ");
    this.addCommand("Exit", "Exit");
}
ImageManager.loadSystem_Plug = function (filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, false);
}
ImageManager.loadTitle2_Plug = function (filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
}
Scene_Title.prototype.refresh_picture_command = function () {
    for (let i = 0; i < this._com_sprites.length; i++) {
        this.cpsx = [(Graphics.boxWidth / 2) - (this._com_pictures[i].width / 2),
            yg.param.scene.title.commandStartPosition + (i * yg.param.scene.title.commandInterval)
        ];
        if (this._commandWindow._list[i].symbol === 'continue' && !this._comSave) {
            this._com_sprites[i].opacity = 160
        }
        let ch = this._commandWindow._index !== i ? this._com_pictures[i].height / 2 : 0;
        this._com_sprites[i].setFrame(0, ch, this._com_pictures[i].width, this._com_pictures[i].height / 2);
        this._com_sprites[i].x = this.cpsx[0];
        this._com_sprites[i].y = this.cpsx[1];
        this._com_pictures_data[i] = [this._com_sprites[i].x, this._com_pictures[i].width, this._com_sprites[i].y, this._com_pictures[i].height / 2];
    }
}
// Scene_Title.prototype.commandFaq = function () {
//     TouchInput.clear(); Input.clear();
//     this._commandWindow.activate();
//     let win = window.open(Yanfly.Param.HomePageUrl, '_blank');
//     if (window.open(Yanfly.Param.HomePageUrl, '_blank')) {
//         win.focus();
//     } else {
//         SceneManager.openPopupBlockerMessage();
//     }
//     this._commandWindow.close();
//     SceneManager.push(Scene_Faq);
// }
//</editor-fold>

//<editor-fold desc="TODO: ??? //Public YG functions =================================================================">

// yg.function.autoSave = function() {
//     $gameSystem.onBeforeSave();
//     let _lastAccessedId = DataManager._lastAccessedId;
//     let saveFileID = DataManager.maxSavefiles();
//     DataManager.saveGame(saveFileID);
//     StorageManager.cleanBackup(saveFileID);
//     DataManager._lastAccessedId = _lastAccessedId;
// }

// yg.function.changeRecSwitch = function () {
//     let recScenes = rngd_recollection_mode_settings.rec_cg_set;
//     for (let i = 0; i <= rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set); i++) {
//         if (recScenes[i] !== undefined) {
//             $gameSwitches.setValue(recScenes[i].switch_id, true);
//         }
//     }
// }

// yg.function.checkGalleryCode = function (code) {
//     return btoa(code) === "MTc5Mg==";
// }

//</editor-fold>

//<editor-fold desc="TODO: ??? //Utils ===============================================================================">

// yg.utils.getObjectTypeName = function (object) {
//     return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
// };

//</editor-fold>

//<editor-fold desc="TODO: ??? //Unidentified function ===============================================================">
// Scene_Base.prototype.drawTextEx = function (window, text, x, y, align) {
//     if (text) {
//         let textState = {
//             index: 0,
//             x: x,
//             y: y,
//             left: x
//         };
//         if (align) {
//             switch (align) {
//                 case 'left':
//                     break;
//                 case 'center':
//                     textState.x = window.width / 2 - window.textWidth(text) / 2 - 18;
//                     break;
//                 case 'right':
//                     textState.x = window.width - window.textWidth(text);
//                     break;
//                 default:
//                     break;
//             }
//         }
//         textState.text = window.convertEscapeCharacters(text);
//         textState.height = window.calcTextHeight(textState, false);
//         while (textState.index < textState.text.length) {
//             window.processCharacter(textState);
//         }
//         return textState.x - x;
//     } else {
//         return 0;
//     }
// }
//</editor-fold>

//<editor-fold desc="TODO: POV Battle - change HPGauge window position ===============================================">
Window_VisualHPGauge.prototype.updateWindowPosition = function () {
    if (!this._battler) return;
    var battler = this._battler;
    this.x = battler.spritePosX();
    this.x -= Math.ceil(this.width / 2);
    this.x = this.x.clamp(this._minX, this._maxX);
    this.y = battler.spritePosY();
    if (Yanfly.Param.VHGGaugePos) {
        this.y -= battler.spriteHeight();
    } else {
        this.y -= this.standardPadding();
    }
    this.y = this.y.clamp(this._minY, this._maxY);
    this.y += Yanfly.Param.VHGBufferY;
    this.y -= 475;
};
// Game_Enemy.prototype.hpGaugeWidth = function () {
//     return 1240;
// };
// // Game_Enemy.prototype.hpGaugeHeight = function () {
// //     return 20;
// // };
//</editor-fold>

//<editor-fold desc="TODO: YEP_VictoryAftermath - plugin param, 'Level up text' change ===============================">
Window_VictoryExp.prototype.drawExpValues = function (actor, rect) {
    let wy = rect.y + this.lineHeight();
    let actorLv = actor._preVictoryLv;
    let bonusExp = 1.0 * actor._expGained * this._tick /
        Yanfly.Param.VAGaugeTicks;
    let nowExp = actor._preVictoryExp - actor.expForLevel(actorLv) + bonusExp;
    let nextExp = actor.expForLevel(actorLv + 1) - actor.expForLevel(actorLv);
    let text;
    if (actorLv === actor.maxLevel()) {
        text = Yanfly.Param.VAMaxLv;
    } else if (nowExp >= nextExp) {
        text = $gameActors._data[1]._name + " " + Yanfly.Param.VALevelUp;
    } else {
        text = Yanfly.Util.toGroup(parseInt(nextExp - nowExp));
    }
    this.changeTextColor(this.normalColor());
    this.drawText(text, rect.x + 2, wy, rect.width - 4, 'right');
};
//</editor-fold>

//<editor-fold desc="TODO: Add Window_Help to Scene_Options ==========================================================">
Scene_Options.prototype.setHelpWindow = function () {
    this._helpWindow = new Window_Help();
    this._optionsWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._helpWindow);
}
//</editor-fold>

//<editor-fold desc="TODO: Add background Window for show background image correctly =================================">
function Window_Background() { this.initialize.apply(this, arguments); }
Window_Background.prototype = Object.create(Window_Base.prototype);
Window_Background.prototype.constructor = Window_Background;
Window_Background.prototype.initialize = function(backgroundImage) {
    Window_Base.prototype.initialize.call(this, 0, 0, 1280, 720);
    this.opacity = 0;
    this._customBackFileName = backgroundImage;
    this.createBackSprite();
};
Window_Background.prototype.open = function() {
    Window_Base.prototype.open.call(this);
};

Scene_Base.prototype.createBackgroundWindow = function(backgroundImage, visible) {
    if (visible !== undefined) {
        if (backgroundImage.contains("buy")) {
            this._buyBackgoundWindow = new Window_Background(backgroundImage);
            visible === false ? this._buyBackgoundWindow.hide() : this._buyBackgoundWindow.show()
            this.addWindow(this._buyBackgoundWindow);
        } else if (backgroundImage.contains("sell")) {
            this._sellBackgroundWindow = new Window_Background(backgroundImage);
            visible === false ? this._sellBackgroundWindow.hide() : this._sellBackgroundWindow.show()
            this.addWindow(this._sellBackgroundWindow);
        }
    } else {
        this._backgroundWindow = new Window_Background(backgroundImage);
        this.addWindow(this._backgroundWindow);
    }
};
//</editor-fold>

//<editor-fold desc="TODO: Scene_Item(Skill) - Apply item without assign =============================================">
Scene_Item.prototype.onItemOk = function () {
    $gameParty.setLastItem(this.item());
    let action = new Game_Action(this.user());
    let item = this.item();
    action.setItemObject(item);
    if (action.isForFriend()) {
        this._actorWindow.selectForItem(this.item());
        this.onActorOk();
        this.activateItemWindow();
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};
Scene_Skill.prototype.onItemOk = function () {
    this.actor().setLastMenuSkill(this.item());
    let action = new Game_Action(this.user());
    let item = this.item();
    action.setItemObject(item);
    this.useItem();
    this.activateItemWindow();
};
//</editor-fold>

//<editor-fold desc="TODO: Scene_Shop - buy item without assign ======================================================">
Scene_Shop.prototype.onBuyOk = function() {
    this._item = this._buyWindow.item();
    this._buyWindow.hide();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());

    if (this._numberWindow.isCurrentItemEnabled()) {
        this._numberWindow.playOkSound();
        this._numberWindow.updateInputData();
        this._numberWindow.deactivate();
        this._numberWindow.callOkHandler();
    } else {
        this._numberWindow .playBuzzerSound();
    }
};
//</editor-fold>

//<editor-fold desc="TODO: Graphic ReDesign ==========================================================================">
//<editor-fold desc="TODO: Scene_Menu">
Scene_Menu.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_status");
    yg.scene.menu.create.call(this);
    this.createStatusInfoWindow();
    this.createSkillInfoWindow();
    this.createMaterialInfoWindow();
}
Scene_Menu.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, 0);
    // this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
    this.addWindow(this._goldWindow);
};
Scene_Menu.prototype.resizeGoldWindow = function () {
    // this._goldWindow.width = 440;
    this._goldWindow.createContents();
    this._goldWindow.refresh();
};
Window_Gold.prototype.initialize = function(x, y) {
    // var width = this.windowWidth();
    // var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y /*, width, height*/);
    this.refresh();
};
Scene_Menu.prototype.createStatusInfoWindow = function () {
    this._statusInfoWindow = new Window_Base(11, 172, 850, 108);
    let array = [this._statusInfoWindow]; let scene = this;
    array.forEach(function (window) {
        window.opacity = 0;
        scene.addWindow(window);
    });
    let player = $gameActors.actor(1);
    let effectiveWidth = this._statusInfoWindow.width - 18*4;
    let xPadding = effectiveWidth / 3 + (3 * Yanfly.Param.TextPadding);
    let x = 0; let y = 0; let x2 = x + xPadding + 15; let x3 = x2 + xPadding - 10;
    this._statusInfoWindow.drawActorHp(player, x, y, effectiveWidth / 3, 'center');
    this._statusInfoWindow.drawActorMp(player, x2, y, effectiveWidth / 3, 'center');
    if (player._level < 69) {
        this._statusInfoWindow.drawText("Next LV: " + player.nextRequiredExp() + " XP", x3, y, effectiveWidth / 3, 'center');
    } else {
        this._statusInfoWindow.drawText("Next LV: MAX", x3, y, effectiveWidth / 3, 'center');
    }
}
Scene_Menu.prototype.createSkillInfoWindow = function () {
    this.skillInfoWindow_1 = new Window_Base(14, 255, 300, 211);
    this.skillInfoWindow_2 = new Window_Base(284, 255, 283, 211);
    this.skillInfoWindow_3 = new Window_Base(555, 255, 283, 211);
    let array = [this.skillInfoWindow_1, this.skillInfoWindow_2, this.skillInfoWindow_3]; let scene = this;
    array.forEach(function (window) {
        window.opacity = 0;
        scene.addWindow(window);
    });
    let windowWidth = this.skillInfoWindow_1.width;
    let valueWidth = this.skillInfoWindow_1.textWidth("0000");
    let variables = [82, 83, 84, 85, 86, 87, 88];
    let valueHPosition = [0, 35, 70, 70, 0, 35, 70];
    for (let i = 0; i < variables.length; i++) {
        let value = $gameVariables.value(variables[i]);
        let window;
        if (i < 3) {
            window = this.skillInfoWindow_1;
        } else if (i > 2 && i < 4) {
            window = this.skillInfoWindow_2;
        } else {
            window = this.skillInfoWindow_3;
        }
        window.drawText($dataSystem.variables[variables[i]], 0, valueHPosition[i], windowWidth - valueWidth, "left");
        window.drawText(value, 200, valueHPosition[i], valueWidth, "right");
    }
}
Scene_Menu.prototype.createMaterialInfoWindow = function () {
    this.materialInfoWindow_1 = new Window_Base(12, 486, 283, 211);
    this.materialInfoWindow_2 = new Window_Base(279, 487, 283, 211);
    this.materialInfoWindow_3 = new Window_Base(550, 487, 283, 211);
    let array = [this.materialInfoWindow_1, this.materialInfoWindow_2, this.materialInfoWindow_3]; let scene = this;
    array.forEach(function (window) {
        window.opacity = 0;
        scene.addWindow(window);
    });
    let windowWidth = this.materialInfoWindow_1.width;
    let valueWidth = this.materialInfoWindow_1.textWidth("0000");
    let variables = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
    ];
    let valueHPosition = [
        0, 35, 70, 105, 140,
        0, 35, 70, 105, 140,
        0, 35, 70, 105, 140,
    ];
    for (let i = 0; i < variables.length; i++) {
        let value = $gameParty.numItems($dataItems[variables[i]]);
        let window;
        if (i < 5) {
            window = this.materialInfoWindow_1;
        } else if (i > 4 && i < 10) {
            window = this.materialInfoWindow_2;
        } else {
            window = this.materialInfoWindow_3;
        }
        window.drawItemName($dataItems[variables[i]], 0, valueHPosition[i], windowWidth - valueWidth, 'left');
        window.drawText(value, 200, valueHPosition[i], valueWidth, 'right');
    }
}
//</editor-fold>
//<editor-fold desc="TODO: Scene_Shop">
Scene_Shop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_shop");
    this.createBackgroundWindow("menu_buy", false);
    this.createBackgroundWindow("menu_sell", false);
    yg.scene.shop.create.call(this);
}
Scene_Shop.prototype.commandBuy = function() {
    this._buyBackgoundWindow.show();
    yg.scene.shop.commandBuy.call(this);
};
Scene_Shop.prototype.onBuyCancel = function() {
    this._buyBackgoundWindow.hide();
    yg.scene.shop.onBuyCancel.call(this);
};
Scene_Shop.prototype.commandSell = function() {
    this._sellBackgroundWindow.show();
    yg.scene.shop.commandSell.call(this);
};
Scene_Shop.prototype.onCategoryCancel = function() {
    this._sellBackgroundWindow.hide();
    yg.scene.shop.onCategoryCancel.call(this);
};
Window_ShopNumber.prototype.refresh = function () {
    yg.window.shopNumber.refresh.call(this);
    if ($gameTemp.isGreedShop() && !TMPlugin.GreedShop.HideMaterialFromNumberWindow) {
        this.y += 0;
        this.drawTotalMaterial();
    }
};
Window_ShopBuy.prototype.drawItem = function(index) {
    let item = this._data[index];
    let rect = this.itemRect(index);
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    if ($gameTemp.isGreedShop() && TMPlugin.GreedShop.HidePrice) {
        this.drawItemName(item, rect.x +26, rect.y, rect.width);
        this.changePaintOpacity(true);
    } else {
        this.drawItemName(item, rect.x + 26, rect.y, rect.width);
        this.contents.fontSize = Yanfly.Param.GoldFontSize;
        let itemPrice = Yanfly.Util.toGroup(this.price(item));
        this.drawText(itemPrice, rect.x, rect.y, rect.width, 'right');
        this.changePaintOpacity(true);
        this.resetFontSettings();
    }
};

//<editor-fold desc="TODO: Add text 'Ingredients:' to Material_Window">
Window_Material.prototype.windowHeight = function () {
    let n = this._materials.length + this.lineHeight();
    return this.fittingHeight(n);
};
Window_Material.prototype.refresh = function () {
    this.move(this.x, this.y, this.width, this.windowHeight());
    this.createContents();
    this.drawText("Ingredients:", 0 + this.textPadding(), 0, this.contents.width, 'left');
    for (var i = 0; i < this._materials.length; i++) {
        let material = this._materials[i];
        let item = DataManager.materialToItem(material);
        let need = material.need;
        let n = $gameParty.numItems(item);
        this.changePaintOpacity(n >= need);
        this.drawItemName(item, 0, this.lineHeight() * (i+1));
        //    var text = DataManager.isConsumableMaterial(item) ? '' + need + '/' : '--/';
        //    text += ('   ' + n).substr(-3);
        let text = DataManager.isConsumableMaterial(item) ? '' + n + ' /' : '--/';
        text += (' ' + need).substr(-3);
        this.drawText(text, 0, this.lineHeight() * (i+1), this.contents.width, 'right');
    }
};
//</editor-fold>

//</editor-fold>
//<editor-fold desc="TODO: Scene_Skill">
Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_skill");
    yg.scene.skill.create.call(this);
}
Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        let w = this.width - this.padding * 2;
        let h = this.height - this.padding * 2;
        let y = h / 2 - this.lineHeight() * 1.5;
        let width = w - 162 - this.textPadding();
        // this.drawActorFace(this._actor, 0, 0, 144, h);
        this.drawActorSimpleStatus(this._actor, 0, y, width);
    }
};
Window_SkillStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    let lineHeight = this.lineHeight();
    y = 0;
    width = this.width - this.padding * 2;
    this.drawActorLevel(actor, x, y);
    this.drawActorHp(actor, x, y + lineHeight, width);
    this.drawActorMp(actor, x, y + lineHeight * 2, width);
    if (Yanfly.Param.MenuTpGauge) {
        this.drawActorTp(actor, x, y + lineHeight * 3, width);
    }
};
Window_SkillList.prototype.drawItem = function(index) {
    let skill = this._data[index];
    if (skill) {
        let costWidth = this.costWidth();
        let rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x + 26, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
//</editor-fold>
//<editor-fold desc="TODO: Scene_Options">
Scene_Options.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_options");
    yg.scene.options.create.call(this);
    this.setHelpWindow();
}
//</editor-fold>
//<editor-fold desc="TODO: Scene_File">
Scene_File.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_save_load");
    yg.scene.file.create.call(this);
}
//</editor-fold>
//<editor-fold desc="TODO: Scene_Item">
Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_item");
    yg.scene.item.create.call(this);
}
Window_ItemCategory.prototype.itemRect = function(index) {
    let rect = new Rectangle();
    let maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY + 15;
    return rect;
};
Window_ItemList.prototype.drawItem = function(index) {
    let item = this._data[index];
    if (item) {
        let numberWidth = this.numberWidth();
        let rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x + 26, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
//</editor-fold>
//<editor-fold desc="TODO: Scene_Equip">
Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_equip");
    yg.scene.equip.create.call(this);
}
Window_EquipSlot.prototype.maxCols = function () {
    return 3;
}
Window_EquipSlot.prototype.itemRect = function (index) {
    let rect = new Rectangle();
    rect.width = this.width / 3;
    let maxCols = this.maxCols();
    rect.height = this.itemHeight();
    switch (index) {
        case 0:
            rect.x = 0;
            break;
        case 1:
            rect.x = rect.width;
            break;
        case 2:
            rect.x = rect.width * 2;
            break;
    }
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};
Window_EquipSlot.prototype.drawItem = function (index) {
    if (this._actor) {
        let rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawCategoryName(this.slotName(index), rect.x, rect.y, 138, this.lineHeight(), index);
        let x = 0;
        if (this._actor.equips()[index]) {
            switch(index) {
                case 0:
                    x = (277-4)/2 - 36/2 - (Array.from(this._actor.equips()[index].name.split('')).length*12)/2 + 4 - 23;
                    break;
                case 1:
                    x = 277 + 278/2 - 36/2 - (Array.from(this._actor.equips()[index].name.split('')).length*12)/2 - 24;
                    break;
                case 2:
                    x = 277 + 278 + 277/2 - 36/2 - (Array.from(this._actor.equips()[index].name.split('')).length*12)/2 - 24;
                    break;
            }
        }
        this.drawItemName(this._actor.equips()[index], x, rect.y + this.lineHeight(), 277, rect);
        this.changePaintOpacity(true);
    }
};
Window_EquipSlot.prototype.drawCategoryName = function (text, x, y, maxWidth, align, index) {
    let xPos = x + this.itemRectForText(index).width / 2 - (Array.from(text.split('')).length * 12) / 2;
    this.contents.drawText(text, xPos, y, maxWidth, this.lineHeight(), align);
};
Window_EquipSlot.prototype.drawItemName = function (item, x, y, width, rect) {
    width = width || 277;
    if (item) {
        let iconBoxWidth = this.lineHeight();
        let padding = (iconBoxWidth - Window_Base._iconWidth) / 2;

        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + padding, y + padding);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};
Window_EquipSlot.prototype.drawIcon = function (iconIndex, x, y) {
    let bitmap = ImageManager.loadSystem('IconSet');
    let pw = Window_Base._iconWidth;
    let ph = Window_Base._iconHeight;
    let sx = iconIndex % 16 * pw;
    let sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
Window_EquipSlot.prototype.drawText = function (text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};
Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        let x = 0; let y = this.lineHeight(); let factorY = 2;
        for (let i = 2; i < this._actor._arrParam.length; i++) {
            if ((i-2)%3 === 0 && i !== (this._actor._arrParam.length - 1) && i !== 2) {
                x += this.width / 3;
                factorY = 2;
            }
            let tempY = y * (factorY - 2);
            factorY++;
            this.drawItem(x, tempY, i);
        }
    }
};
Object.defineProperties(Game_BattlerBase.prototype, {
    _arrParam: {
        get: function() {
            return [
                {param: this.mhp, name: 'Max HP'},
                {param: this.mmp, name: 'Max MP'},

                {param: this.atk, name: 'Attack'},
                {param: this.def, name: 'Defence'},
                {param: this.mat, name: 'Mag.Atk'},
                {param: this.mdf, name: 'Mag.Def'},
                {param: this.agi, name: 'Speed'},
                {param: this.luk, name: 'Luck'},
                {param: this.hit, name: 'Accuracy'},
                {param: this.cri, name: 'Crit'},
                {param: this.eva, name: 'Dodge'}
            ];
        }, configurable: true
    }
});
Window_EquipStatus.prototype.drawParamName = function (x, y, paramId) {
    this.changeTextColor(this.systemColor());
    this.drawText(this._actor._arrParam[paramId].name, x, y, 120);
};
Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId) {
    this.resetTextColor();
    if (paramId < 8) x-= 20;
    if (paramId - 2 > 5) {
        this.drawText(Math.round(this._actor._arrParam[paramId].param * 100) + '%', x, y, 48, 'right');
        return;
    }
    this.drawText(this._actor._arrParam[paramId].param, x, y, 48, 'right');
};
Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId) {
    let newValue = this._tempActor._arrParam[paramId].param;
    let diffValue = newValue - this._actor._arrParam[paramId].param;
    this.changeTextColor(this.paramchangeTextColor(diffValue));
    if (paramId < 8) x-= 20;
    if (paramId - 2 > 5) {
        this.drawText(Math.round(newValue * 100) + '%', x, y, 48, 'right');
        return;
    }
    this.drawText(newValue, x, y, 48, 'right');
};
Window_EquipStatus.prototype.drawItem = function (x, y, paramId) {
    this.drawParamName(x + this.textPadding(), y, paramId);
    if (this._actor) {
        this.drawCurrentParam(x + 120, y, paramId);
    }
    this.drawRightArrow(x + 170, y, paramId);
    if (this._tempActor) {
        this.drawNewParam(x + 205, y, paramId);
    }
};
//</editor-fold>
//<editor-fold desc="TODO: Scene_Status">
Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_status");
    yg.scene.status.create.call(this);
}
//</editor-fold>
//<editor-fold desc="TODO: Scene_Recollection">
Scene_Recollection.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createBackgroundWindow("menu_Recollection");
    yg.scene.recollection.create.call(this);
}
//</editor-fold>
//<editor-fold desc="TODO: Scene_Battle">
Scene_Battle.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatus();
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};

Window_ActorCommand.prototype.maxCols = function () {
    return 2;
};
Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    // this.drawActorName(actor, rect.x + 0, rect.y, 150);
    this.drawActorIcons(actor, rect.x + 535, rect.y + 75, rect.width - 156);
};
Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    let icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (let i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
    }
};
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    let totalArea = this.gaugeAreaWidth();
    // let hpW = Math.floor(/*parseInt(*/totalArea * 201 / 315)/*)*/;
    // let mpW = Math.floor(/*parseInt(*/totalArea * 114 / 315)/*)*/;
    let hpW = totalArea - 18;
    let mpW = totalArea - 18;
    this.drawActorHp(actor, rect.x + 18, rect.y, hpW);
    this.drawActorMp(actor, rect.x + 18, rect.y + this.lineHeight(), mpW);
};
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    return (this.width + this.standardPadding()) / 1.25;
};
Spriteset_Battle.prototype.createBattleField = function() {
    let width = Graphics.boxWidth;
    let height = Graphics.boxHeight;
    let x = (Graphics.width - width) / 2;
    let y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y + 50;
    this._baseSprite.addChild(this._battleField);
};

//<editor-fold desc="Show backBorder image">
Game_Actor.prototype.performDamage = function () {
    yg.game.actor.performDamage.call(this);
    $gameScreen.showPicture(2, 'cmbt_bg_dmg_rcvd', 0, 0, 520, 100, 100, 255, 0);
};
Game_Actor.prototype.performAction = function (action) {
    yg.game.actor.performAction.call(this, action);
    if (action.isAttack()) {
        $gameScreen.showPicture(2, 'cmbt_bg_attack', 0, 0, 520, 100, 100, 255, 0);
    } else if (action.isMagicSkill() && action.isHpRecover()) {
        $gameScreen.showPicture(2, 'cmbt_bg_heal', 0, 0, 520, 100, 100, 255, 0);
    } else if (action.isMagicSkill() && action.isForFriend()) {
        $gameScreen.showPicture(2, 'cmbt_bg_buff', 0, 0, 520, 100, 100, 255, 0);
    } else if (action.isMagicSkill()) {
        $gameScreen.showPicture(2, 'cmbt_bg_skill', 0, 0, 520, 100, 100, 255, 0);
    } else if (action.isSkill() && !action.isGuard()) {
        $gameScreen.showPicture(2, 'cmbt_bg_skill', 0, 0, 520, 100, 100, 255, 0);
    }
};
BattleManager.endTurn = function () {
    $gameScreen.erasePicture(2);
    yg.manager.battle.endTurn.call(this);
};
BattleManager.processVictory = function () {
    $gameScreen.erasePicture(2);
    yg.manager.battle.processVictory.call(this);
};
//</editor-fold>
//<editor-fold desc="Dont show actor face in Window_VictoryExp">
Window_VictoryExp.prototype.drawItem = function (index) {
    let actor = $gameParty.battleMembers()[index];
    if (!actor) return;
    // this.drawActorProfile(actor, index);
};
//</editor-fold>

//<editor-fold desc="TODO: ReDraw VictoryDrop">
/**
 * Fix value draw doubled
 */
Game_Party.prototype.maxBattleMembers = function() {
    return 1;
};

Window_VictoryDrop.prototype.maxCols = function () {
    return 1;
};
Window_VictoryDrop.prototype.drawGold = function (item, index) {
    if (item !== 'gold') return;
    let rect = this.itemRect(index);
    rect.width -= this.textPadding();
    let value = BattleManager._rewards.gold;
    let currency = TextManager.currencyUnit;
    this.drawText("Gold", rect.x + 5 + this.textPadding(), rect.y + 50, rect.width, "left");
    this.drawCurrencyValue(value, currency, rect.x + 5, rect.y + 50, rect.width);
};
Window_VictoryDrop.prototype.drawDrop = function (item, index) {
    if (!DataManager.isItem(item) && !DataManager.isWeapon(item) &&
        !DataManager.isArmor(item)) return;
    let rect = this.itemRect(index);
    rect.width -= this.textPadding();
    this.drawItemName(item, rect.x + 5, rect.y + 15, rect.width);
    this.drawItemNumber(item, rect.x, rect.y + 15, rect.width);
};
Window_ItemList.prototype.initialize = function (x, y, width, height) {
    Galv.CI.Window_Selectable_initialize.call(this, x, y, width, height);
    if (yg.utils.getObjectTypeName(SceneManager._scene) === "Scene_Battle" && BattleManager.isVictoryPhase()) { return; }
    this.createGalvCursor();
};
Window_ItemList.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (yg.utils.getObjectTypeName(SceneManager._scene) === "Scene_Battle" && BattleManager.isVictoryPhase()) {return;}
    yg.window.itemList.update.call(this);
};
Sprite_GalvCursor.prototype.createImage = function() {
    this.bitmap = ImageManager.loadSystem(Galv.CI.image);
    this._frameWidth = 48;
    this._frameHeight = 48;
    this._maxPattern = Galv.CI.frames - 1;
    this._tickSpeed = Galv.CI.animSpeed;
    this.anchor.y = 0.5;
    this.opacity = 0;
};
//</editor-fold>


/**
 * Take more gold, if actor has skill 38 id
 */
BattleManager.makeRewards = function() {
    this._rewards = {};

    // Take more gold, if actor has skill 38 id
    let goldMultiplier = 1;
    if ($gameActors.actor(1).hasSkill(38)) {
        goldMultiplier += 0.25;
    }
    this._rewards.gold = Math.floor($gameTroop.goldTotal() * goldMultiplier);

    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};
//</editor-fold>
//<editor-fold desc="TODO: Scene_Quest">
Scene_Quest.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackgroundWindow("menu_Recollection");
    yg.scene.quest.create.call(this);
}
Window_QuestCategories.prototype.drawItem = function(index) {
    let rect = this.itemRectForText(index);
    let text = this.commandName(index);
    let align = this.settings('Text Alignment');
    let wx = 0;
    let ww = rect.width;
    if (align === 'left') {
        wx = rect.x;
    } else if (align === 'center') {
        wx += (ww - this.textWidthEx(text)) / 2;
    } else {
        wx += ww - this.textWidthEx(text) - this.textPadding();
    }
    this.drawTextEx(text, wx+13, rect.y);
};
//</editor-fold>
//</editor-fold>

