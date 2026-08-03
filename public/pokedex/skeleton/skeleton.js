import { criarElemento } from "../helpers/helpers.js"
import { show_pokemon } from "../elementos.js"
import { observerSkeleton } from '../observer/observer.js'

export const skeleton = (quantidade = 18, limpar = true) => {
    if(limpar){
        show_pokemon.replaceChildren()
    }

    const fragment = document.createDocumentFragment()

    for (let i = 0; i < quantidade; i++) {
        const card = criarElemento('div', 'cards')
        card.classList.add('skeleton')

        card.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-types"></div>
            <div class="skeleton-text"></div>
        `
        observerSkeleton.observe(card)
        fragment.appendChild(card)
    }

    show_pokemon.appendChild(fragment)
}

export const removerSkeleton = () => {
    document.querySelectorAll('.skeleton').forEach(skeleton => skeleton.remove())
}