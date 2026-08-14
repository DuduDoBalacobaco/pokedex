import { c, criarElemento } from "../pokedex/helpers/helpers.js"
import { status, detalhes, textos, color_bar } from "./constants.js"
import { imgs, name, abilities, types, maior, menor, weigth, heigth, extras, pokemon_region, evo } from "./elementos.js"

maior.style.display = 'none'

export async function mudarPagina(){
    const pokemonName = location.pathname.split("/").pop()
    
    const response = await fetch(`./assets/json/${pokemonName}.json`)
    const pokemon = await response.json()

    console.log(pokemon)
    
    document.title = `Pokémon - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    montarPagina(pokemon)
}

function montarPagina(pokemon){
    const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    imgs.style.backgroundImage = `url(/assets/habitats/webp/${pokemon.habitat_name}.webp)`
    document.body.style.backgroundImage = `url(/assets/region-option-1/webp/${pokemon.region_name}2.webp)`

    const text = criar('nome', 'p', `${pokemon.id} - ${nome}`)
    name.append(text)

    const img = personalizarImg(pokemon.artwork, 'img')
    const img_shiny = personalizarImg(pokemon.artwork_shiny, 'img_shiny')

    criarFuncaoTrocarImg(img, img_shiny, pokemon.id, nome, text)

    criarTypes(pokemon)
    criarAbility(pokemon)
    
    criarExtras(pokemon.is_baby, pokemon.is_legendary, pokemon.is_mythical)
    criarPeso(pokemon.weight)
    criarAltura(pokemon.height)

    criarStats(pokemon.stats[0].value, '.hp', status.hp, pokemon.color)
    criarStats(pokemon.stats[1].value, '.atk', status.atk, pokemon.color)
    criarStats(pokemon.stats[2].value, '.def', status.def, pokemon.color)
    criarStats(pokemon.stats[3].value, '.sp_atk', status.sp_atk, pokemon.color)
    criarStats(pokemon.stats[4].value, '.sp_def', status.sp_def, pokemon.color)
    criarStats(pokemon.stats[5].value, '.spd', status.spd, pokemon.color)

    const region = criar(pokemon.region_name, 'div')
    pokemon_region.append(region)

    criarCardsEvolution(pokemon.evolution)
}

function criar(classe, element, texto){
    const criar = criarElemento(element, classe)
    criar.textContent = texto || classe

    return criar
}

function criarCardPokemon(pokemon){
    const card = criarElemento('div', 'card')

    card.addEventListener('click', () => window.location.href = `/pokemon/${pokemon.name}`)

    const img = criarElemento('img', 'img_evo')
    img.src = `./assets/artwork/front/${pokemon.id}_front.webp`

    const nome = criar('nome_evo', 'div', pokemon.name)

    card.append(img, nome)

    return card
}

function cardSemEvolucao(evolution){
    const pokemon = evolution[0]

    const card_evo = criarElemento('div', 'card_evo')
    const info = criarElemento('div', 'info_sem_evo')

    const card = criarCardPokemon(pokemon)

    const base = criar('pokemon_base', 'p', 'Base Pokémon') 
    const texto = criar('sem_evolucao', 'p', 'Sem evoluções')

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

    const {trigger, ...resto} = metodo

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

    if (evolution.length > 5) document.querySelector('.section_evolution').style.overflowX = 'scroll'
    
    evolution.forEach(u => {
        const card_evo = criarElemento('div', 'card_evo')
        const card = criarCardPokemon(u)

        if (!u.details.length) {
            const semMetodo = criar('sem_metodo', 'p', 'Base Pokémon')

            card_evo.append(card, semMetodo)
            evo.append(card_evo)
            return
        }
        
        const text = criarMetodoEvolucao(u)

        card_evo.append(card, text)
        evo.append(card_evo)
    })
}

function criarStats(stats, name_stats, max_stats, color){
    const bar = document.querySelector(name_stats)
    const calc = Math.round((stats / max_stats) * 10)
    
    for(let i = 1; i <= 10; i++){
        const barra = criarElemento('div', 'desativa')

        if(i <= calc){
            barra.classList.add('ativa')
            barra.style.background = color_bar[i - 1]
        }
        if(i === 10){
            const num = criar('num_stats', 'div', stats)
            num.style.color = color

            bar.append(barra, num)
        }
        else bar.append(barra) 
    }
}

function criarExtras(baby, legendary, mythical){
    const extra = criar("special", 'div', (baby ? "Baby " : legendary ? "Legendary " : mythical ? "Mythical " : 'Standard ') + "pokemon") 

    extras.append(extra)   
}

function criarAltura(alto){
    const metros = Number(alto.replace(' m', ''))

    const totalPolegadas = metros * 39.3701
    const alturaImperial = `${Math.floor(totalPolegadas / 12)}'${Math.round(totalPolegadas % 12)}"`
    
    const altura = criar('altura', 'span', `${alto} / ${alturaImperial} `)

    heigth.append(altura)
}

function criarPeso(pesado){
    const libras = (Number(pesado.replace(' kg', '')) * 2.204623).toFixed(1)
    const peso = criar('peso', 'span', `${pesado} / ${libras} lbs.`)

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

    poke.abilities.forEach(u => {
        const ability = criarElemento('div', 'ability')
        const box = criar('tooltip', 'div', u.entries)
        const nome = criar('name_abilities', 'p', u.name)
        nome.style.color = poke.color

        if(u.hidden){
            const hidden = criar('hidden', 'div', 'hidden ability')

            box.append(hidden)
        }
        ability.append(nome, box)

        all_abilities.append(ability)
    })

    abilities.append(all_abilities)
}

function personalizarImg(src, img){
    const imagem = criarElemento('img', img)
    imagem.src = `./${src}`

    imgs.append(imagem)

    return imagem
}

function criarTypes(pokemon){
    pokemon.type.forEach(u => {
        const type = criar('pokemon_type', 'p', u)
        type.classList.add(u)
        types.append(type)
    })
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

mudarPagina()