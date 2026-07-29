// const imgs = [
//     'assets/img/particles/autumn_leaf1.webp',
//     'assets/img/particles/autumn_leaf2.webp',
//     'assets/img/particles/big_leaf.webp',
//     'assets/img/particles/dandelion.webp',
//     'assets/img/particles/gold_leaf.webp',
//     'assets/img/particles/great-ball.webp',
//     'assets/img/particles/leaf1.webp',
//     'assets/img/particles/leaf2.webp',
//     'assets/img/particles/pokeball.webp',
//     'assets/img/particles/polem.webp',
//     'assets/img/particles/sakura.webp',
//     'assets/img/particles/smoke.webp',
//     'assets/img/particles/snow.webp',
//     'assets/img/particles/ultra-ball.webp',
//     'assets/img/particles/wheat.webp',
// ]

// imgs.forEach(imagem => {
//     const img = new Image();

//     img.src = imagem;

//     img.onload = () => {

//         const canvas = document.createElement("canvas");

//         canvas.width = 64;
//         canvas.height = 64;

//         const ctx = canvas.getContext("2d");

//         ctx.drawImage(img, 0, 0, 64, 64);

//         canvas.toBlob(blob => {
//             const url = URL.createObjectURL(blob);

//             const link = document.createElement("a");

//             link.href = url;
//             link.download = imagem;

//             link.click();

//             URL.revokeObjectURL(url);

//         }, "image/webp", 0.8);
//     };
// })

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const entrada = "../assets/img/pokemon/webp";
const saida = "../assets/img/pokemon64/webp";

if (!fs.existsSync(saida)) {
    fs.mkdirSync(saida, { recursive: true });
}

const arquivos = fs.readdirSync(entrada).filter(a => a.endsWith(".webp"));

Promise.all(
    arquivos.map(arquivo =>
        sharp(path.join(entrada, arquivo))
            .resize(96, 96)
            .webp({ lossless: true, effort: 6 })
            .toFile(path.join(saida, arquivo))
    )
).then(() => {
    console.log("1025 imagens convertidas.");
});