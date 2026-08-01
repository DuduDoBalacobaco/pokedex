import { c, criarElemento } from "../js/helpers/helpers.js"

const imgs = document.querySelector('.imgs-pokemon')
const name = document.querySelector('.name-pokemon')
const abilties = document.querySelector('.abilities')
const types = document.querySelector('.types')
const maior = document.getElementById('maior')
const menor = document.getElementById('menor')
const weigth = document.querySelector('.weigth')
const heigth = document.querySelector('.heigth')
const pokemon_region = document.getElementById('pokemon_region')
const evo = document.querySelector('.evolution')


let cor = ''

const status = { hp: 255, atk: 190, def: 250, sp_atk: 194, sp_def: 250, spd: 200}
const detalhes = ['held_item', 'item', 'known_move', 'known_move_type', 'location', 'min_affection', 'min_beauty', 'min_happiness', 'min_level', 'needs_overworld_rain', 'party_species', 'party_type', 'relative_physical_stats', 'time_of_day', 'trade_species', 'trigger', 'turn_upside_down']

maior.style.display = 'none'

export async function mudarPagina(path){
    // const name = location.pathname.split("/").pop()
    
    const response = await fetch(path)
    const pokemon = await response.json()

    console.log(pokemon);
    
    document.title = `Pokémon - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`

    montarPagina(pokemon)
}

function montarPagina(pokemon){
    const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    imgs.style.backgroundImage = `url(${pokemon.habitat_img})`

    const text = criarNome(nome, pokemon.id)
    const img = personalizarImg(pokemon.artwork, 'img')
    const img_shiny = personalizarImg(pokemon.artwork_shiny, 'img_shiny')

    criarFuncaoTrocarImg(img, img_shiny, pokemon.id, nome, text)

    criarTypes(pokemon)
    criarAbility(pokemon)
    
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

function criarCardsEvolution(evolution){
    if(evolution.length === 1){
        document.querySelector('.title_evo').textContent = "Sem evoluções"
    }
    else{
        evolution.forEach(u => {
            if(evolution.length > 5){
                document.querySelector('.section_evolution').style.overflowX = 'scroll'
            }

            const card = criarElemento('div', 'card')

            const img = criarElemento('img', 'img_evo')
            img.src = `./pokemon-page/assets/artwork/front/${u.id}_front.webp`

            const nome_evo = criarElemento('div', 'nome_evo')
            nome_evo.textContent = u.name

            const text = criarElemento('div', 'motivos')

            u.details.forEach(a => {
                for(let i = 0; i < detalhes.length; i++){
                    const valor = a[detalhes[i]]

                    if(valor !== null && valor !== '' && valor !== false){
                        const evo = [detalhes[i], valor]

                        console.log(evo);
                        
                    }
                }
            })

            card.append(img, nome_evo)
            evo.append(card)
        })
    }
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
        

        all_abilities.append(ability, ability2)
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
        btn.style.display = 'flex'
    }, { once: true })
}

mudarPagina(`pokemon-page/json/eevee.json`)