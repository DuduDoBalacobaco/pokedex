export const c = (id) => document.createElement(id)

export const criarElemento = (elemento, classe) => {
    const criacao = c(elemento)
    criacao.classList.add(classe)
    return criacao
}