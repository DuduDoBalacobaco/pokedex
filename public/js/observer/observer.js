import { mudarParticulas } from '../particles/particles.js'
import { show_pokemon } from '../elementos.js'
import { carregaMaisPokemon } from '../main.js'

let ultimoObservado = null

const observer = new IntersectionObserver(entries => {     
    entries.forEach(entry => {
        if (!entry.isIntersecting) return

        if (entry.target === ultimoObservado) {
            carregaMaisPokemon()
        }
    })
}, { rootMargin: "0px 0px 100% 0px" ,threshold: 0 })

export function observarUltimo(){
    if(ultimoObservado){
        observer.unobserve(ultimoObservado)
    }

    ultimoObservado = show_pokemon.lastElementChild

    if(ultimoObservado){
        observer.observe(ultimoObservado)
    }
}

export function unobserve(){
    if(ultimoObservado){
        observer.unobserve(ultimoObservado)
    }
}

export function setNullUltimoObservado(){
    ultimoObservado = null
}

export function getUltimoObservado(){
    return ultimoObservado
}

const observerRegion = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(!entry.isIntersecting) return

        const regiao = entry.target.dataset.regiao

        document.body.style.backgroundImage = `url(assets/img/region-option-1/webp/${regiao}2.webp)`

        mudarParticulas(regiao)
    })
}, { rootMargin: "0px 0px -70% 0px" ,threshold: 0 })

export function observarRegion(marcadores){
    marcadores.forEach(card => observerRegion.observe(card))
}

export function observerBandeira(bandeira){
    observerRegion.observe(bandeira)
}

export const observerSkeleton = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if(!entry.isIntersecting) return

        mudarParticulas('default')
    })

}, { rootMargin: "0px 0px -70% 0px" ,threshold: 0 })