import { regioes, arquivos } from './constantes.js'
import { btnFiltra, btnRemove, show_pokemon, search, idMin, idMax, sliderRange, minText, maxText } from './elementos.js'
import { skeleton, removerSkeleton } from './skeleton/skeleton.js'
import { criarElemento, c } from './helpers/helpers.js'
import { aplicarFiltros, removerFiltros } from './filters/filters.js'
import { observerBandeira, observarRegion, observarUltimo } from './observer/observer.js'

let inicio = 0
let corte = 36
let ultimoObservado = null
let pokemonsCarregados = []
let pokemonsRenderizados = []

btnFiltra.addEventListener('click', aplicarFiltros)
btnRemove.addEventListener('click', removerFiltros)
search.addEventListener('input', aplicarFiltros)
idMin.addEventListener("input", atualizarSlider)
idMax.addEventListener("input", atualizarSlider)

const fimregiao = regioes.map(reg => reg.fim)
const inicioregiao = regioes.map(reg => reg.inicio)

export function setInicio(){
    inicio = 0
}

export function setPokemonsRenderizados(){
    pokemonsRenderizados = []
}

export function getPokemonsCarregados(){
    return pokemonsCarregados
}






export const carregaMaisPokemon = () => {
    if(inicio >= pokemonsCarregados.length) return

    const carregar = pokemonsCarregados.slice(inicio, inicio + corte)

    pokedex(carregar)

    pokemonsRenderizados.push(...carregar)
    inicio += corte
}





const pokemonjson = async (filtro = true) => {
    skeleton(30, false)

    const todosPokemons = (
        await Promise.all(
            arquivos.map(async arquivo => {
                const response = await fetch(arquivo)
                return response.json()
            })
        )
    ).flat()

    const pokemon = todosPokemons.map((poke, index) => ({
        name: poke.name,
        id: poke.id,
        types: poke.types,
        sprite: poke.sprite ,
        habitat: poke.habitat,
        img_regiao: poke.img_regiao,
        region : poke.region
    }))

    if(filtro){
        pokemonsCarregados.push(...pokemon)
    }

    removerSkeleton()

    const renderizar = pokemonsCarregados.slice(inicio, inicio + corte)

    pokedex(renderizar)

    pokemonsRenderizados.push(...renderizar)

    inicio += corte
}




export const pokedex = (pokemons, filtro = true, region)=> {
    const fragment = document.createDocumentFragment()
    const marcadores = []
    let ultimoPokemon = false
    
    pokemons.forEach((pokemon, i) => {
        const card = criarElemento('div', 'cards')
        card.dataset.regiao = pokemon.region
        card.style.backgroundImage = `url(${pokemon.habitat})`

        card.addEventListener('click', () => {
            window.location.href = `/pokemon/${pokemon.name}`
        })

        const id = Number(pokemon.id)

        if(inicioregiao.includes(id) || fimregiao.includes(id)){
            marcadores.push(card)
        }

        const img = criarElemento('img', 'pokemon_img')
        img.src = pokemon.sprite
        img.loading = 'lazy'
        img.alt = pokemon.name

        const info = criarElemento('div', 'pokemon_info')

        const types = criarElemento('div', 'types')

        const type1 = criarElemento('p', 'pokemon_type')
        type1.textContent = pokemon.types[0]
        type1.classList.add(pokemon.types[0])
        types.append(type1)

        if(pokemon.types[1]){
            const type2 = criarElemento('p', 'pokemon_type')
            type2.textContent = pokemon.types[1]
            type2.classList.add(pokemon.types[1])
            types.append(type2)
        }

        ultimoPokemon = id === 1025 ? true : false

        const span_nome = criarElemento('span', 'pokemon_name')
        span_nome.classList.add('pokemon_id')
        span_nome.textContent =  `${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

        if(inicioregiao.includes(id) && filtro){
            fragment.append(criarBandeira(pokemon.region, `Início da região de ${pokemon.region.charAt(0).toUpperCase() + pokemon.region.slice(1)}`))
        }

        info.append(span_nome)
        card.append(img, types, info)
        
        fragment.appendChild(card) 
    })

    show_pokemon.appendChild(fragment)

    observarRegion(marcadores)

    if(filtro && !ultimoPokemon){
        observarUltimo()
    }
}

const criarBandeira = (pokemon, texto, classe) => {
    const bandeira = criarElemento('div', 'bandeira')
    bandeira.classList.add(pokemon)

    bandeira.dataset.regiao = pokemon
    bandeira.textContent = texto

    observerBandeira(bandeira)

    return bandeira
}






export function atualizarSlider(){
    if(Number(idMin.value) > Number(idMax.value)){
        idMin.value = idMax.value
    }

    const min = Number(idMin.min)
    const max = Number(idMin.max)

    const left = ((idMin.value - min) / (max - min)) * 100
    const right = ((idMax.value - min) / (max - min)) * 100

    sliderRange.style.left = `${left}%`
    sliderRange.style.width = `${right - left}%`

    minText.textContent = idMin.value
    maxText.textContent = idMax.value
}

atualizarSlider()





pokemonjson()