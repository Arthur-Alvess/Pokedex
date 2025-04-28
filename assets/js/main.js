const pokemonList = document.getElementById('pokemonList');
const loadMore = document.getElementById('loadMore');
const limit = 20;
let offset = 0;

let todosOsPokemons = []; 

function convertPokemonToLI(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.pokemonNumber}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    </li>
    `;
}

function loadPokemonItens(offset, limit) { 
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        todosOsPokemons = [...todosOsPokemons, ...pokemons];
        pokemonList.innerHTML += pokemons.map(convertPokemonToLI).join('');
    }).catch(error => {
        console.error('Erro ao carregar pokémons:', error);
    });   
}

loadPokemonItens(offset, limit);

loadMore.addEventListener('click', () => {
    offset += limit;
    loadPokemonItens(offset, limit);
});

function configurarBusca() {
    const campoPesquisa = document.getElementById('searchInput');

    campoPesquisa.addEventListener('input', () => {
        const termo = campoPesquisa.value.trim().toLowerCase();

        if (termo === "") {
            pokemonList.innerHTML = todosOsPokemons.map(convertPokemonToLI).join('');
            loadMore.style.display = 'block'; 
        } else {
            loadMore.style.display = 'none';

            const itensFiltrados = todosOsPokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(termo)
            );

            if (itensFiltrados.length > 0) {
                pokemonList.innerHTML = itensFiltrados.map(convertPokemonToLI).join('');
            } else {
                pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${termo}` })
                    .then(pokemon => {
                        if (pokemon && pokemon.name) {
                            todosOsPokemons.push(pokemon);
                            pokemonList.innerHTML = todosOsPokemons.map(convertPokemonToLI).join('');
                        } else {
                            pokemonList.innerHTML = '<li class="pokemon error">Pokémon não encontrado!</li>';
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar Pokémon na API:', error);
                        pokemonList.innerHTML = '<li class="pokemon error">Pokémon não encontrado!</li>';
                    });
            }
        }
    });
}

// Configurar a busca
configurarBusca();
