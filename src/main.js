import { mudarParticulas } from './particles.js'
import { regioes, arquivos, tipos, region } from './constantes.js'
import { btnFiltra, btnRemove, show_pokemon, search, idMin, idMax, sliderRange, minText, maxText, all, ambos, tipo_unico, dois_tipos } from './elementos.js'
import { skeleton, removerSkeleton } from './skeleton/skeleton.js'
import { criarElemento, c } from './helpers/helpers.js'

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

const carregaMaisPokemon = () => {
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





const pokedex = (pokemons, filtro = true, region)=> {
    const fragment = document.createDocumentFragment()
    const marcadores = []
    let ultimoPokemon = false
    
    pokemons.forEach((pokemon, i) => {
        const card = criarElemento('div', 'cards')
        card.dataset.regiao = pokemon.region
        card.style.backgroundImage = `url(${pokemon.habitat})`

        const id = Number(pokemon.id)

        if(inicioregiao.includes(id) || fimregiao.includes(id)){
            marcadores.push(card)
        }

        const img = criarElemento('img', 'pokemon_img')
        img.src = pokemon.sprite
        img.loading = 'lazy'

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

    marcadores.forEach(card => observerRegion.observe(card))

    if(filtro && !ultimoPokemon){
        observarUltimo()
    }
}

const criarBandeira = (pokemon, texto, classe) => {
    const bandeira = criarElemento('div', 'bandeira')
    bandeira.classList.add(pokemon)

    bandeira.dataset.regiao = pokemon
    bandeira.textContent = texto

    observerRegion.observe(bandeira)

    return bandeira
}






function gerarCombinacoes(tipos) {
    const combinacoes = []

    for (let i = 0; i < tipos.length; i++) {
        for (let j = i + 1; j < tipos.length; j++) {
            combinacoes.push([tipos[i], tipos[j]])
        }
    }

    return combinacoes
}

function aplicarFiltros(){
    const texto = search.value.toLowerCase()
    const checados = tipos.filter(u => document.getElementById(u).checked)
    const checkRegion = region.filter(u => document.getElementById(u).checked)
    const idmax = Number(idMax.value)
    const idmin = Number(idMin.value)

    if(texto !== '' || checados.length > 0 || checkRegion.length > 0 || (idmin !== 1 || idmax !== 1025) || !all.checked){
        if(ultimoObservado){
            observer.unobserve(ultimoObservado)
            ultimoObservado = null
        }
    }

    if (texto === '' && checados.length === 0 && checkRegion.length === 0 && (idmax === 1025 && idmin === 1) && all.checked){ 
        inicio = 0
        pokemonsRenderizados = []
        show_pokemon.replaceChildren()
        carregaMaisPokemon()
        return
    }

    let resultado = {
        pokemons: pokemonsCarregados,
        region: checkRegion
    }

    if(idmin !== 1 || idmax !== 1025){
        resultado.pokemons = resultado.pokemons.filter(pokemon => pokemon.id >= idmin && pokemon.id <= idmax)
    }

    if(checados.length > 0){
        resultado.pokemons = resultado.pokemons.filter(pokemon => checados.some(u => pokemon.types.includes(u)))
    }

    if(checkRegion.length > 0){
        resultado.pokemons = resultado.pokemons.filter(pokemon => checkRegion.includes(pokemon.region))
    }

    if(texto !== ""){
        resultado.pokemons = resultado.pokemons.filter(pokemon => pokemon.name.includes(texto) || pokemon.id.toString().includes(texto))
    }

    if(tipo_unico.checked){
        resultado.pokemons = resultado.pokemons.filter(pokemon => pokemon.types.length === 1)
    }

    if(dois_tipos.checked){
        resultado.pokemons = resultado.pokemons.filter(pokemon => pokemon.types.length === 2)
    }

    if(ambos.checked){
        const combinacoes = gerarCombinacoes(checados)

        resultado.pokemons = resultado.pokemons.filter(pokemon => combinacoes.some(combinacao => combinacao.every(tipo => pokemon.types.includes(tipo))))
    }

    show_pokemon.replaceChildren()

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })

    pokedex(resultado.pokemons, false)
}

function removerFiltros(){
    idMin.value = 1
    idMax.value = 1025
    atualizarSlider()

    search.value = ''
    
    tipos.forEach(tipo => { 
        document.getElementById(tipo).checked = false
    })

    region.forEach(region => { 
        document.getElementById(region).checked = false
    })

    all.checked = 'true'

    aplicarFiltros()
}





const observer = new IntersectionObserver(entries => {     
    entries.forEach(entry => {
        if (!entry.isIntersecting) return

        if (entry.target === ultimoObservado) {
            carregaMaisPokemon()
        }
    })
}, { rootMargin: "0px 0px 100% 0px" ,threshold: 0 })

function observarUltimo(){
    if(ultimoObservado){
        observer.unobserve(ultimoObservado)
    }

    ultimoObservado = show_pokemon.lastElementChild
    observer.observe(ultimoObservado)
}

const observerRegion = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(!entry.isIntersecting) return

        const regiao = entry.target.dataset.regiao

        document.body.style.backgroundImage = `url(assets/img/region-option-1/webp/${regiao}2.webp)`

        mudarParticulas(regiao)

    })
}, { rootMargin: "0px 0px -70% 0px" ,threshold: 0 })

export const observerSkeleton = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(!entry.isIntersecting) return

        mudarParticulas('default')
    })

}, { rootMargin: "0px 0px -70% 0px" ,threshold: 0 })





function atualizarSlider(){
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