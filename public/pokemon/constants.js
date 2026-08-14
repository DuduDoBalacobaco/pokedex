import { formatarNome } from "../pokedex/helpers/helpers.js"

export const status = { hp: 255, atk: 190, def: 250, sp_atk: 194, sp_def: 250, spd: 200}

export const detalhes = ['held_item', 'item', 'known_move', 'known_move_type', 'location', 'min_affection', 'min_beauty', 'min_happiness', 'min_level', 'needs_overworld_rain', 'party_species', 'party_type', 'relative_physical_stats', 'time_of_day', 'trade_species', 'trigger', 'turn_upside_down']

export const textos = {
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

export const color_bar = ['#DC143C', '#DC143C', '#FF4500', '#FF4500', '#FFD700', '#FFD700', '#00FF00', '#00FF00', '#4169E1', '#4169E1']