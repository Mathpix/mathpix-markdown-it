"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFaIcons = exports.findSquaredIcon = exports.findIcon = exports.squaredIcons = exports.icons = void 0;
var tslib_1 = require("tslib");
///Users/olgaredozubova/Rab/MATHPIX/mathpix-markdown-it/node_modules/markdown-it-emoji/lib/data/full.json
var emoji_1 = require("./emoji");
var fa_icons_1 = require("./fa-icons");
// var emojies_defs      = require('markdown-it-emoji/lib/data/full.json');
exports.icons = [
    {
        symbol: "×",
        unicodeHex: "D7",
        code: 215,
        alias: "times",
        name: "multiplication_sign",
        nameUnicode: "MULTIPLICATION SIGN"
    },
    {
        symbol: "•",
        unicodeHex: "2022",
        code: 8226,
        alias: "",
        name: "bullet",
        nameUnicode: "BULLET"
    },
    {
        symbol: "※",
        unicodeHex: "203B",
        code: 8251,
        alias: "",
        name: "reference_mark",
        nameUnicode: "REFERENCE MARK"
    },
    {
        symbol: "←",
        unicodeHex: "2190",
        code: 8592,
        alias: "left_arrow",
        name: "leftwards_arrow",
        nameUnicode: "LEFTWARDS ARROW"
    },
    {
        symbol: "↑",
        unicodeHex: "2191",
        code: 8593,
        alias: "up_arrow",
        name: "upwards_arrow",
        nameUnicode: "UPWARDS ARROW"
    },
    {
        symbol: "→",
        unicodeHex: "2192",
        code: 8594,
        alias: "right_arrow",
        name: "rightwards_arrow",
        nameUnicode: "RIGHTWARDS ARROW"
    },
    {
        symbol: "↓",
        unicodeHex: "2193",
        code: 8595,
        alias: "down_arrow",
        name: "downwards_arrow",
        nameUnicode: "DOWNWARDS ARROW"
    },
    {
        symbol: "①",
        unicodeHex: "2460",
        code: 9312,
        alias: "circled_one",
        name: "circled_digit_one",
        nameUnicode: "CIRCLED DIGIT ONE"
    },
    {
        symbol: "②",
        unicodeHex: "2461",
        code: 9313,
        alias: "circled_two",
        name: "circled_digit_two",
        nameUnicode: "CIRCLED DIGIT TWO"
    },
    {
        symbol: "③",
        unicodeHex: "2462",
        code: 9314,
        alias: "circled_three",
        name: "circled_digit_three",
        nameUnicode: "CIRCLED DIGIT THREE"
    },
    {
        symbol: "④",
        unicodeHex: "2463",
        code: 9315,
        alias: "circled_four",
        name: "circled_digit_four",
        nameUnicode: "CIRCLED DIGIT FOUR"
    },
    {
        symbol: "⑤",
        unicodeHex: "2464",
        code: 9316,
        alias: "circled_five",
        name: "circled_digit_five",
        nameUnicode: "CIRCLED DIGIT FIVE"
    },
    {
        symbol: "⑥",
        unicodeHex: "2465",
        code: 9317,
        alias: "circled_six",
        name: "circled_digit_six",
        nameUnicode: "CIRCLED DIGIT SIX"
    },
    {
        symbol: "⑦",
        unicodeHex: "2466",
        code: 9318,
        alias: "circled_seven",
        name: "circled_digit_seven",
        nameUnicode: "CIRCLED DIGIT SEVEN"
    },
    {
        symbol: "⑧",
        unicodeHex: "2467",
        code: 9319,
        alias: "circled_eight",
        name: "circled_digit_eight",
        nameUnicode: "CIRCLED DIGIT EIGHT"
    },
    {
        symbol: "⑨",
        unicodeHex: "2468",
        code: 9320,
        alias: "circled_nine",
        name: "circled_digit_nine",
        nameUnicode: "CIRCLED DIGIT NINE"
    },
    {
        symbol: "⓪",
        unicodeHex: "24EA",
        code: 9450,
        alias: "circled_zero",
        name: "circled_digit_zero",
        nameUnicode: "CIRCLED DIGIT ZERO"
    },
    {
        symbol: "■",
        unicodeHex: "25A0",
        code: 9632,
        alias: "",
        name: "black_square",
        nameUnicode: "BLACK SQUARE"
    },
    {
        symbol: "▲",
        unicodeHex: "25B2",
        code: 9650,
        alias: "black_triangle",
        name: "black_up_pointing_triangle",
        nameUnicode: "BLACK UP-POINTING TRIANGLE"
    },
    {
        symbol: "▼",
        unicodeHex: "25BC",
        code: 9660,
        alias: "black_triangle_down",
        name: "black_down_pointing_triangle",
        nameUnicode: "BLACK DOWN-POINTING TRIANGLE"
    },
    {
        symbol: "▶",
        unicodeHex: "25B6",
        code: 9654,
        alias: "black_triangle_right",
        name: "black_right_pointing_triangle",
        nameUnicode: "BLACK RIGHT-POINTING TRIANGLE"
    },
    {
        symbol: "◀",
        unicodeHex: "25C0",
        code: 9664,
        alias: "black_triangle_left",
        name: "black_left_pointing_triangle",
        nameUnicode: "BLACK LEFT-POINTING TRIANGLE"
    },
    {
        symbol: "△",
        unicodeHex: "25B3",
        code: 9651,
        alias: "triangle",
        name: "white_up_pointing_triangle",
        nameUnicode: "WHITE UP-POINTING TRIANGLE"
    },
    {
        symbol: "▽",
        unicodeHex: "25BD",
        code: 9661,
        alias: "triangle_down",
        name: "white_down_pointing_triangle",
        nameUnicode: "WHITE DOWN-POINTING TRIANGLE"
    },
    {
        symbol: "▷",
        unicodeHex: "25B7",
        code: 9655,
        alias: "triangle_right",
        name: "white_right_pointing_triangle",
        nameUnicode: "WHITE RIGHT-POINTING TRIANGLE"
    },
    {
        symbol: "◁",
        unicodeHex: "25C1",
        code: 9665,
        alias: "triangle_left",
        name: "white_left_pointing_triangle",
        nameUnicode: "WHITE LEFT-POINTING TRIANGLE"
    },
    {
        symbol: "○",
        unicodeHex: "25CB",
        code: 9675,
        alias: "circle",
        name: "white_circle",
        nameUnicode: "WHITE CIRCLE"
    },
    {
        symbol: "●",
        unicodeHex: "25CF",
        code: 9679,
        alias: "",
        name: "black_circle",
        nameUnicode: "BLACK CIRCLE"
    },
    {
        symbol: "◎",
        unicodeHex: "25CE",
        code: 9678,
        alias: "",
        name: "bullseye",
        nameUnicode: "BULLSEYE"
    },
    {
        symbol: "★",
        unicodeHex: "2605",
        code: 9733,
        alias: "",
        name: "black_star",
        nameUnicode: "BLACK STAR"
    },
    {
        symbol: "☆",
        unicodeHex: "2606",
        code: 9734,
        alias: "star",
        name: "white_star",
        nameUnicode: "WHITE STAR"
    },
    {
        symbol: "☹",
        unicodeHex: "2639",
        code: 9785,
        alias: "sad_face",
        name: "white_frowning_face",
        nameUnicode: "WHITE FROWNING FACE"
    },
    {
        symbol: "☺",
        unicodeHex: "263A",
        code: 9786,
        alias: "smiley",
        name: "white_smiling_face",
        nameUnicode: "WHITE SMILING FACE"
    },
    {
        symbol: "☻",
        unicodeHex: "263B",
        code: 9787,
        alias: "black_smiley",
        name: "black_smiling_face",
        nameUnicode: "BLACK SMILING FACE"
    },
    {
        symbol: "♡",
        unicodeHex: "2661",
        code: 9825,
        alias: "heart",
        name: "white_heart_suit",
        nameUnicode: "WHITE HEART SUIT"
    },
    {
        symbol: "♥",
        unicodeHex: "2665",
        code: 9829,
        alias: "black_heart",
        name: "black_heart_suit",
        nameUnicode: "BLACK HEART SUIT"
    },
    {
        symbol: "♨",
        unicodeHex: "2668",
        code: 9832,
        alias: "",
        name: "hot_springs",
        nameUnicode: "HOT SPRINGS"
    },
    {
        symbol: "⦾",
        unicodeHex: "29BE",
        code: 10686,
        alias: "",
        name: "circled_white_bullet",
        nameUnicode: "CIRCLED WHITE BULLET"
    },
    {
        symbol: "⦿",
        unicodeHex: "29BF",
        code: 10687,
        alias: "",
        name: "circled_bullet",
        nameUnicode: "CIRCLED BULLET"
    },
    {
        symbol: "〈",
        unicodeHex: "3008",
        code: 12296,
        alias: "left_angle",
        name: "left_angle_bracket",
        nameUnicode: "LEFT ANGLE BRACKET"
    },
    {
        symbol: "〉",
        unicodeHex: "3009",
        code: 12297,
        alias: "right_angle",
        name: "right_angle_bracket",
        nameUnicode: "RIGHT ANGLE BRACKET"
    },
    {
        symbol: "・",
        unicodeHex: "30FB",
        code: 12539,
        alias: "middle_dot",
        name: "katakana_middle_dot",
        nameUnicode: "KATAKANA MIDDLE DOT"
    },
    {
        symbol: "☀",
        unicodeHex: "2600",
        code: 9728,
        alias: "black_sun",
        name: "black_sun_with_rays",
        nameUnicode: "BLACK SUN WITH RAYS"
    },
    {
        symbol: "☼",
        unicodeHex: "263C",
        code: 9788,
        alias: "sun",
        name: "white_sun_with_rays",
        nameUnicode: "WHITE SUN WITH RAYS"
    },
    {
        symbol: "☁",
        unicodeHex: "2601",
        code: 9729,
        alias: "",
        name: "cloud",
        nameUnicode: "CLOUD"
    },
    {
        symbol: "☂",
        unicodeHex: "2602",
        code: 9730,
        alias: "",
        name: "umbrella",
        nameUnicode: "UMBRELLA"
    },
    {
        symbol: "☃",
        unicodeHex: "2603",
        code: 9731,
        alias: "",
        name: "snowman",
        nameUnicode: "SNOWMAN"
    },
    {
        symbol: "☉",
        unicodeHex: "2609",
        code: 9737,
        alias: "astro_sun",
        name: "sun",
        nameUnicode: "SUN"
    },
    {
        symbol: "☽",
        unicodeHex: "263D",
        code: 9789,
        alias: "right_moon",
        name: "first_quarter_moon",
        nameUnicode: "FIRST QUARTER MOON"
    },
    {
        symbol: "☾",
        unicodeHex: "263E",
        code: 9790,
        alias: "left_moon",
        name: "last_quarter_moon",
        nameUnicode: "LAST QUARTER MOON"
    },
    {
        symbol: "☎",
        unicodeHex: "260E",
        code: 9742,
        alias: "",
        name: "black_telephone",
        nameUnicode: "BLACK TELEPHONE"
    },
    {
        symbol: "☏",
        unicodeHex: "260F",
        code: 9743,
        alias: "telephone",
        name: "white_telephone",
        nameUnicode: "WHITE TELEPHONE"
    },
    {
        symbol: "☖",
        unicodeHex: "2616",
        code: 9750,
        alias: "white_shogi",
        name: "white_shogi_piece",
        nameUnicode: "WHITE SHOGI PIECE"
    },
    {
        symbol: "☗",
        unicodeHex: "2617",
        code: 9751,
        alias: "black_shogi",
        name: "black_shogi_piece",
        nameUnicode: "BLACK SHOGI PIECE"
    },
    {
        symbol: "☘",
        unicodeHex: "2618",
        code: 9752,
        alias: "",
        name: "shamrock",
        nameUnicode: "SHAMROCK"
    },
    {
        symbol: "☚",
        unicodeHex: "261A",
        code: 9754,
        alias: "black_point_left",
        name: "black_left_pointing_index",
        nameUnicode: "BLACK LEFT POINTING INDEX"
    },
    {
        symbol: "☜",
        unicodeHex: "261C",
        code: 9756,
        alias: "white_point_left",
        name: "white_left_pointing_index",
        nameUnicode: "WHITE LEFT POINTING INDEX"
    },
    {
        symbol: "☛",
        unicodeHex: "261B",
        code: 9755,
        alias: "black_point_right",
        name: "black_right_pointing_index",
        nameUnicode: "BLACK RIGHT POINTING INDEX"
    },
    {
        symbol: "☞",
        unicodeHex: "261E",
        code: 9758,
        alias: "white_point_right",
        name: "white_right_pointing_index",
        nameUnicode: "WHITE RIGHT POINTING INDEX"
    },
    {
        symbol: "☝",
        unicodeHex: "261D",
        code: 9757,
        alias: "white_point_up",
        name: "white_up_pointing_index",
        nameUnicode: "WHITE UP POINTING INDEX"
    },
    {
        symbol: "☟",
        unicodeHex: "261F",
        code: 9759,
        alias: "white_point_down",
        name: "white_down_pointing_index",
        nameUnicode: "WHITE DOWN POINTING INDEX"
    },
    {
        symbol: "☠",
        unicodeHex: "2620",
        code: 9760,
        alias: "skull",
        name: "skull_and_crossbones",
        nameUnicode: "SKULL AND CROSSBONES"
    },
    {
        symbol: "☡",
        unicodeHex: "2621",
        code: 9761,
        alias: "caution",
        name: "caution_sign",
        nameUnicode: "CAUTION SIGN"
    },
    {
        symbol: "☢",
        unicodeHex: "2622",
        code: 9762,
        alias: "radiation",
        name: "radioactive_sign",
        nameUnicode: "RADIOACTIVE SIGN"
    },
    {
        symbol: "☣",
        unicodeHex: "2623",
        code: 9763,
        alias: "biohazard",
        name: "biohazard_sign",
        nameUnicode: "BIOHAZARD SIGN"
    },
    {
        symbol: "☯",
        unicodeHex: "262F",
        code: 9775,
        alias: "",
        name: "yin_yang",
        nameUnicode: "YIN YANG"
    },
    {
        symbol: "♀",
        unicodeHex: "2640",
        code: 9792,
        alias: "female",
        name: "female_sign",
        nameUnicode: "FEMALE SIGN"
    },
    {
        symbol: "♂",
        unicodeHex: "2642",
        code: 9794,
        alias: "male",
        name: "male_sign",
        nameUnicode: "MALE SIGN"
    },
    {
        symbol: "⚢",
        unicodeHex: "26A2",
        code: 9890,
        alias: "female_female",
        name: "doubled_female_sign",
        nameUnicode: "DOUBLED FEMALE SIGN"
    },
    {
        symbol: "⚣",
        unicodeHex: "26A3",
        code: 9891,
        alias: "male_male",
        name: "doubled_male_sign",
        nameUnicode: "DOUBLED MALE SIGN"
    },
    {
        symbol: "⚤",
        unicodeHex: "26A4",
        code: 9892,
        alias: "female_male",
        name: "interlocked_female_and_male_sign",
        nameUnicode: "INTERLOCKED FEMALE AND MALE SIGN"
    },
    {
        symbol: "⚥",
        unicodeHex: "26A5",
        code: 9893,
        alias: "hermaphrodite",
        name: "male_and_female_sign",
        nameUnicode: "MALE AND FEMALE SIGN"
    },
    {
        symbol: "⚦",
        unicodeHex: "26A6",
        code: 9894,
        alias: "male_stroke",
        name: "male_with_stroke_sign",
        nameUnicode: "MALE WITH STROKE SIGN"
    },
    {
        symbol: "⚧",
        unicodeHex: "26A7",
        code: 9895,
        alias: "transgender",
        name: "male_with_stroke_and_male_and_female_sign",
        nameUnicode: "MALE WITH STROKE AND MALE AND FEMALE SIGN"
    },
    {
        symbol: "⚨",
        unicodeHex: "26A8",
        code: 9896,
        alias: "male_stroke_v",
        name: "vertical_male_with_stroke_sign",
        nameUnicode: "VERTICAL MALE WITH STROKE SIGN"
    },
    {
        symbol: "⚩",
        unicodeHex: "26A9",
        code: 9897,
        alias: "male_stroke_h",
        name: "horizontal_male_with_stroke_sign",
        nameUnicode: "HORIZONTAL MALE WITH STROKE SIGN"
    },
    {
        symbol: "☿",
        unicodeHex: "263F",
        code: 9791,
        alias: "",
        name: "mercury",
        nameUnicode: "MERCURY"
    },
    {
        symbol: "♀",
        unicodeHex: "2640",
        code: 9792,
        alias: "venus",
        name: "venus",
        nameUnicode: "FEMALE SIGN"
    },
    {
        symbol: "♂",
        unicodeHex: "2642",
        code: 9794,
        alias: "mars",
        name: "mars",
        nameUnicode: "MALE SIGN"
    },
    {
        symbol: "♁",
        unicodeHex: "2641",
        code: 9793,
        alias: "",
        name: "earth",
        nameUnicode: "EARTH"
    },
    {
        symbol: "♃",
        unicodeHex: "2643",
        code: 9795,
        alias: "",
        name: "jupiter",
        nameUnicode: "JUPITER"
    },
    {
        symbol: "♄",
        unicodeHex: "2644",
        code: 9796,
        alias: "",
        name: "saturn",
        nameUnicode: "SATURN"
    },
    {
        symbol: "♅",
        unicodeHex: "2645",
        code: 9797,
        alias: "",
        name: "uranus",
        nameUnicode: "URANUS"
    },
    {
        symbol: "♆",
        unicodeHex: "2646",
        code: 9798,
        alias: "",
        name: "neptune",
        nameUnicode: "NEPTUNE"
    },
    {
        symbol: "♇",
        unicodeHex: "2647",
        code: 9799,
        alias: "",
        name: "pluto",
        nameUnicode: "PLUTO"
    },
    {
        symbol: "♔",
        unicodeHex: "2654",
        code: 9812,
        alias: "chess_king",
        name: "white_chess_king",
        nameUnicode: "WHITE CHESS KING"
    },
    {
        symbol: "♕",
        unicodeHex: "2655",
        code: 9813,
        alias: "chess_queen",
        name: "white_chess_queen",
        nameUnicode: "WHITE CHESS QUEEN"
    },
    {
        symbol: "♖",
        unicodeHex: "2656",
        code: 9814,
        alias: "chess_rook",
        name: "white_chess_rook",
        nameUnicode: "WHITE CHESS ROOK"
    },
    {
        symbol: "♗",
        unicodeHex: "2657",
        code: 9815,
        alias: "chess_bishop",
        name: "white_chess_bishop",
        nameUnicode: "WHITE CHESS BISHOP"
    },
    {
        symbol: "♘",
        unicodeHex: "2658",
        code: 9816,
        alias: "chess_knight",
        name: "white_chess_knight",
        nameUnicode: "WHITE CHESS KNIGHT"
    },
    {
        symbol: "♙",
        unicodeHex: "2659",
        code: 9817,
        alias: "chess_pawn",
        name: "white_chess_pawn",
        nameUnicode: "WHITE CHESS PAWN"
    },
    {
        symbol: "♚",
        unicodeHex: "265A",
        code: 9818,
        alias: "",
        name: "black_chess_king",
        nameUnicode: "BLACK CHESS KING"
    },
    {
        symbol: "♛",
        unicodeHex: "265B",
        code: 9819,
        alias: "",
        name: "black_chess_queen",
        nameUnicode: "BLACK CHESS QUEEN"
    },
    {
        symbol: "♜",
        unicodeHex: "265C",
        code: 9820,
        alias: "",
        name: "black_chess_rook",
        nameUnicode: "BLACK CHESS ROOK"
    },
    {
        symbol: "♝",
        unicodeHex: "265D",
        code: 9821,
        alias: "",
        name: "black_chess_bishop",
        nameUnicode: "BLACK CHESS BISHOP"
    },
    {
        symbol: "♞",
        unicodeHex: "265E",
        code: 9822,
        alias: "",
        name: "black_chess_knight",
        nameUnicode: "BLACK CHESS KNIGHT"
    },
    {
        symbol: "♟",
        unicodeHex: "265F",
        code: 9823,
        alias: "",
        name: "black_chess_pawn",
        nameUnicode: "BLACK CHESS PAWN"
    },
    {
        symbol: "♠",
        unicodeHex: "2660",
        code: 9824,
        alias: "black_spades",
        name: "black_spade_suit",
        nameUnicode: "BLACK SPADE SUIT"
    },
    {
        symbol: "♤",
        unicodeHex: "2664",
        code: 9828,
        alias: "spades",
        name: "white_spade_suit",
        nameUnicode: "WHITE SPADE SUIT"
    },
    {
        symbol: "♦",
        unicodeHex: "2666",
        code: 9830,
        alias: "black_diamonds",
        name: "black_diamond_suit",
        nameUnicode: "BLACK DIAMOND SUIT"
    },
    {
        symbol: "♢",
        unicodeHex: "2662",
        code: 9826,
        alias: "diamonds",
        name: "white_diamond_suit",
        nameUnicode: "WHITE DIAMOND SUIT"
    },
    {
        symbol: "♣",
        unicodeHex: "2663",
        code: 9827,
        alias: "black_clubs",
        name: "black_club_suit",
        nameUnicode: "BLACK CLUB SUIT"
    },
    {
        symbol: "♧",
        unicodeHex: "2667",
        code: 9831,
        alias: "clubs",
        name: "white_club_suit",
        nameUnicode: "WHITE CLUB SUIT"
    },
    {
        symbol: "♩",
        unicodeHex: "2669",
        code: 9833,
        alias: "",
        name: "quarter_note",
        nameUnicode: "QUARTER NOTE"
    },
    {
        symbol: "♪",
        unicodeHex: "266A",
        code: 9834,
        alias: "",
        name: "eighth_note",
        nameUnicode: "EIGHTH NOTE"
    },
    {
        symbol: "♫",
        unicodeHex: "266B",
        code: 9835,
        alias: "two_notes",
        name: "beamed_eighth_notes",
        nameUnicode: "BEAMED EIGHTH NOTES"
    },
    {
        symbol: "♬",
        unicodeHex: "266C",
        code: 9836,
        alias: "sixteenth_notes",
        name: "beamed_sixteenth_notes",
        nameUnicode: "BEAMED SIXTEENTH NOTES"
    },
    {
        symbol: "♭",
        unicodeHex: "266D",
        code: 9837,
        alias: "flat",
        name: "music_flat_sign",
        nameUnicode: "MUSIC FLAT SIGN"
    },
    {
        symbol: "♮",
        unicodeHex: "266E",
        code: 9838,
        alias: "natural",
        name: "music_natural_sign",
        nameUnicode: "MUSIC NATURAL SIGN"
    },
    {
        symbol: "♯",
        unicodeHex: "266F",
        code: 9839,
        alias: "sharp",
        name: "music_sharp_sign",
        nameUnicode: "MUSIC SHARP SIGN"
    },
    {
        symbol: "♰",
        unicodeHex: "2670",
        code: 9840,
        alias: "west_cross",
        name: "west_syriac_cross",
        nameUnicode: "WEST SYRIAC CROSS"
    },
    {
        symbol: "♱",
        unicodeHex: "2671",
        code: 9841,
        alias: "east_cross",
        name: "east_syriac_cross",
        nameUnicode: "EAST SYRIAC CROSS"
    },
    {
        symbol: "♲",
        unicodeHex: "2672",
        code: 9842,
        alias: "recycle",
        name: "universal_recycling_symbol",
        nameUnicode: "UNIVERSAL RECYCLING SYMBOL"
    },
    {
        symbol: "♳",
        unicodeHex: "2673",
        code: 9843,
        alias: "recycle_plastics_1",
        name: "recycling_symbol_for_type_1_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-1 PLASTICS"
    },
    {
        symbol: "♴",
        unicodeHex: "2674",
        code: 9844,
        alias: "recycle_plastics_2",
        name: "recycling_symbol_for_type_2_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-2 PLASTICS"
    },
    {
        symbol: "♵",
        unicodeHex: "2675",
        code: 9845,
        alias: "recycle_plastics_3",
        name: "recycling_symbol_for_type_3_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-3 PLASTICS"
    },
    {
        symbol: "♶",
        unicodeHex: "2676",
        code: 9846,
        alias: "recycle_plastics_4",
        name: "recycling_symbol_for_type_4_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-4 PLASTICS"
    },
    {
        symbol: "♷",
        unicodeHex: "2677",
        code: 9847,
        alias: "recycle_plastics_5",
        name: "recycling_symbol_for_type_5_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-5 PLASTICS"
    },
    {
        symbol: "♸",
        unicodeHex: "2678",
        code: 9848,
        alias: "recycle_plastics_6",
        name: "recycling_symbol_for_type_6_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-6 PLASTICS"
    },
    {
        symbol: "♹",
        unicodeHex: "2679",
        code: 9849,
        alias: "recycle_plastics_7",
        name: "recycling_symbol_for_type_7_plastics",
        nameUnicode: "RECYCLING SYMBOL FOR TYPE-7 PLASTICS"
    },
    {
        symbol: "♺",
        unicodeHex: "267A",
        code: 9850,
        alias: "recycle_generic_materials",
        name: "recycling_symbol_for_generic_materials",
        nameUnicode: "RECYCLING SYMBOL FOR GENERIC MATERIALS"
    },
    {
        symbol: "♻",
        unicodeHex: "267B",
        code: 9851,
        alias: "black_recycle",
        name: "black_universal_recycling_symbol",
        nameUnicode: "BLACK UNIVERSAL RECYCLING SYMBOL"
    },
    {
        symbol: "♼",
        unicodeHex: "267C",
        code: 9852,
        alias: "recycled_paper",
        name: "recycled_paper_symbol",
        nameUnicode: "RECYCLED PAPER SYMBOL"
    },
    {
        symbol: "♽",
        unicodeHex: "267D",
        code: 9853,
        alias: "partially_recycled_paper",
        name: "partially_recycled_paper_symbol",
        nameUnicode: "PARTIALLY-RECYCLED PAPER SYMBOL"
    },
    {
        symbol: "♾",
        unicodeHex: "267E",
        code: 9854,
        alias: "acid_free",
        name: "permanent_paper_sign",
        nameUnicode: "PERMANENT PAPER SIGN"
    },
    {
        symbol: "♿",
        unicodeHex: "267F",
        code: 9855,
        alias: "wheelchair",
        name: "wheelchair_symbol",
        nameUnicode: "WHEELCHAIR SYMBOL"
    },
    {
        symbol: "⚀",
        unicodeHex: "2680",
        code: 9856,
        alias: "dice_1",
        name: "die_face_1",
        nameUnicode: "DIE FACE-1"
    },
    {
        symbol: "⚁",
        unicodeHex: "2681",
        code: 9857,
        alias: "dice_2",
        name: "die_face_2",
        nameUnicode: "DIE FACE-2"
    },
    {
        symbol: "⚂",
        unicodeHex: "2682",
        code: 9858,
        alias: "dice_3",
        name: "die_face_3",
        nameUnicode: "DIE FACE-3"
    },
    {
        symbol: "⚃",
        unicodeHex: "2683",
        code: 9859,
        alias: "dice_4",
        name: "die_face_4",
        nameUnicode: "DIE FACE-4"
    },
    {
        symbol: "⚄",
        unicodeHex: "2684",
        code: 9860,
        alias: "dice_5",
        name: "die_face_5",
        nameUnicode: "DIE FACE-5"
    },
    {
        symbol: "⚅",
        unicodeHex: "2685",
        code: 9861,
        alias: "dice_6",
        name: "die_face_6",
        nameUnicode: "DIE FACE-6"
    },
    {
        symbol: "⚆",
        unicodeHex: "2686",
        code: 9862,
        alias: "circled_right_dot",
        name: "white_circle_with_dot_right",
        nameUnicode: "WHITE CIRCLE WITH DOT RIGHT"
    },
    {
        symbol: "⚇",
        unicodeHex: "2687",
        code: 9863,
        alias: "circled_two_dots",
        name: "white_circle_with_two_dots",
        nameUnicode: "WHITE CIRCLE WITH TWO DOTS"
    },
    {
        symbol: "⚈",
        unicodeHex: "2688",
        code: 9864,
        alias: "black_circled_right_dot",
        name: "black_circle_with_white_dot_right",
        nameUnicode: "BLACK CIRCLE WITH WHITE DOT RIGHT"
    },
    {
        symbol: "⚉",
        unicodeHex: "2689",
        code: 9865,
        alias: "black_circled_two_dots",
        name: "black_circle_with_two_white_dots",
        nameUnicode: "BLACK CIRCLE WITH TWO WHITE DOTS"
    },
    {
        symbol: "⚐",
        unicodeHex: "2690",
        code: 9872,
        alias: "flag",
        name: "white_flag",
        nameUnicode: "WHITE FLAG"
    },
    {
        symbol: "⚑",
        unicodeHex: "2691",
        code: 9873,
        alias: "",
        name: "black_flag",
        nameUnicode: "BLACK FLAG"
    },
    {
        symbol: "⚔",
        unicodeHex: "2694",
        code: 9876,
        alias: "swords",
        name: "crossed_swords",
        nameUnicode: "CROSSED SWORDS"
    },
    {
        symbol: "⚘",
        unicodeHex: "2698",
        code: 9880,
        alias: "",
        name: "flower",
        nameUnicode: "FLOWER"
    },
    {
        symbol: "⚙",
        unicodeHex: "2699",
        code: 9881,
        alias: "",
        name: "gear",
        nameUnicode: "GEAR"
    },
    {
        symbol: "⚚",
        unicodeHex: "269A",
        code: 9882,
        alias: "hermes",
        name: "staff_of_hermes",
        nameUnicode: "STAFF OF HERMES"
    },
    {
        symbol: "⚛",
        unicodeHex: "269B",
        code: 9883,
        alias: "atom",
        name: "atom_symbol",
        nameUnicode: "ATOM SYMBOL"
    },
    {
        symbol: "⚝",
        unicodeHex: "269D",
        code: 9885,
        alias: "outlined_star",
        name: "outlined_white_star",
        nameUnicode: "OUTLINED WHITE STAR"
    },
    {
        symbol: "⚠",
        unicodeHex: "26A0",
        code: 9888,
        alias: "warning",
        name: "warning_sign",
        nameUnicode: "WARNING SIGN"
    },
    {
        symbol: "⚬",
        unicodeHex: "26AC",
        code: 9900,
        alias: "medium_small_circle",
        name: "medium_small_white_circle",
        nameUnicode: "MEDIUM SMALL WHITE CIRCLE"
    },
    {
        symbol: "⚭",
        unicodeHex: "26AD",
        code: 9901,
        alias: "marriage",
        name: "marriage_symbol",
        nameUnicode: "MARRIAGE SYMBOL"
    },
    {
        symbol: "⚮",
        unicodeHex: "26AE",
        code: 9902,
        alias: "divorce",
        name: "divorce_symbol",
        nameUnicode: "DIVORCE SYMBOL"
    },
    {
        symbol: "⚯",
        unicodeHex: "26AF",
        code: 9903,
        alias: "unmarried_partnership",
        name: "unmarried_partnership_symbol",
        nameUnicode: "UNMARRIED PARTNERSHIP SYMBOL"
    },
    {
        symbol: "⚲",
        unicodeHex: "26B2",
        code: 9906,
        alias: "",
        name: "neuter",
        nameUnicode: "NEUTER"
    },
    {
        symbol: "⚳",
        unicodeHex: "26B3",
        code: 9907,
        alias: "",
        name: "ceres",
        nameUnicode: "CERES"
    },
    {
        symbol: "⚴",
        unicodeHex: "26B4",
        code: 9908,
        alias: "",
        name: "pallas",
        nameUnicode: "PALLAS"
    },
    {
        symbol: "⚵",
        unicodeHex: "26B5",
        code: 9909,
        alias: "",
        name: "juno",
        nameUnicode: "JUNO"
    },
    {
        symbol: "⚶",
        unicodeHex: "26B6",
        code: 9910,
        alias: "",
        name: "vesta",
        nameUnicode: "VESTA"
    },
    {
        symbol: "⚷",
        unicodeHex: "26B7",
        code: 9911,
        alias: "",
        name: "chiron",
        nameUnicode: "CHIRON"
    },
    {
        symbol: "⚹",
        unicodeHex: "26B9",
        code: 9913,
        alias: "",
        name: "sextile",
        nameUnicode: "SEXTILE"
    },
    {
        symbol: "⚿",
        unicodeHex: "26BF",
        code: 9919,
        alias: "",
        name: "squared_key",
        nameUnicode: "SQUARED KEY"
    },
    {
        symbol: "⛀",
        unicodeHex: "26C0",
        code: 9920,
        alias: "draughts_man",
        name: "white_draughts_man",
        nameUnicode: "WHITE DRAUGHTS MAN"
    },
    {
        symbol: "⛁",
        unicodeHex: "26C1",
        code: 9921,
        alias: "draughts_king",
        name: "white_draughts_king",
        nameUnicode: "WHITE DRAUGHTS KING"
    },
    {
        symbol: "⛂",
        unicodeHex: "26C2",
        code: 9922,
        alias: "",
        name: "black_draughts_man",
        nameUnicode: "BLACK DRAUGHTS MAN"
    },
    {
        symbol: "⛃",
        unicodeHex: "26C3",
        code: 9923,
        alias: "",
        name: "black_draughts_king",
        nameUnicode: "BLACK DRAUGHTS KING"
    },
    {
        symbol: "⛆",
        unicodeHex: "26C6",
        code: 9926,
        alias: "",
        name: "rain",
        nameUnicode: "RAIN"
    },
    {
        symbol: "⛇",
        unicodeHex: "26C7",
        code: 9927,
        alias: "",
        name: "black_snowman",
        nameUnicode: "BLACK SNOWMAN"
    },
    {
        symbol: "⛉",
        unicodeHex: "26C9",
        code: 9929,
        alias: "turned_shogi_piece",
        name: "turned_white_shogi_piece",
        nameUnicode: "TURNED WHITE SHOGI PIECE"
    },
    {
        symbol: "⛊",
        unicodeHex: "26CA",
        code: 9930,
        alias: "black_turned_shogi_piece",
        name: "turned_black_shogi_piece",
        nameUnicode: "TURNED BLACK SHOGI PIECE"
    },
    {
        symbol: "⛋",
        unicodeHex: "26CB",
        code: 9931,
        alias: "squared_diamond",
        name: "white_diamond_in_square",
        nameUnicode: "WHITE DIAMOND IN SQUARE"
    },
    {
        symbol: "⛌",
        unicodeHex: "26CC",
        code: 9932,
        alias: "",
        name: "crossing_lanes",
        nameUnicode: "CROSSING LANES"
    },
    {
        symbol: "⛍",
        unicodeHex: "26CD",
        code: 9933,
        alias: "",
        name: "disabled_car",
        nameUnicode: "DISABLED CAR"
    },
    {
        symbol: "⛐",
        unicodeHex: "26D0",
        code: 9936,
        alias: "sliding_car",
        name: "car_sliding",
        nameUnicode: "CAR SLIDING"
    },
    {
        symbol: "⛒",
        unicodeHex: "26D2",
        code: 9938,
        alias: "",
        name: "circled_crossing_lanes",
        nameUnicode: "CIRCLED CROSSING LANES"
    },
    {
        symbol: "⛟",
        unicodeHex: "26DF",
        code: 9951,
        alias: "",
        name: "black_truck",
        nameUnicode: "BLACK TRUCK"
    },
    {
        symbol: "⛤",
        unicodeHex: "26E4",
        code: 9956,
        alias: "",
        name: "pentagram",
        nameUnicode: "PENTAGRAM"
    },
    {
        symbol: "⛧",
        unicodeHex: "26E7",
        code: 9959,
        alias: "",
        name: "inverted_pentagram",
        nameUnicode: "INVERTED PENTAGRAM"
    },
    {
        symbol: "⛩",
        unicodeHex: "26E9",
        code: 9961,
        alias: "",
        name: "shinto_shrine",
        nameUnicode: "SHINTO SHRINE"
    },
    {
        symbol: "⛫",
        unicodeHex: "26EB",
        code: 9963,
        alias: "",
        name: "castle",
        nameUnicode: "CASTLE"
    },
    {
        symbol: "⛬",
        unicodeHex: "26EC",
        code: 9964,
        alias: "",
        name: "historic_site",
        nameUnicode: "HISTORIC SITE"
    },
    {
        symbol: "⛭",
        unicodeHex: "26ED",
        code: 9965,
        alias: "",
        name: "gear_without_hub",
        nameUnicode: "GEAR WITHOUT HUB"
    },
    {
        symbol: "⛮",
        unicodeHex: "26EE",
        code: 9966,
        alias: "",
        name: "gear_with_handles",
        nameUnicode: "GEAR WITH HANDLES"
    },
    {
        symbol: "⛯",
        unicodeHex: "26EF",
        code: 9967,
        alias: "map_lighthouse",
        name: "map_symbol_for_lighthouse",
        nameUnicode: "MAP SYMBOL FOR LIGHTHOUSE"
    },
    {
        symbol: "⛱",
        unicodeHex: "26F1",
        code: 9969,
        alias: "",
        name: "umbrella_on_ground",
        nameUnicode: "UMBRELLA ON GROUND"
    },
    {
        symbol: "⛶",
        unicodeHex: "26F6",
        code: 9974,
        alias: "",
        name: "square_four_corners",
        nameUnicode: "SQUARE FOUR CORNERS"
    },
    {
        symbol: "⛸",
        unicodeHex: "26F8",
        code: 9976,
        alias: "",
        name: "ice_skate",
        nameUnicode: "ICE SKATE"
    },
    {
        symbol: "⛻",
        unicodeHex: "26FB",
        code: 9979,
        alias: "japanese_bank",
        name: "japanese_bank_symbol",
        nameUnicode: "JAPANESE BANK SYMBOL"
    },
    {
        symbol: "⛾",
        unicodeHex: "26FE",
        code: 9982,
        alias: "black_squared_cup",
        name: "cup_on_black_square",
        nameUnicode: "CUP ON BLACK SQUARE"
    }
];
exports.squaredIcons = [
    {
        "symbol": "1",
        "alias": "squared_one",
        "name": "squared_digit_one",
    },
    {
        "symbol": "2",
        "alias": "squared_two",
        "name": "squared_digit_two",
    },
    {
        "symbol": "3",
        "alias": "squared_three",
        "name": "squared_digit_three",
    },
    {
        "symbol": "4",
        "alias": "squared_four",
        "name": "squared_digit_four",
    },
    {
        "symbol": "5",
        "alias": "squared_five",
        "name": "squared_digit_five",
    },
    {
        "symbol": "6",
        "alias": "squared_six",
        "name": "squared_digit_six",
    },
    {
        "symbol": "7",
        "alias": "squared_seven",
        "name": "squared_digit_seven",
    },
    {
        "symbol": "8",
        "alias": "squared_eight",
        "name": "squared_digit_eight",
    },
    {
        "symbol": "9",
        "alias": "squared_nine",
        "name": "squared_digit_nine",
    },
    {
        "symbol": "0",
        "alias": "squared_zero",
        "name": "squared_digit_zero",
    },
];
var findEmoji = function (iconName) {
    var e_1, _a;
    try {
        for (var _b = tslib_1.__values(Object.entries(emoji_1.emojies)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = tslib_1.__read(_c.value, 2), key = _d[0], value = _d[1];
            if (key === iconName) {
                return {
                    symbol: value
                };
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
};
//emojies_defs
var findIcon = function (iconName, isMath) {
    if (isMath === void 0) { isMath = false; }
    if (iconName.indexOf('emoji') !== -1) {
        iconName = iconName.replace(/emoji/g, "");
        iconName = iconName ? iconName.trim() : '';
        if (!iconName) {
            return null;
        }
        return findEmoji(iconName);
    }
    var res = exports.icons.find(function (item) { return item.alias === iconName || item.name === iconName; });
    if (!res && !isMath) {
        res = (0, exports.findFaIcons)(iconName);
    }
    if (!res) {
        res = findEmoji(iconName);
    }
    return res;
};
exports.findIcon = findIcon;
var findSquaredIcon = function (iconName) {
    return exports.squaredIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findSquaredIcon = findSquaredIcon;
var findFaIcons = function (iconName) {
    return fa_icons_1.faIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findFaIcons = findFaIcons;
//# sourceMappingURL=icons.js.map