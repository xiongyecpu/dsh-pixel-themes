/**
 * pixel-themes — 浏览器半（手写 DSH 客户端 bundle，无需构建工具链）。
 *
 * 契约与 tsdown clientBundle 产物一致：
 *   window.__ModuleLoader__.load({ id, factory: (require) => exports })
 * factory 在物化（首次 import/require）时执行，里面的副作用（注入 <style>）也随之发生。
 *
 * 做的事：
 *   1. 把 pixel-themes 的 21 套风格包（配色 + 像素 sprite）转成 DSH 的 --dsw-alias-* token 覆盖层，
 *      经 ctx.theme.overrideTokens() 叠在当前主题之上（亮/暗两套值同时给）。
 *   2. 在「设置」里注册一个「风格」页，21 张卡片可点选，选择记在 localStorage。
 *
 * 配色参考自公开的终端/编辑器主题色值（MIT / Apache-2.0），名称与像素画为本项目原创。
 */
window.__ModuleLoader__.load({
  id: 'dsh-pixel-themes',
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    const React = require('react');
    const h = React.createElement;

    // ---------------------------------------------------------------- 数据
    /** 21 套风格（由 scripts/build.mjs 从 pixel-themes 抽出后内联）。 */
    const STYLES = [
      {
        "id": "lemon",
        "name": {
          "zh": "柠檬",
          "en": "Lemon"
        },
        "colors": {
          "ink": "#8C7A1B",
          "grid": "#F9EA9F",
          "pencil": "#BBAE6B",
          "accent": "#D9A800",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#6D5E15",
          "chip": "#FAEEB0",
          "bubble": "#F2D22E",
          "bubbleAccent": "#D9A800",
          "cardFillLight": "#FDF7D9",
          "cardFillDark": "#4C451C",
          "deskCardFill": "#FEFBEC",
          "deskCardBorder": "#FBEFB3",
          "deskFigure": "#5C5011"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#6D5E15",
            "b": "#F2D22E",
            "h": "#F8E68C",
            "l": "#5F9E3B",
            "s": "#7A5B00"
          },
          "frames": [
            [
              "................",
              ".........ll.....",
              ".....obbbbo.....",
              "....obbhbbbo....",
              "...obbbhhbbbo...",
              "..oobbbbbbbboo..",
              "...obbbbbbbbo...",
              "....obbbbbbo....",
              ".....obbbbo.....",
              "................"
            ]
          ]
        }
      },
      {
        "id": "pomelo",
        "name": {
          "zh": "柚子",
          "en": "Pomelo"
        },
        "colors": {
          "ink": "#7C823D",
          "grid": "#E9EFB9",
          "pencil": "#AEB382",
          "accent": "#8FB53A",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#606530",
          "chip": "#ECF1C4",
          "bubble": "#D6E06A",
          "bubbleAccent": "#8FB53A",
          "cardFillLight": "#F3F6E1",
          "cardFillDark": "#3F4428",
          "deskCardFill": "#F9FAF0",
          "deskCardBorder": "#EDF1C7",
          "deskFigure": "#515528"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#606530",
            "b": "#D6E06A",
            "h": "#E8EEAD",
            "l": "#4E8A3A",
            "s": "#6B7A2E"
          },
          "frames": [
            [
              "................",
              ".........ll.....",
              ".....obbbbo.....",
              "....obbhbbbo....",
              "...obbbhhbbbo...",
              "..oobbbbbbbboo..",
              "...obbbbbbbbo...",
              "....obbbbbbo....",
              ".....obbbbo.....",
              "................"
            ]
          ]
        }
      },
      {
        "id": "lime",
        "name": {
          "zh": "青柠",
          "en": "Lime"
        },
        "colors": {
          "ink": "#517325",
          "grid": "#CAE5A7",
          "pencil": "#91AA72",
          "accent": "#6FA62A",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#3F591C",
          "chip": "#D3EAB6",
          "bubble": "#8CC63F",
          "bubbleAccent": "#6FA62A",
          "cardFillLight": "#EAF5DC",
          "cardFillDark": "#324221",
          "deskCardFill": "#F4FAEE",
          "deskCardBorder": "#D5EBB9",
          "deskFigure": "#354B18"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#3F591C",
            "b": "#8CC63F",
            "h": "#C0E095",
            "l": "#3F7A2A",
            "s": "#2E4E1A"
          },
          "frames": [
            [
              "...........l....",
              "..........ll....",
              "....obbbbbbo....",
              "...obbbhbbbbo...",
              "...obbbhhbbbo...",
              "...obbbbbbbbo...",
              "...obbbbbbbbo...",
              "...obbbbbbbbo...",
              "....obbbbbbo....",
              "................"
            ]
          ]
        }
      },
      {
        "id": "watermelon",
        "name": {
          "zh": "西瓜",
          "en": "Watermelon"
        },
        "colors": {
          "ink": "#872E3D",
          "grid": "#DEB4B4",
          "pencil": "#A97C7F",
          "accent": "#2E7D32",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#682430",
          "chip": "#DDC4BF",
          "bubble": "#E8506A",
          "bubbleAccent": "#2E7D32",
          "cardFillLight": "#D9E8DA",
          "cardFillDark": "#192F1D",
          "deskCardFill": "#ECF4EC",
          "deskCardBorder": "#DCC7C1",
          "deskFigure": "#581E28"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#682430",
            "b": "#E8506A",
            "h": "#F29FAD",
            "l": "#2E7D32",
            "s": "#2B2B2B"
          },
          "frames": [
            [
              "................",
              "................",
              "..llllllllllll..",
              "...obbobbobbo...",
              "....obbobbbo....",
              ".....obbobo.....",
              "......obbo......",
              ".......oo.......",
              "................",
              "................"
            ]
          ]
        }
      },
      {
        "id": "strawberry",
        "name": {
          "zh": "草莓",
          "en": "Strawberry"
        },
        "colors": {
          "ink": "#832432",
          "grid": "#F2A6B2",
          "pencil": "#B5717C",
          "accent": "#C2273F",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#661C27",
          "chip": "#F4B6C0",
          "bubble": "#E23E57",
          "bubbleAccent": "#C2273F",
          "cardFillLight": "#FADCE1",
          "cardFillDark": "#481E27",
          "deskCardFill": "#FCEEF0",
          "deskCardBorder": "#F5B9C3",
          "deskFigure": "#561821"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#661C27",
            "b": "#E23E57",
            "h": "#EF95A3",
            "l": "#3E8E41",
            "s": "#FFE08A"
          },
          "frames": [
            [
              ".......o........",
              "......lll.......",
              "...obbbbbbo.....",
              "..obbhhhbbbo....",
              "..obbbbsbsbo....",
              "..obbsbbsbbo....",
              "...obbsbbbs.....",
              "....obbbso......",
              ".....obbo.......",
              "......oo........"
            ]
          ]
        }
      },
      {
        "id": "blueberry",
        "name": {
          "zh": "蓝莓",
          "en": "Blueberry"
        },
        "colors": {
          "ink": "#2B3974",
          "grid": "#ACB7E6",
          "pencil": "#7680AA",
          "accent": "#2E3E8E",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#212D5A",
          "chip": "#BAC4EA",
          "bubble": "#4A63C8",
          "bubbleAccent": "#2E3E8E",
          "cardFillLight": "#DEE3F5",
          "cardFillDark": "#212844",
          "deskCardFill": "#EEF1FA",
          "deskCardBorder": "#BDC7EB",
          "deskFigure": "#1C264C"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#212D5A",
            "b": "#4A63C8",
            "h": "#9BA9E1",
            "l": "#3E6B3E",
            "s": "#E6ECFF"
          },
          "frames": [
            [
              "................",
              ".......oo.......",
              ".......ss.......",
              "....obbbbo......",
              "...obbhhbbo.....",
              "..obbbhbbbbo....",
              "..obbbbbbbbo....",
              "...obbbbbbo.....",
              "....obbbbo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "grape",
        "name": {
          "zh": "葡萄",
          "en": "Grape"
        },
        "colors": {
          "ink": "#523575",
          "grid": "#CBB3E6",
          "pencil": "#927DAB",
          "accent": "#6A3AA0",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#40295A",
          "chip": "#D5C1EA",
          "bubble": "#8E5BC9",
          "bubbleAccent": "#6A3AA0",
          "cardFillLight": "#EBE1F5",
          "cardFillDark": "#322645",
          "deskCardFill": "#F5F0FA",
          "deskCardBorder": "#D7C4EB",
          "deskFigure": "#36234C"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#40295A",
            "b": "#8E5BC9",
            "h": "#C1A5E1",
            "l": "#4E8A3A",
            "s": "#FFFFFF"
          },
          "frames": [
            [
              ".......ll.......",
              "....o...o...o...",
              "...hbo.hbo.hbo..",
              "..obbbobbbobbbo.",
              "...obooobooobo..",
              "....ohboohboo...",
              "....obbbobbbo...",
              ".....obhbobo....",
              "......obbbo.....",
              ".......obo......"
            ]
          ]
        }
      },
      {
        "id": "apple",
        "name": {
          "zh": "苹果",
          "en": "Apple"
        },
        "colors": {
          "ink": "#7E2222",
          "grid": "#EDA5A5",
          "pencil": "#B17070",
          "accent": "#B01F1F",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#621A1A",
          "chip": "#F1B5B5",
          "bubble": "#D93A3A",
          "bubbleAccent": "#B01F1F",
          "cardFillLight": "#F8DCDC",
          "cardFillDark": "#461D1F",
          "deskCardFill": "#FCEEEE",
          "deskCardBorder": "#F1B8B8",
          "deskFigure": "#521616"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#621A1A",
            "b": "#D93A3A",
            "h": "#EA9393",
            "l": "#4E8A3A",
            "s": "#FFFFFF"
          },
          "frames": [
            [
              "................",
              "........oll.....",
              ".......o........",
              "....obhhbo......",
              "...obbhhbbo.....",
              "..obbbbbbbbo....",
              "..obbbbbbbbo....",
              "...obbbbbbo.....",
              "...obbbbbbo.....",
              "....obbbbo......"
            ]
          ]
        }
      },
      {
        "id": "peach",
        "name": {
          "zh": "蜜桃",
          "en": "Peach"
        },
        "colors": {
          "ink": "#8F5A4A",
          "grid": "#FCD1C4",
          "pencil": "#BE988C",
          "accent": "#D2705A",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#6F4639",
          "chip": "#FCD9CF",
          "bubble": "#F79B7F",
          "bubbleAccent": "#D2705A",
          "cardFillLight": "#FEEDE8",
          "cardFillDark": "#4E3631",
          "deskCardFill": "#FEF6F4",
          "deskCardBorder": "#FCDBD1",
          "deskFigure": "#5E3B30"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#6F4639",
            "b": "#F79B7F",
            "h": "#FBC8B9",
            "l": "#4E8A3A",
            "s": "#A03A2C"
          },
          "frames": [
            [
              "................",
              "........oll.....",
              "................",
              "....obhhbo......",
              "...obbhbhbo.....",
              "..obbbbbhbbo....",
              "..obbbbbhbbo....",
              "...obbbbbbo.....",
              "...obbbbbbo.....",
              "....obbbbo......"
            ]
          ]
        }
      },
      {
        "id": "cherry",
        "name": {
          "zh": "樱桃",
          "en": "Cherry"
        },
        "colors": {
          "ink": "#680A1B",
          "grid": "#D5929D",
          "pencil": "#9D5F6A",
          "accent": "#7A0F1E",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#510815",
          "chip": "#DBA5AE",
          "bubble": "#B3122F",
          "bubbleAccent": "#7A0F1E",
          "cardFillLight": "#E7D4D6",
          "cardFillDark": "#2D1218",
          "deskCardFill": "#F3EAEA",
          "deskCardBorder": "#DCA9B1",
          "deskFigure": "#440712"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#510815",
            "b": "#B3122F",
            "h": "#D57D8D",
            "l": "#3E8E41",
            "s": "#FFFFFF"
          },
          "frames": [
            [
              "................",
              "......llo.......",
              ".....o...o......",
              ".....o....oo....",
              "...obbbo.obbbo..",
              "...bhbbb.bhbbb..",
              "..obbbbbobbbbbo.",
              "...bbbbb.bbbbb..",
              "...obbbo.obbbo..",
              ".....o.....o...."
            ]
          ]
        }
      },
      {
        "id": "orange",
        "name": {
          "zh": "橙子",
          "en": "Orange"
        },
        "colors": {
          "ink": "#8E5110",
          "grid": "#FACA97",
          "pencil": "#BD9163",
          "accent": "#D06E00",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#6E3F0D",
          "chip": "#FBD3A9",
          "bubble": "#F58C1C",
          "bubbleAccent": "#D06E00",
          "cardFillLight": "#FDEAD6",
          "cardFillDark": "#4D3218",
          "deskCardFill": "#FEF4EA",
          "deskCardBorder": "#FBD5AD",
          "deskFigure": "#5D350B"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#6E3F0D",
            "b": "#F58C1C",
            "h": "#FAC082",
            "l": "#3E8E41",
            "s": "#FFFFFF"
          },
          "frames": [
            [
              "................",
              "........oll.....",
              "....obbobo......",
              "...obbhhbbo.....",
              "..obbbhbbbbo....",
              "..obbbbbhbbo....",
              "..obbbbbhbbo....",
              "..obbbbbhbbo....",
              "...obbbbbbo.....",
              "....obbbbo......"
            ]
          ]
        }
      },
      {
        "id": "mango",
        "name": {
          "zh": "芒果",
          "en": "Mango"
        },
        "colors": {
          "ink": "#8B5D23",
          "grid": "#F7D2A6",
          "pencil": "#BA9971",
          "accent": "#D97A14",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#6C481B",
          "chip": "#F8DAB6",
          "bubble": "#F0A03C",
          "bubbleAccent": "#D97A14",
          "cardFillLight": "#FBECDC",
          "cardFillDark": "#4A351F",
          "deskCardFill": "#FDF6EE",
          "deskCardBorder": "#F9DBB9",
          "deskFigure": "#5B3D17"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#6C481B",
            "b": "#F0A03C",
            "h": "#F7CB94",
            "l": "#3E8E41",
            "s": "#C0392B"
          },
          "frames": [
            [
              "................",
              ".........oll....",
              "................",
              "....obhhbo......",
              "..obbbhhbbbo....",
              "..obbbbbbbbo....",
              "..obbbbbbbbo....",
              "..obbbbbbbbo....",
              "...obbbbbbo.....",
              ".....obbo......."
            ]
          ]
        }
      },
      {
        "id": "kiwi",
        "name": {
          "zh": "猕猴桃",
          "en": "Kiwi"
        },
        "colors": {
          "ink": "#45622B",
          "grid": "#C1D8AC",
          "pencil": "#899E76",
          "accent": "#4E8A2E",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#364C21",
          "chip": "#CCDFBA",
          "bubble": "#77A94A",
          "bubbleAccent": "#4E8A2E",
          "cardFillLight": "#E7F0DE",
          "cardFillDark": "#2C3A24",
          "deskCardFill": "#F3F8EE",
          "deskCardBorder": "#CEE0BD",
          "deskFigure": "#2D401C"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#364C21",
            "b": "#77A94A",
            "h": "#B4D09B",
            "l": "#3E6B2A",
            "s": "#2E2E1A"
          },
          "frames": [
            [
              "................",
              "................",
              "....obbbbbbo....",
              "...obbbbsbbbo...",
              "...obbbsbsbbo...",
              "...obbsbhbsbo...",
              "...obbbsbsbbo...",
              "...obbbbsbbbo...",
              "....obbbbbbo....",
              "................"
            ]
          ]
        }
      },
      {
        "id": "pineapple",
        "name": {
          "zh": "菠萝",
          "en": "Pineapple"
        },
        "colors": {
          "ink": "#7E6722",
          "grid": "#EADCA5",
          "pencil": "#AFA170",
          "accent": "#A87A00",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#62501A",
          "chip": "#ECE2B5",
          "bubble": "#D9B23A",
          "bubbleAccent": "#A87A00",
          "cardFillLight": "#F2F1DC",
          "cardFillDark": "#3D3D1F",
          "deskCardFill": "#F8F8EE",
          "deskCardBorder": "#ECE3B8",
          "deskFigure": "#524416"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#62501A",
            "b": "#D9B23A",
            "h": "#EAD593",
            "l": "#4E8A3A",
            "s": "#8A5A00"
          },
          "frames": [
            [
              "................",
              "......llll......",
              "......llll......",
              "...obbbbbbo.....",
              "..obbbsbsbbo....",
              "..obbbbsbsbo....",
              "..obbbsbsbbo....",
              "...obbbsbbo.....",
              "....obbbbo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "watermelon-ice",
        "name": {
          "zh": "西瓜冰",
          "en": "Melon Ice"
        },
        "colors": {
          "ink": "#8C515D",
          "grid": "#EBCED1",
          "pencil": "#B39498",
          "accent": "#C94E66",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#6D3F48",
          "chip": "#EAD8D8",
          "bubble": "#F28CA0",
          "bubbleAccent": "#C94E66",
          "cardFillLight": "#E8F0EA",
          "cardFillDark": "#2E3A34",
          "deskCardFill": "#F4F8F4",
          "deskCardBorder": "#EADADA",
          "deskFigure": "#5C353D"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#6D3F48",
            "b": "#F28CA0",
            "h": "#F8C0CB",
            "l": "#2E7D32",
            "s": "#3A3A3A"
          },
          "frames": [
            [
              "................",
              "................",
              "...llllllllll...",
              "...ohhhhhhhho...",
              "...ohhohhohho...",
              "....obbbobbo....",
              ".....obbbbo.....",
              "......oooo......",
              "................",
              "................"
            ]
          ]
        }
      },
      {
        "id": "banana",
        "name": {
          "zh": "香蕉",
          "en": "Banana"
        },
        "colors": {
          "ink": "#755E2B",
          "grid": "#E3D2AA",
          "pencil": "#A99975",
          "accent": "#8A6A00",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#5A4921",
          "chip": "#E7D9B9",
          "bubble": "#C9A24A",
          "bubbleAccent": "#8A6A00",
          "cardFillLight": "#F1EADC",
          "cardFillDark": "#3B321F",
          "deskCardFill": "#F8F4EE",
          "deskCardBorder": "#E8DABC",
          "deskFigure": "#4C3E1C"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#5A4921",
            "b": "#C9A24A",
            "h": "#E1CC9B",
            "l": "#6A6A2A",
            "s": "#3A3A1A"
          },
          "frames": [
            [
              "................",
              "................",
              "..o..........o..",
              "..bo........ob..",
              "..bboo....oobb..",
              "..obbboooobbbo..",
              "...obbhhhhbbo...",
              "....oobbbboo....",
              "......oooo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "dragon-fruit",
        "name": {
          "zh": "火龙果",
          "en": "Dragon Fruit"
        },
        "colors": {
          "ink": "#872556",
          "grid": "#F5A7CE",
          "pencil": "#B87295",
          "accent": "#B0166A",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#681C43",
          "chip": "#F6B6D7",
          "bubble": "#E83F94",
          "bubbleAccent": "#B0166A",
          "cardFillLight": "#FBDCEC",
          "cardFillDark": "#4A1E37",
          "deskCardFill": "#FDEEF6",
          "deskCardBorder": "#F7B9D9",
          "deskFigure": "#581838"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#681C43",
            "b": "#E83F94",
            "h": "#F295C4",
            "l": "#4E8A3A",
            "s": "#FFFFFF"
          },
          "frames": [
            [
              "................",
              "......l..l......",
              "...oblbbbbl.....",
              "..oblbbbbbbl....",
              "..olbbbsbsbol...",
              "..oblbbbsbbl....",
              "..obbbsbbbso....",
              "...obbbbsbo.....",
              "....obbbbo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "pomegranate",
        "name": {
          "zh": "石榴",
          "en": "Pomegranate"
        },
        "colors": {
          "ink": "#5C1829",
          "grid": "#CD9BA8",
          "pencil": "#966773",
          "accent": "#6E1330",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#471320",
          "chip": "#D4ACB6",
          "bubble": "#9E2A46",
          "bubbleAccent": "#6E1330",
          "cardFillLight": "#E5D5DA",
          "cardFillDark": "#2A131D",
          "deskCardFill": "#F2EAEC",
          "deskCardBorder": "#D5AFB9",
          "deskFigure": "#3C101B"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#471320",
            "b": "#9E2A46",
            "h": "#CA8A99",
            "l": "#3E8E41",
            "s": "#FFE08A"
          },
          "frames": [
            [
              "................",
              "................",
              "......llll......",
              "...obbbbbbo.....",
              "..obbbhsbsbo....",
              "..obbbsbsbso....",
              "..obbbbbsbbo....",
              "...obbbbbbo.....",
              "....obbbbo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "avocado",
        "name": {
          "zh": "牛油果",
          "en": "Avocado"
        },
        "colors": {
          "ink": "#405129",
          "grid": "#BDCAAB",
          "pencil": "#859175",
          "accent": "#A8792E",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#313F20",
          "chip": "#C8D3BA",
          "bubble": "#6E8B47",
          "bubbleAccent": "#A8792E",
          "cardFillLight": "#E5EADE",
          "cardFillDark": "#2A3223",
          "deskCardFill": "#F2F4EE",
          "deskCardBorder": "#CBD5BD",
          "deskFigure": "#2A351B"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#313F20",
            "b": "#6E8B47",
            "h": "#AFBF9A",
            "l": "#3E6B2A",
            "s": "#7A4A1B"
          },
          "frames": [
            [
              "................",
              ".......ll.......",
              ".....obbo.......",
              "....obbbbo......",
              "...obbbbbbo.....",
              "..obbbbbsbbo....",
              "..obbbbshsbo....",
              "..obbbbbsbbo....",
              "...obbbbbbo.....",
              "....obbbbo......"
            ]
          ]
        }
      },
      {
        "id": "coconut",
        "name": {
          "zh": "椰子",
          "en": "Coconut"
        },
        "colors": {
          "ink": "#624225",
          "grid": "#D8BEA7",
          "pencil": "#9E8672",
          "accent": "#7A4A1B",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#4C331C",
          "chip": "#DFC9B6",
          "bubble": "#A9713F",
          "bubbleAccent": "#7A4A1B",
          "cardFillLight": "#F0E5DC",
          "cardFillDark": "#392B21",
          "deskCardFill": "#F8F2EE",
          "deskCardBorder": "#E0CBB9",
          "deskFigure": "#402B18"
        },
        "bubbles": [
          "·",
          "∘",
          "✦"
        ],
        "sprite": {
          "palette": {
            "o": "#4C331C",
            "b": "#A9713F",
            "h": "#D0B195",
            "l": "#4E8A3A",
            "s": "#3A2410"
          },
          "frames": [
            [
              "................",
              "................",
              "...obbbbbbo.....",
              "..obbbhhsbbo....",
              "..obbbbsssbo....",
              "..obbbbbbbbo....",
              "..obbbbbbbbo....",
              "...obbbbbbo.....",
              "....obbbbo......",
              "................"
            ]
          ]
        }
      },
      {
        "id": "lychee",
        "name": {
          "zh": "荔枝",
          "en": "Lychee"
        },
        "colors": {
          "ink": "#87414A",
          "grid": "#F5BDC4",
          "pencil": "#B8868C",
          "accent": "#B03A4A",
          "onAccent": "#FFFFFF",
          "red": "#C63A3A",
          "inkDark": "#693239",
          "chip": "#F7C9CF",
          "bubble": "#E9707F",
          "bubbleAccent": "#B03A4A",
          "cardFillLight": "#FBE5E8",
          "cardFillDark": "#4A2B31",
          "deskCardFill": "#FDF2F4",
          "deskCardBorder": "#F7CBD1",
          "deskFigure": "#592B30"
        },
        "bubbles": [
          "·"
        ],
        "sprite": {
          "palette": {
            "o": "#693239",
            "b": "#E9707F",
            "h": "#F3B0B9",
            "l": "#3E8E41",
            "s": "#FFF3F5"
          },
          "frames": [
            [
              "................",
              ".........ll.....",
              "....obbbbbbo....",
              "...obbsbbsbbo...",
              "...obbbsbbsbo...",
              "...obbsbbbbbo...",
              "...obbbbbsbbo...",
              "...obbbsbbbbo...",
              "....obbbbbbo....",
              "................"
            ]
          ]
        }
      }
    ];

    // ---------------------------------------------------------------- 颜色工具
    const HEX = /^#([0-9a-fA-F]{6})$/;
    function parseHex(value) {
      const m = HEX.exec(value);
      if (!m) return null;
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function toHex(rgb) {
      return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
    }
    /** 线性混色：t=0 得 a，t=1 得 b（与 pixel-themes 的 mix 同义）。 */
    function mix(a, b, t) {
      const x = parseHex(a);
      const y = parseHex(b);
      if (!x || !y) return a;
      return toHex(x.map((v, i) => v + (y[i] - v) * t));
    }
    /** 同色不同透明度：给需要 alpha 语义的 token 用。 */
    function alpha(color, a) {
      const rgb = parseHex(color);
      if (!rgb) return color;
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
    }

    // ---------------------------------------------------------------- 风格 → token
    const WHITE = '#ffffff';
    const BLACK = '#000000';

    /**
     * 一套风格包 → DSH token 覆盖层。
     * 返回 { '--dsw-alias-bg-base': { light, dark }, ... }，正好是 overrideTokens 需要的形状。
     * 纯函数，不碰 DOM；改配色只改这里。
     */
    function deriveTokens(style) {
      const c = style.colors;
      const L = c.cardFillLight;
      const D = c.cardFillDark;
      const ink = c.ink;
      const inkDark = c.inkDark;
      const chip = c.chip;
      const accent = c.accent;
      const red = c.red;

      // ---- 亮色 ----
      const lBase = mix(L, WHITE, 0.72);
      const lLayer1 = mix(L, WHITE, 0.46);
      const lLayer2 = mix(L, WHITE, 0.14);
      const lLayer3 = mix(L, chip, 0.42);
      const lSidebar = mix(L, chip, 0.34);
      const lInput = mix(L, WHITE, 0.86);
      const lText = inkDark;
      const light = {
        '--dsw-alias-bg-base': lBase,
        '--dsw-alias-bg-layer-1': lLayer1,
        '--dsw-alias-bg-layer-2': lLayer2,
        '--dsw-alias-bg-layer-3': lLayer3,
        '--dsw-alias-bg-overlay': mix(lLayer2, WHITE, 0.35),
        '--dsw-alias-bg-module-platform': mix(lBase, chip, 0.55),
        '--dsw-alias-bg-multi-select': mix(lBase, chip, 0.6),
        '--dsw-alias-bg-skeleton': mix(lBase, ink, 0.06),

        '--dsw-alias-border-l1': mix(lBase, ink, 0.1),
        '--dsw-alias-border-l2': mix(lBase, ink, 0.16),
        '--dsw-alias-border-l2-darkmode-thin': mix(lBase, ink, 0.16),
        '--dsw-alias-border-l3': mix(lBase, ink, 0.22),
        '--dsw-alias-border-l4': mix(lBase, ink, 0.3),

        '--dsw-alias-label-primary': lText,
        '--dsw-alias-label-primary-dimmed': mix(lText, lBase, 0.12),
        '--dsw-alias-label-primary-bluish': mix(lText, ink, 0.35),
        '--dsw-alias-label-primary-foreground': WHITE,
        '--dsw-alias-label-primary-inverted': WHITE,
        '--dsw-alias-label-secondary': mix(lText, lBase, 0.34),
        '--dsw-alias-label-tertiary': mix(lText, lBase, 0.46),
        '--dsw-alias-label-caption': mix(lText, lBase, 0.58),
        '--dsw-alias-label-dimmed': mix(lText, lBase, 0.72),

        '--dsw-alias-brand-primary': inkDark,
        '--dsw-alias-brand-text': inkDark,
        '--dsw-alias-brand-primary-invert': WHITE,
        '--dsw-alias-button-primary-fill': inkDark,
        '--dsw-alias-button-primary-hover': mix(inkDark, BLACK, 0.14),
        '--dsw-alias-button-primary-dimmed': mix(lBase, inkDark, 0.16),
        '--dsw-alias-button-contrast-fill': inkDark,
        '--dsw-alias-link': inkDark,

        '--dsw-alias-interactive-bg-hover': alpha(ink, 0.07),
        '--dsw-alias-interactive-bg-active': alpha(ink, 0.13),
        '--dsw-alias-interactive-bg-hover-accent': alpha(ink, 0.18),
        '--dsw-alias-interactive-bg-hover-solid': mix(lBase, chip, 0.5),

        '--dsw-specific-bubble': mix(c.bubble, WHITE, 0.66),
        '--dsw-specific-bubble-highlight': mix(c.bubbleAccent, WHITE, 0.55),
        '--dsw-specific-input-major': lInput,
        '--dsw-specific-login-input': mix(lBase, chip, 0.4),
        '--dsw-specific-sidebar-fill': lSidebar,
        '--dsw-specific-sidebar-nav-item-active': mix(chip, ink, 0.12),
        '--dsw-specific-sidebar-nav-item-hover': alpha(ink, 0.07),
        '--dsw-specific-sidebar-nav-item-active-accent': mix(accent, WHITE, 0.55),
        '--dsw-specific-menu': lLayer3,
        '--dsw-specific-selector': mix(lBase, chip, 0.55),
        '--dsw-specific-tip': mix(lBase, chip, 0.6),

        '--dsw-alias-markdown-inline-code': mix(chip, L, 0.3),
        '--dsw-alias-markdown-code-block': mix(chip, L, 0.5),
        '--dsw-alias-markdown-code-block-banner': mix(chip, L, 0.2),
        '--dsw-alias-markdown-citation': mix(lBase, chip, 0.6),
        '--dsw-alias-markdown-tag': mix(chip, L, 0.15),
        '--dsw-alias-markdown-placeholder': mix(lBase, ink, 0.05),

        '--dsw-alias-state-error-primary': red,
        '--dsw-alias-scrollbar-bg-l1': mix(lBase, ink, 0.14),
        '--dsw-alias-scrollbar-bg-l2': mix(lBase, ink, 0.14),
        '--dsw-alias-scrollbar-hover-l1': mix(lBase, ink, 0.26),
        '--dsw-alias-scrollbar-hover-l2': mix(lBase, ink, 0.26),

        '--dsw-alias-tooltip-bg': mix(inkDark, BLACK, 0.06),
        '--dsw-alias-toast-bg': mix(inkDark, BLACK, 0.02),
      };

      // ---- 暗色 ----
      const dBase = D;
      const dLayer1 = mix(D, WHITE, 0.05);
      const dLayer2 = mix(D, WHITE, 0.08);
      const dLayer3 = mix(D, WHITE, 0.11);
      const dSidebar = mix(D, BLACK, 0.2);
      const dText = mix(c.cardFillLight, WHITE, 0.4);
      const dBrand = mix(ink, WHITE, 0.38);
      const dark = {
        '--dsw-alias-bg-base': dBase,
        '--dsw-alias-bg-layer-1': dLayer1,
        '--dsw-alias-bg-layer-2': dLayer2,
        '--dsw-alias-bg-layer-3': dLayer3,
        '--dsw-alias-bg-overlay': mix(D, WHITE, 0.1),
        '--dsw-alias-bg-module-platform': mix(D, ink, 0.1),
        '--dsw-alias-bg-multi-select': mix(D, ink, 0.14),
        '--dsw-alias-bg-skeleton': alpha(WHITE, 0.07),

        '--dsw-alias-border-l1': mix(dBase, dText, 0.1),
        '--dsw-alias-border-l2': mix(dBase, dText, 0.16),
        '--dsw-alias-border-l2-darkmode-thin': mix(dBase, dText, 0.12),
        '--dsw-alias-border-l3': mix(dBase, dText, 0.22),
        '--dsw-alias-border-l4': mix(dBase, dText, 0.3),

        '--dsw-alias-label-primary': dText,
        '--dsw-alias-label-primary-dimmed': mix(dText, dBase, 0.12),
        '--dsw-alias-label-primary-bluish': mix(dText, ink, 0.4),
        '--dsw-alias-label-primary-foreground': mix(D, BLACK, 0.4),
        '--dsw-alias-label-primary-inverted': mix(D, BLACK, 0.3),
        '--dsw-alias-label-secondary': mix(dText, dBase, 0.3),
        '--dsw-alias-label-tertiary': mix(dText, dBase, 0.42),
        '--dsw-alias-label-caption': mix(dText, dBase, 0.55),
        '--dsw-alias-label-dimmed': mix(dText, dBase, 0.7),

        '--dsw-alias-brand-primary': dBrand,
        '--dsw-alias-brand-text': dBrand,
        '--dsw-alias-brand-primary-invert': dBase,
        '--dsw-alias-button-primary-fill': dBrand,
        '--dsw-alias-button-primary-hover': mix(ink, WHITE, 0.52),
        '--dsw-alias-button-primary-dimmed': mix(D, ink, 0.3),
        '--dsw-alias-button-contrast-fill': dBrand,
        '--dsw-alias-link': mix(ink, WHITE, 0.46),

        '--dsw-alias-interactive-bg-hover': alpha(WHITE, 0.07),
        '--dsw-alias-interactive-bg-active': alpha(WHITE, 0.13),
        '--dsw-alias-interactive-bg-hover-accent': alpha(ink, 0.22),
        '--dsw-alias-interactive-bg-hover-solid': mix(D, ink, 0.18),

        '--dsw-specific-bubble': mix(c.bubble, D, 0.72),
        '--dsw-specific-bubble-highlight': mix(c.bubbleAccent, D, 0.6),
        '--dsw-specific-input-major': mix(D, WHITE, 0.06),
        '--dsw-specific-login-input': mix(D, WHITE, 0.04),
        '--dsw-specific-sidebar-fill': dSidebar,
        '--dsw-specific-sidebar-nav-item-active': mix(D, ink, 0.22),
        '--dsw-specific-sidebar-nav-item-hover': alpha(WHITE, 0.06),
        '--dsw-specific-sidebar-nav-item-active-accent': mix(accent, D, 0.15),
        '--dsw-specific-menu': dLayer3,
        '--dsw-specific-selector': mix(D, ink, 0.14),
        '--dsw-specific-tip': mix(D, WHITE, 0.08),

        '--dsw-alias-markdown-inline-code': mix(D, WHITE, 0.1),
        '--dsw-alias-markdown-code-block': mix(D, WHITE, 0.07),
        '--dsw-alias-markdown-code-block-banner': mix(D, WHITE, 0.12),
        '--dsw-alias-markdown-citation': mix(D, ink, 0.16),
        '--dsw-alias-markdown-tag': mix(D, ink, 0.18),
        '--dsw-alias-markdown-placeholder': mix(D, WHITE, 0.12),

        '--dsw-alias-state-error-primary': mix(red, WHITE, 0.18),
        '--dsw-alias-scrollbar-bg-l1': mix(D, WHITE, 0.12),
        '--dsw-alias-scrollbar-bg-l2': mix(D, WHITE, 0.12),
        '--dsw-alias-scrollbar-hover-l1': mix(D, WHITE, 0.2),
        '--dsw-alias-scrollbar-hover-l2': mix(D, WHITE, 0.2),

        '--dsw-alias-tooltip-bg': mix(D, WHITE, 0.14),
        '--dsw-alias-toast-bg': mix(D, WHITE, 0.14),
      };

      const out = {};
      for (const name of Object.keys(light)) out[name] = { light: light[name], dark: dark[name] ?? light[name] };
      return out;
    }

    // ---------------------------------------------------------------- 状态
    const SOURCE = 'pt-styles';
    const STORAGE_KEY = 'dsh-pixel-theme';
    const DEFAULT_ID = 'lemon';
    let activeCtx = null;
    let currentId = readStoredId();
    let conflict = false;
    /** 浮层在哪一侧打开：'pet'（侧栏小宠） | 'bar'（输入框横条） | null（关闭）。 */
    let pickerAnchor = null;
    const NUMBERS_KEY = 'dsh-pixel-numbers';
    let numbersOn = readNumbers();
    const listeners = new Set();

    function readNumbers() {
      try { return window.localStorage.getItem(NUMBERS_KEY) !== 'off'; } catch { return true; }
    }
    function setPicker(anchor) {
      pickerAnchor = pickerAnchor === anchor ? null : anchor;
      emit();
    }
    function setNumbers(on) {
      numbersOn = on;
      try { window.localStorage.setItem(NUMBERS_KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
      document.body.setAttribute('data-pt-numbers', on ? 'on' : 'off');
      emit();
    }
    function readStoredId() {
      try {
        const v = window.localStorage.getItem(STORAGE_KEY);
        return STYLES.some(s => s.id === v) ? v : DEFAULT_ID;
      } catch {
        return DEFAULT_ID;
      }
    }
    function writeStoredId(id) {
      try { window.localStorage.setItem(STORAGE_KEY, id); } catch { /* 隐私模式忽略 */ }
    }
    function styleById(id) {
      return STYLES.find(s => s.id === id) ?? STYLES[0];
    }
    function subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
    function emit() {
      for (const fn of listeners) { try { fn(); } catch { /* 单个订阅者异常不扩散 */ } }
    }

    /**
     * 把一套风格叠到界面上。
     *
     * 用一张带 !important 的样式表写 --dsw-alias-* 变量，而不是只靠 ctx.theme.overrideTokens：
     *   - 变量按 body:not([data-ds-dark-theme]) / body[data-ds-dark-theme] 两条规则给，
     *     所以明暗切换自动跟着走，不用监听事件；
     *   - !important 能盖住别的皮肤插件（如 dream-skin）直接写 body 的行内变量，
     *     否则它们后写就会把我们整层吃掉。
     * 同时仍调用 overrideTokens，让主题快照（含检查工具）也看得到这套值。
     */
    function applyStyle(id) {
      const style = styleById(id);
      currentId = style.id;
      writeStoredId(style.id);
      const tokens = deriveTokens(style);
      const ctx = activeCtx;
      if (ctx?.theme?.overrideTokens) ctx.theme.overrideTokens(SOURCE, tokens);
      paintVars(tokens);
      paintPaletteVars(style);
      document.body.setAttribute('data-pt-theme', style.id);
      document.body.setAttribute('data-pt-numbers', numbersOn ? 'on' : 'off');
      emit();
      // 探一次实际生效值：被别的皮肤盖住时给个提示
      window.setTimeout(() => {
        const dark = document.body.hasAttribute('data-ds-dark-theme');
        const expected = (tokens['--dsw-alias-brand-primary'] ?? {})[dark ? 'dark' : 'light'];
        if (!expected) return;
        const actual = getComputedStyle(document.body).getPropertyValue('--dsw-alias-brand-primary').trim();
        const next = actual.toLowerCase() !== String(expected).toLowerCase();
        if (next !== conflict) { conflict = next; emit(); }
      }, 600);
    }

    /**
     * 风格自身的几个色（不是 DSH token，是本插件自绘部件用的）：
     * 编号徽章、回复抬头、小宠背景等。
     */
    function paintPaletteVars(style) {
      const c = style.colors;
      let el = document.getElementById('pt-styles-palette');
      if (!el) {
        el = document.createElement('style');
        el.id = 'pt-styles-palette';
        el.setAttribute('data-plugin', 'dsh-pixel-themes');
        document.head.append(el);
      }
      el.textContent = `:root {\n`
        + `  --pt-accent: ${c.accent};\n`
        + `  --pt-on-accent: ${c.onAccent};\n`
        + `  --pt-ink: ${c.ink};\n`
        + `  --pt-ink-dark: ${c.inkDark};\n`
        + `  --pt-pencil: ${c.pencil};\n`
        + `  --pt-chip: ${c.chip};\n`
        + `  --pt-bubble: ${(style.bubbles ?? ['·'])[0] ?? '·'};\n`
        + `  --pt-bubble-color: ${c.bubble};\n`
        + `}\n`;
    }

    /** 变量样式表：亮/暗两条规则 + !important，换风格就整段替换。 */
    function paintVars(tokens) {
      const block = (mode) => Object.entries(tokens)
        .map(([name, pair]) => `  ${name}: ${pair[mode]} !important;`)
        .join('\n');
      const css = `body:not([data-ds-dark-theme]) {\n${block('light')}\n}\n`
        + `body[data-ds-dark-theme] {\n${block('dark')}\n}\n`;
      let el = document.getElementById('pt-styles-vars');
      if (!el) {
        el = document.createElement('style');
        el.id = 'pt-styles-vars';
        el.setAttribute('data-plugin', 'dsh-pixel-themes');
        document.head.append(el);
      }
      el.textContent = css;
    }

    // ---------------------------------------------------------------- 样式表
    const CSS = `
.pt-page { display: flex; flex-direction: column; gap: 16px; }
.pt-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.pt-title { font-size: 15px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.pt-sub { font-size: 12px; color: var(--dsw-alias-label-caption); }
.pt-reset { margin-left: auto; font-size: 12px; color: var(--dsw-alias-label-secondary); background: transparent;
  border: 0.5px solid var(--dsw-alias-border-l2); border-radius: 999px; padding: 4px 12px; cursor: pointer; }
.pt-reset:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; }
.pt-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 12px 8px 10px; border-radius: 14px; cursor: pointer; text-align: center;
  background: var(--dsw-alias-bg-layer-1); border: 0.5px solid var(--dsw-alias-border-l1);
  transition: transform .12s ease, border-color .12s ease, background .12s ease; }
.pt-card:hover { transform: translateY(-1px); background: var(--dsw-alias-bg-layer-2); }
.pt-card[data-on="1"] { border-color: var(--pt-accent, var(--dsw-alias-brand-primary)); box-shadow: 0 0 0 1px var(--pt-accent, var(--dsw-alias-brand-primary)) inset; }
.pt-name { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary); line-height: 1.2; }
.pt-name-en { font-size: 10px; color: var(--dsw-alias-label-caption); }
.pt-on { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%;
  background: var(--pt-accent, var(--dsw-alias-brand-primary)); }
.pt-sprite { display: flex; flex-direction: column; gap: 0; line-height: 0; height: 60px; justify-content: center; }
.pt-row { display: flex; }
.pt-px { display: block; width: 6px; height: 6px; }
.pt-plain { display: flex; align-items: center; justify-content: center; height: 60px; }
.pt-plain-swatch { display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: .02em; }
.pt-bubbles { font-size: 11px; color: var(--dsw-alias-label-tertiary); height: 14px; letter-spacing: 2px; }
.pt-chat-note { font-size: 12px; color: var(--dsw-alias-label-caption); line-height: 1.6; }
.pt-toggle { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.pt-toggle input { width: 14px; height: 14px; accent-color: var(--pt-accent); cursor: pointer; }
/* ---- 聊天区：消息编号 T01 / 回复 T01 ---- */
[data-chat-flow] { counter-reset: pt-turn; }
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="user"],
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="steering"] { counter-increment: pt-turn; }
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="user"]::before,
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="steering"]::before,
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="assistant-step"]::before {
  display: block; width: fit-content; margin-bottom: 4px; padding: 1px 7px; border-radius: 6px;
  font: 600 10px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em;
  font-variant-numeric: tabular-nums;
}
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="user"]::before,
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="steering"]::before {
  content: "T" counter(pt-turn, decimal-leading-zero);
  margin-left: auto; background: var(--pt-accent); color: var(--pt-on-accent);
}
/* 一轮里连续多个 assistant-step 只标第一个，免得一条回复挂好几个抬头 */
[data-chat-flow] [data-chat-flow-kind="assistant-step"]:has(+ [data-chat-flow-kind="assistant-step"])::before { display: none !important; }
body[data-pt-numbers="on"] [data-chat-flow] [data-chat-flow-kind="assistant-step"]::before {
  content: "回复 T" counter(pt-turn, decimal-leading-zero);
  color: var(--pt-ink); background: var(--pt-chip);
  border: 0.5px solid color-mix(in srgb, var(--pt-ink) 30%, transparent);
}
.pt-diag { font-size: 12px; color: var(--dsw-alias-label-caption); }
.pt-diag summary { cursor: pointer; }
.pt-diag-out { margin: 0; padding: 8px 10px; border-radius: 8px; background: var(--dsw-alias-markdown-code-block);
  color: var(--dsw-alias-label-secondary); font: 11px/1.6 ui-monospace, Menlo, monospace; white-space: pre-wrap; }
.pt-pet-wrap { position: relative; }
.pt-pet { display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 10px;
  cursor: pointer; background: transparent; border: 0; opacity: .9; transition: background .15s ease, opacity .15s ease; }
.pt-pet:hover { background: var(--dsw-alias-interactive-bg-hover); opacity: 1; }
.pt-pet .pt-sprite { height: 34px; }
.pt-pet .pt-px { width: 3px; height: 3px; }

/* ---- 输入框上方的风格横条 ---- */
.pt-bar { display: flex; align-items: center; gap: 10px; padding: 2px 4px; font-size: 11px;
  color: var(--dsw-alias-label-caption); min-width: 0; }
.pt-bar-mark { display: inline-flex; }
.pt-bar-mark .pt-sprite { height: 18px; }
.pt-bar-mark .pt-px { width: 2px; height: 2px; }
.pt-bar-name { font-weight: 600; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.pt-bar-cell { white-space: nowrap; font-variant-numeric: tabular-nums; }
.pt-bar-cell + .pt-bar-cell::before { content: "·"; margin-right: 10px; opacity: .5; }
.pt-bar-btn { margin-left: 2px; border: 0.5px solid var(--dsw-alias-border-l2); background: transparent;
  color: var(--dsw-alias-label-secondary); border-radius: 999px; padding: 1px 8px; font-size: 10px; cursor: pointer; }
.pt-bar-btn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--pt-ink); }

/* ---- A. 工具行/过程行外观 ---- */
[data-chat-flow-kind="turn-process"] { border-left: 2px solid color-mix(in srgb, var(--pt-ink) 26%, transparent);
  padding-left: 10px; margin-left: 1px; border-radius: 2px; transition: border-color .16s ease; }
[data-chat-flow-kind="turn-process"]:hover { border-left-color: var(--pt-accent); }
[data-chat-flow-kind="turn-process"] * { font-variant-numeric: tabular-nums; }
[data-chat-flow-kind="turn-process"] button:hover { background: var(--dsw-alias-interactive-bg-hover); }
[data-chat-flow-kind="turn-tail"] { color: var(--dsw-alias-label-tertiary); }
[data-chat-flow-kind="turn-tail"] * { font-variant-numeric: tabular-nums; }

/* ---- E. 悬停与装饰 ---- */
[data-chat-flow-kind="user"], [data-chat-flow-kind="steering"] { transition: background-color .14s ease; border-radius: 10px; position: relative; }
[data-chat-flow-kind="user"]:hover, [data-chat-flow-kind="steering"]:hover { background: color-mix(in srgb, var(--pt-ink) 6%, transparent); }
[data-chat-flow] [data-chat-flow-kind="user"]::before,
[data-chat-flow] [data-chat-flow-kind="steering"]::before,
[data-chat-flow] [data-chat-flow-kind="assistant-step"]::before { transition: transform .14s ease, box-shadow .14s ease; }
[data-chat-flow] [data-chat-flow-kind="user"]:hover::before,
[data-chat-flow] [data-chat-flow-kind="steering"]:hover::before {
  transform: translateY(-1px) scale(1.06);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--pt-accent) 45%, transparent);
}
[data-chat-flow] [data-chat-flow-kind="assistant-step"]:hover::before {
  background: var(--pt-accent); color: var(--pt-on-accent);
  border-color: transparent;
}
/* 风格的小装饰字符：挂在用户消息左下的空气里 */
[data-chat-flow-kind="user"]::after, [data-chat-flow-kind="steering"]::after {
  content: var(--pt-bubble); position: absolute; right: calc(100% + 8px); bottom: 2px;
  color: var(--pt-bubble-color); opacity: 0; font-size: 11px; line-height: 1; pointer-events: none;
  transition: opacity .16s ease, transform .16s ease; transform: translateX(3px);
}
[data-chat-flow-kind="user"]:hover::after, [data-chat-flow-kind="steering"]:hover::after {
  opacity: .55; transform: translateX(0);
}
@media (prefers-reduced-motion: reduce) {
  [data-chat-flow-kind]::before, [data-chat-flow-kind]::after,
  [data-chat-flow-kind="user"], [data-chat-flow-kind="turn-process"] { transition: none !important; }
}
/* 横条触发的浮层：贴着输入框右上 */

.pt-pop-veil { position: fixed; inset: 0; z-index: 79; background: transparent; }
.pt-pop { position: fixed; left: 12px; bottom: 60px; z-index: 80; width: 340px; max-height: 70vh; overflow: auto;
  padding: 12px 12px 14px; border-radius: 16px; background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2));
  box-shadow: var(--dsw-elevation-panel, 0 10px 30px rgba(0, 0, 0, .22));
  border: 0.5px solid var(--dsw-alias-border-l2); }
.pt-pop-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.pt-pop-x { border: 0; background: transparent; color: var(--dsw-alias-label-tertiary); font-size: 18px; line-height: 1;
  cursor: pointer; padding: 0 4px; }
.pt-pop-x:hover { color: var(--dsw-alias-label-primary); }
.pt-pop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px; }
.pt-pop-card { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 4px 5px;
  border-radius: 10px; border: 0.5px solid transparent; background: var(--dsw-alias-bg-layer-1); cursor: pointer; }
.pt-pop-card:hover { background: var(--dsw-alias-bg-layer-2); }
.pt-pop-card[data-on="1"] { border-color: var(--pt-accent); background: var(--dsw-alias-bg-layer-2); }
.pt-pop-card .pt-sprite { height: 26px; }
.pt-pop-card .pt-px { width: 3px; height: 3px; }
.pt-pop-name { font-size: 10px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; max-width: 100%; }
.pt-pop .pt-toggle { justify-content: flex-end; }
.pt-warn { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-state-warn-primary);
  background: var(--dsw-alias-state-warn-tertiary); border-radius: 10px; padding: 8px 12px; }
.pt-foot { display: flex; gap: 8px; align-items: center; font-size: 11px; color: var(--dsw-alias-label-caption); }
.pt-chip { padding: 2px 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2);
  border: 0.5px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); }
.pt-pop.pt-pop--bar { left: auto; right: 24px; bottom: 150px; }
`;

    function injectCss() {
      const id = 'pt-styles-css';
      if (document.getElementById(id)) return;
      const el = document.createElement('style');
      el.id = id;
      el.setAttribute('data-plugin', 'dsh-pixel-themes');
      el.textContent = CSS;
      document.head.append(el);
    }

    // ---------------------------------------------------------------- 组件
    /** 16×10 的像素小画：按 palette 上色，多帧自动轮播。 */
    function Sprite({ style }) {
      const frames = style.sprite?.frames ?? null;
      const [frame, setFrame] = React.useState(0);
      React.useEffect(() => {
        if (!frames || frames.length < 2) return undefined;
        const timer = window.setInterval(() => setFrame(f => (f + 1) % frames.length), 700);
        return () => window.clearInterval(timer);
      }, [style.id, frames ? frames.length : 0]);
      if (!frames || frames.length === 0) {
        return h('div', { className: 'pt-plain' },
          h('span', {
            className: 'pt-plain-swatch',
            style: { background: style.colors.chip, color: style.colors.ink },
          }, 'Aa'));
      }
      const grid = frames[frame % frames.length];
      const palette = style.sprite.palette ?? {};
      return h('div', { className: 'pt-sprite', 'aria-hidden': 'true' },
        grid.map((row, y) => h('div', { className: 'pt-row', key: y },
          row.split('').map((ch, x) => h('span', {
            className: 'pt-px',
            key: x,
            style: { background: ch === '.' ? 'transparent' : (palette[ch] ?? 'transparent') },
          })))));
    }


    /** 设置页里的主题卡片。 */
    function Card({ style, selected, onPick, lang }) {
      return h('button', {
        type: 'button',
        className: 'pt-card',
        'data-on': selected ? '1' : '0',
        style: { '--pt-accent': style.colors.accent },
        onClick: () => onPick(style.id),
        title: `${style.name.zh} · ${style.name.en}`,
      },
      selected ? h('span', { className: 'pt-on' }) : null,
      h(Sprite, { style }),
      h('div', { className: 'pt-name' }, style.name[lang] ?? style.name.zh),
      lang === 'zh' ? h('div', { className: 'pt-name-en' }, style.name.en) : h('div', { className: 'pt-name-en' }, style.name.zh),
      h('div', { className: 'pt-bubbles' }, (style.bubbles ?? []).slice(0, 3).join(' ')));
    }

    /** 界面语言：优先跟随 DSH 的 <html lang>，其次系统语言。 */
    function uiLang() {
      const html = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (html) return html.startsWith('zh') ? 'zh' : 'en';
      return (navigator.language || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    }

    /** 浮层里的风格网格：点一下立即换。 */
    function Picker({ lang, onClose }) {
      const [id, setId] = React.useState(currentId);
      React.useEffect(() => subscribe(() => setId(currentId)), []);
      return h('div', { className: 'pt-pop-inner' },
        h('div', { className: 'pt-pop-head' },
          h('span', { className: 'pt-title' }, lang === 'zh' ? '主题风格' : 'Pixel themes'),
          h('button', { type: 'button', className: 'pt-pop-x', onClick: onClose, 'aria-label': 'close' }, '×')),
        h('div', { className: 'pt-pop-grid' },
          STYLES.map(st => h('button', {
            key: st.id,
            type: 'button',
            className: 'pt-pop-card',
            'data-on': st.id === id ? '1' : '0',
            style: { '--pt-accent': st.colors.accent },
            onClick: () => applyStyle(st.id),
            title: `${st.name.zh} · ${st.name.en}`,
          },
          h(Sprite, { style: st }),
          h('span', { className: 'pt-pop-name' }, st.name[lang] ?? st.name.zh)))),
        h('label', { className: 'pt-toggle' },
          h('input', { type: 'checkbox', checked: numbersOn, onChange: (e) => setNumbers(e.target.checked) }),
          h('span', {}, lang === 'zh' ? '消息编号 T01 / 回复 T03' : 'Message numbers')),
        conflict ? h('div', { className: 'pt-warn' },
          lang === 'zh' ? '别的皮肤插件在本插件之后改写了配色，本主题可能被盖住。' : 'Another skin plugin rewrote the palette after this one.',
          h('button', { type: 'button', className: 'pt-reset', style: { marginLeft: 8 }, onClick: () => applyStyle(currentId) },
            lang === 'zh' ? '重新应用' : 'Reapply')) : null,
        debugOn() ? h(Diagnostics, { lang }) : null);
    }

    /** 自检只在排查时出现：控制台执行 localStorage.setItem('pt-debug','1') 后刷新可见。 */
    function debugOn() {
      try { return window.localStorage.getItem('pt-debug') === '1'; } catch { return false; }
    }

    /** 自检面板：万一编号不显示，这里能直接看出插件看到了什么。 */

    /** 设置 → 主题风格（整页画廊）。 */
    function ThemeSection() {
      const [id, setId] = React.useState(currentId);
      React.useEffect(() => subscribe(() => setId(currentId)), []);
      const lang = uiLang();
      const style = styleById(id);
      return h('div', { className: 'pt-page' },
        h('div', { className: 'pt-head' },
          h('div', { className: 'pt-title' }, lang === 'zh' ? '主题风格' : 'Pixel themes'),
          h('div', { className: 'pt-sub' }, lang === 'zh'
            ? `${STYLES.length} 套 · 当前 ${style.name.zh}`
            : `${STYLES.length} themes · now ${style.name.en}`),
          h('button', { type: 'button', className: 'pt-reset', onClick: () => applyStyle(DEFAULT_ID) },
            lang === 'zh' ? '回到默认' : 'Reset')),
        h('label', { className: 'pt-toggle' },
          h('input', { type: 'checkbox', checked: numbersOn, onChange: (e) => setNumbers(e.target.checked) }),
          h('span', {}, lang === 'zh' ? '聊天区消息编号 T01 / 回复 T03' : 'Message numbers T01 / reply tags')),
        h('div', { className: 'pt-grid' },
          STYLES.map(st => h(Card, { key: st.id, style: st, selected: st.id === id, onPick: applyStyle, lang }))),
        conflict ? h('div', { className: 'pt-warn' },
          lang === 'zh'
            ? '检测到别的皮肤插件在本插件之后改写配色，本主题可能被盖住。建议只保留一个皮肤，或点右侧重新应用。'
            : 'Another skin plugin rewrote the palette after this one. Keep a single skin, or press Reapply.',
          h('button', { type: 'button', className: 'pt-reset', style: { marginLeft: 8 }, onClick: () => applyStyle(currentId) },
            lang === 'zh' ? '重新应用' : 'Reapply')) : null,
        debugOn() ? h(Diagnostics, { lang }) : null,
        h('div', { className: 'pt-foot' },
          h('span', { className: 'pt-chip' }, lang === 'zh' ? '配色 + 像素小画' : 'palette + pixel sprite'),
          h('span', {}, lang === 'zh'
            ? '主题叠加在亮/暗之上，切换明暗仍然生效；选择记在本机。'
            : 'Themes stack over light/dark; the choice is kept on this machine.'),
          h('span', { className: 'pt-chip' }, 'MIT')));
    }

    function Diagnostics({ lang }) {
      const [info, setInfo] = React.useState(null);
      const scan = () => {
        const rows = document.querySelectorAll('[data-chat-flow-kind]').length;
        const users = document.querySelectorAll('[data-chat-flow] [data-chat-flow-kind="user"]').length;
        const assistants = document.querySelectorAll('[data-chat-flow] [data-chat-flow-kind="assistant-step"]').length;
        const flows = document.querySelectorAll('[data-slot="conversation.chat.flow"]').length;
        const columns = document.querySelectorAll('[data-chat-flow]').length;
        const first = document.querySelector('[data-chat-flow] [data-chat-flow-kind="user"]');
        setInfo({
          numbers: document.body.getAttribute('data-pt-numbers'),
          style: document.body.getAttribute('data-pt-theme'),
          css: Boolean(document.getElementById('pt-styles-css')),
          vars: Boolean(document.getElementById('pt-styles-vars')),
          columns, flows, rows, users, assistants,
          before: first ? getComputedStyle(first, '::before').content : '-',
        });
      };
      return h('details', { className: 'pt-diag' },
        h('summary', {}, lang === 'zh' ? '自检（编号不显示时点这里）' : 'Self-check'),
        h('button', { type: 'button', className: 'pt-reset', onClick: scan, style: { margin: '8px 0' } },
          lang === 'zh' ? '扫描当前页面' : 'Scan page'),
        info ? h('pre', { className: 'pt-diag-out' }, JSON.stringify(info, null, 1)) : null);
    }


    /** 把投影值里的数字安全取出来，没有就不显示。 */
    function num(value) {
      return typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    function fmtTokens(n) {
      if (n === null) return null;
      if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
      return String(n);
    }

    /**
     * 输入框上方的风格横条：风格小宠 + 上下文占比 + 累计 token + 轮/步 + 换风格。
     * 数据来自会话投影（contextPressure / tokenUsage / sessionStats），拿不到就只显示风格和消息数。
     */
    function StyleBar(props) {
      const [state, setState] = React.useState({ id: currentId, picker: pickerAnchor });
      React.useEffect(() => subscribe(() => setState({ id: currentId, picker: pickerAnchor })), []);
      const style = styleById(state.id);
      const lang = uiLang();

      // 会话投影（插件拿不到就跳过，不能抛）
      let pressure = null, usage = null, stats = null;
      try { pressure = props.useProjection?.('contextPressure') ?? null } catch { pressure = null }
      try { usage = props.useProjection?.('tokenUsage') ?? null } catch { usage = null }
      try { stats = props.useProjection?.('sessionStats') ?? null } catch { stats = null }

      const ctxWindow = num(pressure?.contextWindow);
      const ctxTokens = num(pressure?.projectedTokens) ?? num(pressure?.pressureTokens);
      const ctxPct = ctxWindow && ctxTokens !== null ? Math.min(100, Math.round((ctxTokens / ctxWindow) * 100)) : null;

      const t = usage?.totals ?? usage ?? null; // 预留：以后要在横条里显示 token 时用
      const totalTokens = t
        ? (num(t.uncachedInputTokens) ?? 0) + (num(t.outputTokens) ?? 0)
          + (num(t.cacheReadTokens) ?? 0) + (num(t.cacheWriteTokens) ?? 0)
        : null;

      return h('div', { className: 'pt-bar', style: { '--pt-accent': style.colors.accent } },
        h('span', { className: 'pt-bar-mark' }, h(Sprite, { style })),
        h('span', { className: 'pt-bar-name' }, style.name[lang] ?? style.name.zh),
        ctxPct !== null ? h('span', { className: 'pt-bar-cell' },
          lang === 'zh' ? `上下文 ${ctxPct}%` : `context ${ctxPct}%`) : null,
        h('button', {
          type: 'button',
          className: 'pt-bar-btn',
          onClick: () => setPicker('bar'),
        }, lang === 'zh' ? '换风格' : 'Style'),
        state.picker === 'bar' ? h(React.Fragment, null,
          h('div', { className: 'pt-pop-veil', onClick: () => setPicker(null) }),
          h('div', { className: 'pt-pop pt-pop--bar', role: 'dialog' },
            h(Picker, { lang, onClose: () => setPicker(null) }))) : null);
    }

    // ---------------------------------------------------------------- 插件入口
    const inject = ['slots', 'theme'];

    function apply(ctx) {
      activeCtx = ctx;
      injectCss();
      applyStyle(currentId);

      ctx.effect?.(() => () => {
        document.getElementById('pt-styles-vars')?.remove();
        document.body.removeAttribute('data-pt-theme');
      }, 'pt-styles: paint cleanup');

      ctx.slots.inject('settings.section', () => {
        const off = ctx.slots.register(
          { name: 'settings.section', id: 'pt-styles', order: 45, label: () => '主题风格' },
          ThemeSection);
        return typeof off === 'function' ? off : () => {};
      });

      ctx.slots.inject('conversation.composer.dock', () => {
        const off = ctx.slots.register({ name: 'conversation.composer.dock', id: 'pt-bar', order: 40 }, StyleBar);
        return typeof off === 'function' ? off : () => {};
      });
    }

    exports.name = 'dsh-pixel-themes';
    exports.inject = inject;
    exports.apply = apply;
    exports.deriveTokens = deriveTokens;
    exports.STYLES = STYLES;
    return module.exports;
  },
});
