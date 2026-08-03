import { idMax, idMin, search, show_pokemon, all, tipo_unico, dois_tipos, ambos } from "../elementos.js"
import { tipos, region } from "../constantes.js"
import { setNullUltimoObservado, unobserve, getUltimoObservado } from "../observer/observer.js"
import { setInicio, setPokemonsRenderizados, getPokemonsCarregados, pokedex, atualizarSlider, carregaMaisPokemon } from "../pokedex.js"

function gerarCombinacoes(tipos) {
    const combinacoes = []

    for (let i = 0; i < tipos.length; i++) {
        for (let j = i + 1; j < tipos.length; j++) {
            combinacoes.push([tipos[i], tipos[j]])
        }
    }

    return combinacoes
}

export function aplicarFiltros(){
    const texto = search.value.toLowerCase()
    const checados = tipos.filter(u => document.getElementById(u).checked)
    const checkRegion = region.filter(u => document.getElementById(u).checked)
    const idmax = Number(idMax.value)
    const idmin = Number(idMin.value)
    let ultimoObservado = getUltimoObservado()
    let pokemonsCarregados = getPokemonsCarregados()

    if(texto !== '' || checados.length > 0 || checkRegion.length > 0 || (idmin !== 1 || idmax !== 1025) || !all.checked){
        if(ultimoObservado){
            unobserve()
            setNullUltimoObservado()
        }
    }

    if (texto === '' && checados.length === 0 && checkRegion.length === 0 && (idmax === 1025 && idmin === 1) && all.checked){ 
        setInicio()
        setPokemonsRenderizados()
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

export function removerFiltros(){
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