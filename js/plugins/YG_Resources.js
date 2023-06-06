//#region TDDP_PreloadManager.js Set 'system' & 'picture' array for bootPreloadImages
/*:
* @requiredAssets audio/nbgs/port_2bgm
* @requiredAssets audio/nbgs/night
* @requiredAssets audio/nbgs/bar_2bgm
* @requiredAssets audio/nbgs/desertcave_2bgm
* @requiredAssets audio/nbgs/Drips_2bgm
* @requiredAssets audio/nbgs/forest_2bgm
* @requiredAssets audio/nbgs/forest2_2bgm
* @requiredAssets audio/nbgs/foxgarden_2bgm
* @requiredAssets audio/nbgs/fwater_2bgm
* @requiredAssets audio/nbgs/winter_2bgm
* @requiredAssets img/system/destination
* @requiredAssets img/pictures/Title
*/

const yg = { public: {} };

ImageManager.loadSystem_Plug = function (filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, false);
}
ImageManager.loadTitle2_Plug = function (filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
}

yg.public.picturesForExcludeFromCharPosesPositionUpdate = [
    // "Human_Sex1"
];

yg.public.girlList = [
    {
        name: '\\N[4]',
        location: [
            'Greenvalley, Auntie\'s home.\n'
        ],
        description: [
            'Smart, reasonable, faithful wife\n' +
            'of Uncle Frank.'
        ], sprite: 'Aunt_Diary',
        varAff: 421,
        varAffLVL: 422,
        varAffLvlMax: 411
    },
];

TDDP.bootPreloadImages = {
    system: [
    ],
	animation: [
	],
	character: [		
    ],
    picture: [
    ],
};

var rngd_recollection_mode_settings = {
    "rec_cg_set": {
        "1": {
            "title": [, "Wolf doggystyle"],
            "common_event_id": 501,
            "switch_id": 401,
            "thumbnail": "YoungWolf_doggy_GAL",
            "pictures": ["menu_Recollection"],
            "item": 179
		},

        "2": {
            "title": [, "Titwolf doggystyle"],
            "common_event_id": 502,
            "switch_id": 402,
            "thumbnail": "Titwolf_doggy_GAL",
            "pictures": ["menu_Recollection"],
		},

        "3": {
            "title": [, "Froggy doggystyle"],
            "common_event_id": 503,
            "switch_id": 403,
            "thumbnail": "Froggy_doggy_GAL",
            "pictures": ["menu_Recollection"],
		},
		
        "4": {
            "title": [, "Mommyfly doggystyle"],
            "common_event_id": 504,
            "switch_id": 404,
            "thumbnail": "Mommyfly_doggy_GAL",
            "pictures": ["menu_Recollection"],
		},		

        "5": {
            "title": [, "Titwolf blowjob"],
            "common_event_id": 505,
            "switch_id": 405,
            "thumbnail": "Titwolf_BJ_GAL",
            "pictures": ["menu_Recollection"],
		},		
		
    },

    "rec_mode_bgm": {
        "bgm": {
            "name": "",
            "pan": 0,
            "pitch": 100,
            "volume": 40
        }

    },
    "rec_mode_window": {
        "x": 500,
        "y": 280,
        "recollection_title": "Scene Mode",
        "str_select_recollection": "Full replay",
//        "str_select_cg": "CG Mode",
        "str_select_back_title": "Exit"
    },
    "rec_list_window": {
        "item_height": 3,
        "item_width": 4,
        "show_title_text": true,
        "title_text_align": "center",
        "never_watch_picture_name": "never_watch_picture",
        "never_watch_title_text": " ???"
    },
    "sandbox_map_id": 2,
    "share_recollection_switches": false
};