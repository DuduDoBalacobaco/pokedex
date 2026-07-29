import fs from 'fs';
import https from 'https';

const pasta = '../pokedexPokemon/assets/pokemon';

if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
}

function baixarImagem(url, destino) {
    return new Promise((resolve, reject) => {
        const arquivo = fs.createWriteStream(destino);

        https.get(url, resposta => {

            if (resposta.statusCode !== 200) {
                reject(`Erro ${resposta.statusCode}: ${url}`);
                return;
            }

            resposta.pipe(arquivo);

            arquivo.on('finish', () => {
                arquivo.close();
                resolve();
            });

        }).on('error', erro => {
            fs.unlink(destino, () => {});
            reject(erro);
        });
    });
}


async function iniciar() {

    for (let id = 1; id <= 1025; id++) {

        const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        try {
            await baixarImagem(
                url,
                `${pasta}/${id}.png`
            );

            console.log(`✅ Baixou ${id}`);

        } catch (erro) {
            console.log(`❌ Falhou ${id}`, erro);
        }
    }
}

iniciar();