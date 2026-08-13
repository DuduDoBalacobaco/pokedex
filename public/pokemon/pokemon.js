import { c, criarElemento } from "../pokedex/helpers/helpers.js"

const imgs = document.querySelector('.imgs-pokemon')
const name = document.querySelector('.name-pokemon')
const abilties = document.querySelector('.abilities')
const types = document.querySelector('.types')
const maior = document.getElementById('maior')
const menor = document.getElementById('menor')
const weigth = document.querySelector('.weigth')
const heigth = document.querySelector('.heigth')
const extras = document.querySelector('.extras')
const pokemon_region = document.getElementById('pokemon_region')
const evo = document.querySelector('.evolution')

let cor = ''

const status = { hp: 255, atk: 190, def: 250, sp_atk: 194, sp_def: 250, spd: 200}
const detalhes = ['held_item', 'item', 'known_move', 'known_move_type', 'location', 'min_affection', 'min_beauty', 'min_happiness', 'min_level', 'needs_overworld_rain', 'party_species', 'party_type', 'relative_physical_stats', 'time_of_day', 'trade_species', 'trigger', 'turn_upside_down']

const textos = {
    trigger: {"level-up": "Level Up", "trade": "Trade", "use-item": "Use Item", "shed": "Shed (Special)"},

    min_level: valor => `Level ${valor}+`,
    held_item: valor => `Holding ${formatarNome(valor)}`,
    item: valor => `Use ${formatarNome(valor)}`,
    known_move: valor => `Knows ${formatarNome(valor)}`,
    known_move_type: valor => `Knows a ${formatarNome(valor)}-type move`,
    location: valor => `Location: ${formatarNome(valor)}`,
    time_of_day: valor => {
    if (valor === "day") return "During the day"
    if (valor === "night") return "At night"
    return `During ${formatarNome(valor)}`
    },
    min_happiness: valor => `Friendship ${valor}+`,
    min_beauty: valor => `Beauty ${valor}+`,
    min_affection: valor => `Affection ${valor}+`,
    party_type: valor => `${formatarNome(valor)}-type Pokémon in party`,
    party_species: valor => `${formatarNome(valor)} in party`,
    trade_species: valor => `Trade for ${formatarNome(valor)}`,

    relative_physical_stats: valor => {
        if (valor > 0) return "Attack > Defense"
        if (valor < 0) return "Attack < Defense"
        return "Attack = Defense"
    },

    needs_overworld_rain: () => "While raining",
    turn_upside_down: () => "Hold device upside down"
}

maior.style.display = 'none'

export async function mudarPagina(path){
    const name = location.pathname.split("/").pop()
    
    const response = await fetch(`./assets/json/${name}.json`)
    const pokemon = await response.json()

    console.log(pokemon);
    
    document.title = `Pokémon - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    montarPagina(pokemon)
}

function montarPagina(pokemon){
    const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    imgs.style.backgroundImage = `url(/assets/habitats/webp/${pokemon.habitat_name}.webp)`
    document.body.style.backgroundImage = `url(/assets/region-option-1/webp/${pokemon.region_name}2.webp)`

    const text = criarNome(nome, pokemon.id)
    const img = personalizarImg(pokemon.artwork, 'img')
    const img_shiny = personalizarImg(pokemon.artwork_shiny, 'img_shiny')

    criarFuncaoTrocarImg(img, img_shiny, pokemon.id, nome, text)

    criarTypes(pokemon)
    criarAbility(pokemon)
    
    criarExtras(pokemon.is_baby, pokemon.is_legendary, pokemon.is_mythical)
    criarPeso(pokemon.weight)
    criarAltura(pokemon.height)

    criarStats(pokemon.stats[0].value, '.hp', status.hp)
    criarStats(pokemon.stats[1].value, '.atk', status.atk)
    criarStats(pokemon.stats[2].value, '.def', status.def)
    criarStats(pokemon.stats[3].value, '.sp_atk', status.sp_atk)
    criarStats(pokemon.stats[4].value, '.sp_def', status.sp_def)
    criarStats(pokemon.stats[5].value, '.spd', status.spd)

    criarRegion(pokemon.region_name)

    criarCardsEvolution(pokemon.evolution)
}

function criarCardPokemon(pokemon){
    const card = criarElemento('div', 'card')

    card.addEventListener('click', () => {
        window.location.href = `/pokemon/${pokemon.name}`
    })

    const img = criarElemento('img', 'img_evo')
    img.src = `./assets/artwork/front/${pokemon.id}_front.webp`

    const nome = criarElemento('div', 'nome_evo')
    nome.textContent = pokemon.name

    card.append(img, nome)

    return card
}

function cardSemEvolucao(evolution){
    const pokemon = evolution[0]

    const card_evo = criarElemento('div', 'card_evo')
    const info = criarElemento('div', 'info_sem_evo')

    const card = criarCardPokemon(pokemon)

    const base = criarElemento('p', 'pokemon_base')
    base.textContent = 'Base Pokémon'

    const texto = criarElemento('p', 'sem_evolucao')
    texto.textContent = 'Sem evoluções'

    info.append(base, texto)
    card_evo.append(card, info)
    evo.append(card_evo)
}

function removerDuplicados(details) {
    return details.filter((detail, index) => {
        return index === details.findIndex(
            d => JSON.stringify(d) === JSON.stringify(detail)
        )
    })
}

function criarMetodoEvolucao(u){
    const text = criarElemento('div', 'motivos_texts')
    const grupo = criarElemento('div', 'grupo_trigger')
    const cabecalho = criarElemento('div', 'cabecalho_trigger')
    const titulo = criarElemento('span', 'trigger')

    const voltar = criarElemento('button', 'btn_trigger')
    voltar.innerHTML = '&#9664;'

    const avancar = criarElemento('button', 'btn_trigger')
    avancar.innerHTML = '&#9654;'

    const detalhes = removerDuplicados(u.details)

    detalhes.length > 1 ? cabecalho.append(voltar, titulo, avancar) : cabecalho.append(titulo)

    const lista = criarElemento('ul', 'lista_motivos')

    grupo.append(cabecalho, lista)
    text.append(grupo)

    let indice = 0

    renderizarMetodo(detalhes[indice], titulo, lista)

    function trocarMetodo(direcao) {
        indice += direcao

        if (indice < 0) indice = detalhes.length - 1
        if (indice >= detalhes.length) indice = 0

        renderizarMetodo(detalhes[indice], titulo, lista)
    }

    voltar.addEventListener('click', () => trocarMetodo(-1))
    avancar.addEventListener('click', () => trocarMetodo(1))

    return text
}

function renderizarMetodo(metodo, titulo, lista) {
    lista.innerHTML = ''

    const { trigger, ...resto} = metodo

    titulo.textContent = textos.trigger[trigger]

    Object.entries(resto).forEach(([chave, valor]) => {
        if (valor === null || valor === '' || valor === false) return

        const li = criarElemento('li', 'motivo')
        const texto = textos[chave]

        li.textContent = typeof texto === 'function' ? texto(valor) : `${chave}: ${valor}`

        lista.append(li)
    })
}

function criarCardsEvolution(evolution) {
    if (evolution.length === 1) {
        cardSemEvolucao(evolution)

        return
    }

    if (evolution.length > 5) {
        document.querySelector('.section_evolution').style.overflowX = 'scroll'
    }
    
    evolution.forEach(u => {
        const card_evo = criarElemento('div', 'card_evo')
        const card = criarCardPokemon(u)

        if (!u.details.length) {
            const semMetodo = criarElemento('p', 'sem_metodo')
            semMetodo.textContent = 'Base Pokémon'

            card_evo.append(card, semMetodo)
            evo.append(card_evo)
            return
        }
        
        const text = criarMetodoEvolucao(u)

        card_evo.append(card, text)
        evo.append(card_evo)
    })
}

function criarNome(nome, id){
    const text = criarElemento('p', 'nome')
    text.textContent = `${id} - ${nome}`
    name.append(text)

    return text
}

function criarRegion(region){
    const reg = criarElemento('div', region)
    reg.textContent = region

    pokemon_region.append(reg)
}

function criarStats(stats, name_stats, max_stats){
    const bar = document.querySelector(name_stats)
    let calc = Math.round((stats * 100 / max_stats) / 10)
    
    for(let i = 1; i <= 10; i++){
        const barra = criarElemento('div', 'desativa')

        if(i <= calc){
            barra.classList.add('ativa')
        }
        if(i === 10){
            const num = criarElemento('div', 'num_stats')
            num.textContent = stats
            num.style.color = cor

            bar.append(barra, num)
        }
        else{
           bar.append(barra) 
        }
    }
}

function criarExtras(baby, legendary, mythical){
    const extra = c('div')

    extra.textContent = baby ? "Baby pokemon" : legendary ? "Legendary pokemon" : mythical ? "Mythical pokemon" : ''

    if(extra.textContent !== ""){
        extras.append(extra)    
    }
    else{
        extras.style.display = 'none'
    }
}

function verificarVazio(extra){
    if(extra === "") return true

    return false
}

function criarAltura(alto){
    const altura = criarElemento('span', 'altura')
    const metros = Number(alto.replace(' m', ''))

    const totalPolegadas = metros * 39.3701
    const pes = Math.floor(totalPolegadas / 12)
    const polegadas = Math.round(totalPolegadas % 12)

    const alturaImperial = `${pes}'${polegadas}"`
    
    altura.textContent = `${alto} / ${alturaImperial} `

    heigth.append(altura)
}

function criarPeso(pesado){
    const peso = criarElemento('span', 'peso')
    const libras = (Number(pesado.replace(' kg', '')) * 2.204623).toFixed(1)
    
    peso.textContent = `${pesado} / ${libras} lbs.`

    weigth.append(peso)
}

function criarFuncaoTrocarImg(img, img_shiny, id, nome, text){
    menor.addEventListener('click', () => {
        mudarImg('-100%', img, img_shiny, maior, menor)
        text.textContent = `${id} - Shiny ${nome}`
    })

    maior.addEventListener('click', () => {
        mudarImg('0%', img, img_shiny, menor, maior)
        text.textContent = `${id} - ${nome}`
    })
}

function criarAbility(poke){
    const all_abilities = criarElemento('div', 'all_abilities')
    const ability = criarElemento('div', 'ability')
    cor = poke.color

    const nome = personalizarNomeAbility(poke.abilities[0].name)
    const box = personalizarTextAbility(poke.abilities[0].entries)

    if(poke.abilities[0].hidden){
        const hidden = personalizarHiddenAbility(poke.abilities[0].hidden)

        box.append(hidden)
    }
    ability.append(nome, box)

    if(poke.abilities[1]){
        const ability2 = criarElemento('div', 'ability')

        const nome2 = personalizarNomeAbility(poke.abilities[1].name)
        const box2 = personalizarTextAbility(poke.abilities[1].entries)

        if(poke.abilities[1].hidden){
            const hidden2 = personalizarHiddenAbility(poke.abilities[1].hidden)

            box2.append(hidden2)
        }
        ability2.append(nome2, box2)
        

        if(poke.abilities[2]){
            const ability3 = criarElemento('div', 'ability')

            const nome3 = personalizarNomeAbility(poke.abilities[2].name)
            const box3 = personalizarTextAbility(poke.abilities[2].entries)

            if(poke.abilities[2].hidden){
                const hidden3 = personalizarHiddenAbility(poke.abilities[2].hidden)

                box3.append(hidden3)
            }
            ability3.append(nome3, box3)

            all_abilities.append(ability, ability2, ability3)
        }
    
        if(!poke.abilities[2]){
            all_abilities.append(ability, ability2)
        }
    }
    else{
       all_abilities.append(ability) 
    }

    abilties.append(all_abilities)
}

function personalizarNomeAbility(name){
    const nome = criarElemento('p', 'name_abilities');
    nome.textContent = name
    nome.style.color = cor

    return nome
}

function personalizarTextAbility(entries){
    const box = criarElemento('div', 'tooltip')
    box.textContent = entries

    return box
}

function personalizarHiddenAbility(escondida){
    const hidden = criarElemento('div', 'hidden')
    hidden.textContent = 'hidden ability'

    return hidden
}

function personalizarImg(src, img){
    const imagem = criarElemento('img', img)
    imagem.src = `./${src}`

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
        btn.style.display = 'flex'
    }, { once: true })
}

function formatarNome(texto) {
    return texto.replaceAll('-', ' ').replace(/\b\w/g, letra => letra.toUpperCase())
}

mudarPagina()