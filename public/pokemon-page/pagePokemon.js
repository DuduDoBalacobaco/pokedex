import { c, criarElemento } from "../js/helpers/helpers.js"

const imgs = document.querySelector('.imgs-pokemon')
const name = document.querySelector('.name-pokemon')
const types = document.querySelector('.types')
const maior = document.getElementById('maior')
const menor = document.getElementById('menor')

maior.style.display = 'none'

export async function mudarPagina(){
    // const name = location.pathname.split("/").pop()
    
    const response = await fetch(`pokemon-page/json/bulbasaur.json`)
    const pokemon = await response.json()

    console.log(pokemon);
    
    document.title = `Pokémon - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    montarPagina(pokemon)
}

function montarPagina(pokemon){
    const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

    const text = criarElemento('p', 'nome')
    text.textContent = `${pokemon.id} - ${nome}`

    const img = personalizarImg(pokemon.artwork, 'img')
    const img_shiny = personalizarImg(pokemon.artwork_shiny, 'img_shiny')

    menor.addEventListener('click', () => {
        mudarImg('-100%', img, img_shiny, maior, menor)
        text.textContent = `${pokemon.id} - Shiny ${nome}`
    })

    maior.addEventListener('click', () => {
        mudarImg('0%', img, img_shiny, menor, maior)
        text.textContent = `${pokemon.id} - ${nome}`
    })

    criarTypes(pokemon)
    
    imgs.style.background = `url(${pokemon.habitat_img})`

    name.append(text)
}





function personalizarImg(src, img){
    const imagem = criarElemento('img', img)
    imagem.src = `./pokemon-page/${src}`

    imgs.append(imagem)

    return imagem
}

function criarTypes(pokemon){
    const type1 = criarElemento('p', 'pokemon_type')
    type1.textContent = pokemon.type[0]
    type1.classList.add(pokemon.type[0])
    types.append(type1)

    if(pokemon.type[1]){
        const type2 = criarElemento('p', 'pokemon_type')
        type2.textContent = pokemon.type[1]
        type2.classList.add(pokemon.type[1])
        types.append(type2)
    }
}












function mudarImg(move, img1, img2, btn, click){
    img1.style.transition = 'transform 1s ease-in-out'
    img2.style.transition = 'transform 1s ease-in-out'
    click.style.display = 'none'

    img1.style.transform = `translateX(${move})`
    img2.style.transform = `translateX(${move})`

    img1.addEventListener('transitionend', () => {
        btn.style.display = 'block'
    }, { once: true })
}

function blockImg(btn){
    btn.style.display = 'block'
}

mudarPagina()