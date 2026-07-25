const pokemon_name = document.querySelector('.pokemon_name')
const pokemon_img = document.querySelector('.pokemon_img')
const pokemon_id = document.querySelector('.pokemon_id')
const show_pokemon = document.getElementById('show_pokemon')
const search = document.getElementById('search')
const next = document.getElementById('next')
const previous = document.getElementById('previous')
const pageNow = document.getElementById('page')
const c = (id) => document.createElement(id)

let offset = 115
let limit = 36
let pokemonsCarregados = []

const habitats = {
    cave: 'assets/img/cave.png',
    sea: 'assets/img/sea.png',
    'rough-terrain': 'assets/img/rough-terrain.png',
    forest: 'assets/img/forest.png',
    grassland: 'assets/img/grassland.png',
    'waters-edge': 'assets/img/waters-edge.png',
    mountain: 'assets/img/mountain.png',
    urban: 'assets/img/urban.png',
    rare: 'assets/img/rare.png',
    default: 'assets/img/default.png'
}

const regioes = [
    { region: 'kanto', inicio: 1, fim: 151, img: 'assets/img/region-option-2/kanto.png'},
    { region: 'johto', inicio: 152, fim: 251, img: 'assets/img/region-option-2/johto.png' },
    { region: 'hoenn', inicio: 252, fim: 386, img: 'assets/img/region-option-2/hoenn.png' },
    { region: 'sinnoh', inicio: 387, fim: 493, img: 'assets/img/region-option-2/sinnoh.png' },
    { region: 'unova', inicio: 494, fim: 649, img: 'assets/img/region-option-2/unova.png' },
    { region: 'kalos', inicio: 650, fim: 721, img: 'assets/img/region-option-2/kalos.png' },
    { region: 'alola', inicio: 722, fim: 809, img: 'assets/img/region-option-2/alola.png' },
    { region: 'galar', inicio: 810, fim: 905, img: 'assets/img/region-option-2/galar.png' },
    { region: 'paldea', inicio: 906, fim: 1025, img: 'assets/img/region-option-2/paldea.png' }
]

const cache = {kanto: [], johto: [], hoenn: [], sinnoh: [], unova: [], kalos: [], alola: [], galar: [], paldea: []}

const marcador = 6
const fimregiao = regioes.map(reg => reg.fim)
const inicioregiao = regioes.map(reg => reg.inicio)

const tipos = ['normal', 'fire', 'water','electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
const region = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea']

const buscaImgRegiao = id => {
    const region = regioes.find(reg => (id >= reg.inicio && id <= reg.fim))

    return region.img
}
const buscaRegiao = id => {
    const region = regioes.find(reg => (id >= reg.inicio && id <= reg.fim))
       
    return region.region
}

const pokemonsInfo = async urls => {
    const pokemons = await Promise.all(
        urls.map(async (url) => {
            const responseids = await fetch(url)
            return responseids.json()
        })
    )
    return pokemons
}

const pokemonHabitats = async pokemons => {
    const habitats = await Promise.all(
        pokemons.map(async (pokemon) => {
            const responsehabitat = await fetch(pokemon.species.url)
            const { habitat } = await responsehabitat.json()
            return habitat?.name || 'default'
        })
    )
    return habitats
}

const carregaMaisPokemon = () => {
    offset += limit
    pokemonAPI(offset)
}

const urlPokemons = pokeAPiResults => pokeAPiResults.map(url => url.url)
const pokemonHabitat = habitat => habitats[habitat]




const pokemonAPI = async (offset, limit = 36, filtro = true, region) => {
    skeleton(30, false)

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)

    const {results: pokeAPiResults} = await response.json()
    const urls = await urlPokemons(pokeAPiResults)
    const pokemons = await pokemonsInfo(urls)
    
    const habitatsList = await pokemonHabitats(pokemons)

    const pokemon = pokemons.map((poke, index) => ({
        name: poke.name,
        id: poke.id,
        types: poke.types.map(type => type.type.name),
        sprite: poke.sprites.other['official-artwork'].front_default ,
        habitat: pokemonHabitat(habitatsList[index]),
        img_regiao: buscaImgRegiao(poke.id),
        region : buscaRegiao(poke.id)
    }))

    removerSkeleton()

    if(cache.kanto.length === 0){
        cache.kanto = pokemon
    }

    if(filtro){
        pokemonsCarregados.push(...pokemon)
    }
    else{
        cache[region] = pokemon
    }

    pokedex(pokemon, filtro)
}

// versions['generation-v']['black-white'].animated.front_default




const pokedex = (pokemons, filtro = true)=> {
    const fragment = document.createDocumentFragment()
    const marcadores = []

    pokemons.forEach((pokemon, i) => {
        const card = criarElemento('div', 'cards')
        card.dataset.regiao = pokemon.region

        const id = Number(pokemon.id)

        if(inicioregiao.includes(id) || fimregiao.includes(id)){
            marcadores.push(card)
        }

        const img = criarElemento('img', 'pokemon_img')
        img.src = pokemon.sprite

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

        const fundo = criarElemento('img', 'fundo')
        fundo.src = pokemon.habitat
        fundo.loading = 'lazy'

        const span_id = criarElemento('span', 'pokemon_id')
        span_id.textContent = `${id} - `

        const span_nome = criarElemento('span', 'pokemon_name')
        span_nome.textContent =  pokemon.name

        if(inicioregiao.includes(id) && filtro){
            const bandeira = criarElemento('div', 'bandeira')
            bandeira.classList.add(pokemon.region)
            bandeira.textContent = `Início da região de ${pokemon.region.charAt(0).toUpperCase() + pokemon.region.slice(1)}`
            fragment.appendChild(bandeira)
        }

        info.append(span_id, span_nome)
        card.append(img, fundo, types, info)
        fragment.appendChild(card)

        if(fimregiao.includes(id) && filtro){
            const bandeira = criarElemento('div', 'bandeira')
            bandeira.classList.add(pokemon.region)
            bandeira.textContent = `Fim da região de ${pokemon.region.charAt(0).toUpperCase() + pokemon.region.slice(1)}`
            fragment.appendChild(bandeira)
        }

    });

    show_pokemon.appendChild(fragment)

    marcadores.forEach(card => observerRegion.observe(card))

    if(filtro){
        observarUltimo()
    }
}




let ultimoObservado = null

const observer = new IntersectionObserver(entries => {     
    entries.forEach(entry => {
        if (!entry.isIntersecting) return

        if (entry.target === ultimoObservado) {
            carregaMaisPokemon()
        }
    })
}, { rootMargin: "0px 0px 100% 0px" ,threshold: 0 })

const observerRegion = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(!entry.isIntersecting) return

        document.body.style.backgroundImage = `url(assets/img/region-option-1/${entry.target.dataset.regiao}2.png)`

    })
}, { rootMargin: "0px 0px -78% 0px" ,threshold: 0 })

function observarUltimo(){
    if(ultimoObservado){
        observer.unobserve(ultimoObservado)
    }

    ultimoObservado = show_pokemon.lastElementChild
    observer.observe(ultimoObservado)
}




search.addEventListener('input', aplicarFiltros)

function aplicarFiltros(){

    const texto = search.value.toLowerCase()
    const checados = tipos.filter(u => document.getElementById(u).checked)
    const checkRegion = region.filter(u => document.getElementById(u).checked)

    if(texto !== '' || checados.length > 0 || checkRegion.length > 0){
        if(ultimoObservado){
            observer.unobserve(ultimoObservado)
            ultimoObservado = null
        }
    }

    // let resultado = pokemonsCarregados
    let resultado

    if(checkRegion.length > 0){
        resultado = []
        
        if(cache[checkRegion].length === 0){
            const pokemon = regioes.filter(u => checkRegion.some(a => u.region.includes(a)))
            const totalPokemon = pokemon[0].fim - pokemon[0].inicio + 1

            pokemonAPI(pokemon[0].inicio - 1, totalPokemon, false, checkRegion[0])
        }

        checkRegion.forEach(regiao => {
            resultado.push(...cache[regiao])
            resultado = resultado.filter(pokemon => checkRegion.some(u => pokemon.region.includes(u)))
        })
    }
    else{
        resultado = pokemonsCarregados
    }

    if(checados.length > 0){
        resultado = resultado.filter(pokemon => checados.some(u => pokemon.types.includes(u)))
    }

    if(texto !== ""){
        resultado = resultado.filter(pokemon =>
        pokemon.name.includes(texto) || pokemon.id.toString().includes(texto))
    }

    show_pokemon.replaceChildren()

    if (texto === '' && checados.length === 0 && checkRegion.length === 0){ 
        pokedex(pokemonsCarregados)
        return
    }
    
    pokedex(resultado, false)
}





const skeleton = (quantidade = 18, limpar = true) => {
    if(limpar){
        show_pokemon.replaceChildren();
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < quantidade; i++) {
        const card = criarElemento('div', 'cards');
        card.classList.add('skeleton')

        card.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-types"></div>
            <div class="skeleton-text"></div>
        `;

        fragment.appendChild(card);
    }

    show_pokemon.appendChild(fragment);
}

const removerSkeleton = () => {
    document.querySelectorAll('.skeleton')
    .forEach(skeleton => skeleton.remove());
}

const criarElemento = (elemento, classe) => {
    const criacao = c(elemento)
    criacao.classList.add(classe)
    return criacao
}

pokemonAPI(0, 151)