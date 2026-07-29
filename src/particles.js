import { imgs, imagens, escala, regioesEfeitos, fps, frameTime } from './constantes.js'
import { canvas } from './elementos.js'

const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

let efeitoAtual = "kanto"
let ultimoFrame = 0

let intensidadeAtual = 1
let intensidadeAnterior = 0

let particulas = []
let particulasAntigas = []

Object.keys(imgs).forEach(tipo => {

    imagens[tipo] = imgs[tipo].map(src => {
        const img = new Image()
        img.src = src
        return img
    })

})

canvas.width = innerWidth * escala
canvas.height = innerHeight * escala

canvas.style.width = innerWidth + "px"
canvas.style.height = innerHeight + "px"

ctx.scale(escala, escala)

window.addEventListener('resize', () => {
    canvas.width = innerWidth * escala
    canvas.height = innerHeight * escala

    canvas.style.width = innerWidth + "px"
    canvas.style.height = innerHeight + "px"

    ctx.scale(escala, escala)
})

class Particula{
    constructor(efeito){
        this.efeito = efeito
        this.opacidade = 1
        this.ultimoUpdate = 0

        this.reset()
    }

    reset(){
        const efeito = regioesEfeitos[this.efeito]
        const listaImagens = imagens[efeito.tipo]

        this.img = listaImagens[Math.floor(Math.random() * listaImagens.length)]

        if(this.efeito === "unova"){
            this.x = Math.random() * canvas.width
            this.y = canvas.height - Math.random() * 300
            this.speed = Math.random() * 0.08 + 0.03

            this.size = Math.random() * 120 + 350
        }
        else{
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
            this.speed = Math.random() * efeito.velocidade + 0.3
            this.size = Math.random() * (efeito.tamanho[1] - efeito.tamanho[0]) + efeito.tamanho[0]
        }

        this.wind = Math.random() * efeito.vento - efeito.vento/2
    }

    update(){
        if(this.efeito === "unova"){
            const agora = performance.now()
            if(agora - this.ultimoUpdate < 50) return
            
            this.ultimoUpdate = agora
        }
        
        const efeito = regioesEfeitos[this.efeito]

        if(efeito.tipo === "smoke"){
            this.y -= this.speed * 0.15

            this.x += this.wind

            if(this.y < -this.size * 0.3){
                this.x = Math.random() * canvas.width
                this.y = canvas.height + Math.random() * 200
            }
            return
        }
        else if(efeito.tipo === "neve"){
            this.y += this.speed
            this.x += this.wind

            if(this.y > canvas.height + 30){
                this.x = Math.random()*canvas.width
                this.y = -30
            }
        }
        else{
            this.y += this.speed
            this.sway ??= Math.random()*2-1
            this.sway += (Math.random()-0.5)*0.05
            this.x += this.sway + this.wind
        }

        if(this.y > canvas.height+30 || this.x > canvas.width+30 || this.x < -30){
            this.reset()
            this.y=-20
        }
    }

    draw(){
        if(this.opacidade <= 0) return

    if(this.x + this.size < 0 || this.x - this.size > canvas.width || this.y + this.size < 0 || this.y - this.size > canvas.height) return

    ctx.globalAlpha = this.opacidade

    if(this.efeito === "unova"){
        ctx.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 3, this.size, this.size * 0.6)
    }
    else{
        ctx.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    }

    ctx.globalAlpha = 1
    }
}

function criarParticulas(efeito){
    particulas = []

    const quantidade = regioesEfeitos[efeitoAtual].quantidade

    for(let i = 0; i < quantidade; i++){
        particulas.push(new Particula(efeito))
    }
}

export function mudarParticulas(regiao){
    if(!regioesEfeitos[regiao]) return

    if(regiao === efeitoAtual) return

    particulasAntigas = particulas

    efeitoAtual = regiao

    intensidadeAtual = 0
    intensidadeAnterior = 1

    criarParticulas(regiao)
}

criarParticulas('kanto')

function animate(tempo){
    if (!particulas.length && !particulasAntigas.length) {
        requestAnimationFrame(animate)
        return
    }

    if(tempo - ultimoFrame < frameTime){
        requestAnimationFrame(animate)
        return
    }

    ultimoFrame = tempo - ((tempo - ultimoFrame) % frameTime)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(intensidadeAtual < 1){
        intensidadeAtual += 0.01
        intensidadeAnterior -= 0.01
    }

    particulasAntigas.forEach(p => {
        p.opacidade = Math.max(intensidadeAnterior, 0)
        p.update()
        p.draw()
    })

    particulas.forEach(p => {
        p.opacidade = Math.min(intensidadeAtual, 1)
        p.update()
        p.draw()
    })

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)