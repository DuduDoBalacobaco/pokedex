import { c, criarElemento } from "../js/helpers/helpers.js"

const imgs = document.querySelector('.imgs-pokemon')
const name = document.querySelector('.name-pokemon')

export async function mudarPagina(){
    const id = Number(location.pathname.split("/").pop())

    const response = await fetch('/assets/json/kanto.json')
    const pokemons = await response.json()

    const pokemon = pokemons.find(p => p.id === id)

    montarPagina(pokemon)
}

function montarPagina(pokemon){
    document.title = `Pokémon - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    const img = criarElemento('img', 'img-normal')
    img.src = `/${pokemon.sprite}`

    const text = criarElemento('p', 'nome')
    text.textContent = `${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    imgs.append(img, text)
}

mudarPagina()