export const c = (id) => document.createElement(id)

export const criarElemento = (elemento, classe) => {
    const criacao = c(elemento)
    criacao.classList.add(classe)
    return criacao
}

export function formatarNome(texto) {
    return texto.replaceAll('-', ' ').replace(/\b\w/g, letra => letra.toUpperCase())
}