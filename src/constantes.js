export const regioes = [
    { region: 'kanto', inicio: 1, fim: 151},
    { region: 'johto', inicio: 152, fim: 251 },
    { region: 'hoenn', inicio: 252, fim: 386 },
    { region: 'sinnoh', inicio: 387, fim: 493 },
    { region: 'unova', inicio: 494, fim: 649 },
    { region: 'kalos', inicio: 650, fim: 721 },
    { region: 'alola', inicio: 722, fim: 809 },
    { region: 'galar', inicio: 810, fim: 905 },
    { region: 'paldea', inicio: 906, fim: 1025 }
]

export const arquivos = [
    'assets/json/kanto.json',
    'assets/json/johto.json',
    'assets/json/hoenn.json',
    'assets/json/sinnoh.json',
    'assets/json/unova.json',
    'assets/json/kalos.json',
    'assets/json/alola.json',
    'assets/json/galar.json',
    'assets/json/paldea.json'
]

export const tipos = ['normal', 'fire', 'water','electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']

export const region = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea']

export const imgs = {
    neve: ["assets/img/particles/snow.webp"],
    folha: ["assets/img/particles/leaf1.webp", "assets/img/particles/leaf2.webp"],
    autumn: ["assets/img/particles/autumn_leaf1.webp", "assets/img/particles/autumn_leaf2.webp", "assets/img/particles/sakura.webp"],
    polem: ["assets/img/particles/polem.webp", "assets/img/particles/big_leaf.webp"],
    smoke: ["assets/img/particles/smoke.webp"],
    dandelion: ["assets/img/particles/dandelion.webp", "assets/img/particles/polem.webp"],
    golden: ["assets/img/particles/gold_leaf.webp", "assets/img/particles/wheat.webp"],
    pokeball : ["assets/img/particles/pokeball.webp", "assets/img/particles/great-ball.webp", "assets/img/particles/ultra-ball.webp"]
}

export const imagens = {}

export const escala = 1

export const regioesEfeitos = {
    default:{
        tipo:"pokeball",
        quantidade:20,
        cor:"#000000",
        velocidade:0.5,
        tamanho:[10,25],
        vento:1
    },

    kanto:{
        tipo:"folha",
        quantidade:25,
        cor:"#9acd32",
        velocidade:0.5,
        tamanho:[10,25],
        vento:0.5
    },

    johto:{
        tipo:"autumn",
        quantidade:25,
        cor:"#ffb7d5",
        velocidade:0.8,
        tamanho:[10,25],
        vento:0.8
    },

    hoenn:{
        tipo:"polem",
        quantidade:25,
        cor:"#4caf50",
        velocidade:1,
        tamanho:[10,18],
        vento:2
    },

    sinnoh:{
        tipo:"neve",
        quantidade:30,
        velocidade:0.8,
        tamanho:[6,18],
        vento:0.4
    },

    unova:{
        tipo:"smoke",
        quantidade:8,
        cor:"#ffffff",
        velocidade:0.05,
        tamanho:[90,150],
        vento:-0.3
    },

    kalos:{
        tipo:"dandelion",
        quantidade:25,
        cor:"#ff8fc7",
        velocidade:0.7,
        tamanho:[10,15],
        vento:0.8
    },

    alola:{
        tipo:"polem",
        quantidade:25,
        cor:"#f6e58d",
        velocidade:0.6,
        tamanho:[10,16],
        vento:1.8
    },

    galar:{
        tipo:"dandelion",
        quantidade:25,
        cor:"#8fd3ff",
        velocidade:2,
        tamanho:[8,16],
        vento:-2
    },

    paldea:{
        tipo:"golden",
        quantidade:25,
        cor:"#ffd54f",
        velocidade:0.6,
        tamanho:[10,16],
        vento:1
    }
}

export const fps = 15

export const frameTime = 1000 / fps