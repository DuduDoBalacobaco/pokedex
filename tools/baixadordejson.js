Object.entries(cache).forEach(([regiao, pokemons]) => {

    const json = JSON.stringify(pokemons, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${regiao}.json`;

    link.click();

    URL.revokeObjectURL(url);

});