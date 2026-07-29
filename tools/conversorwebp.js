function criarWebp(){

    const fotos = [
        "assets/img/region-option-2/png/alola.png",
        "assets/img/region-option-2/png/galar.png",
        "assets/img/region-option-2/png/hoenn.png",
        "assets/img/region-option-2/png/johto.png",
        "assets/img/region-option-2/png/kalos.png",
        "assets/img/region-option-2/png/kanto.png",
        "assets/img/region-option-2/png/paldea.png",
        "assets/img/region-option-2/png/sinnoh.png",
        "assets/img/region-option-2/png/unova.png"
    ];

    const qualidade = 0.75;

    fotos.forEach(nome => {

        const img = new Image();

        img.src = nome;

        img.onload = () => {

            const canvas = document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(blob => {

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");

                link.href = url;

                link.download = nome.replace(/\.png$/i, ".webp");

                link.click();

                URL.revokeObjectURL(url);
                
            }, "image/webp", qualidade);

        };

    });

}

criarWebp()

// import sharp from "sharp";
// import fs from "fs";

// const pastaEntrada = "../Documents/pokedexPokemon/assets/img/region-option1";
// const pastaSaida = "../Downloads";

// if (!fs.existsSync(pastaSaida)) {
//     fs.mkdirSync(pastaSaida);
// }


// async function converter() {

//     for (let id = 1; id <= 1025; id++) {

//         const entrada = `${pastaEntrada}/${id}.png`;
//         const saida = `${pastaSaida}/${id}.webp`;

//         await sharp(entrada)
//             .webp({ quality: 75 })
//             .toFile(saida);

//         console.log(`Convertido ${id}`);
//     }

// }

// converter();