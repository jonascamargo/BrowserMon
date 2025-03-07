//////////////////// CONFIGURAÇÕES ////////////////////
const CONFIG = {
    CANVAS: {
        W: 800,
        H: 450,
        BG: '#161616',
    },

    WORLD: {
        WIDTH: 2000,
        HEIGHT: 1500
    },

    TILE_SIZE: 32,

    INPUTS: {
        NAV: {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
        },
        ACTION: {
            attack: 'j',
            special: 'k',
        },
        UI: {
            pause: 'p',
            play: 'space',
        }
    },
}

////////////////////      LOAD      ///////////////////
function carregarScript( caminho ){
    return new Promise(( resolve, reject ) => {
        const script = document.createElement( 'script' );

        script.src = caminho;
        script.onload = () => resolve();
        script.onerror = () => reject();

        document.head.appendChild( script );
    });
}

// Carregando os arquivos e usando as classes
async function startGame() {
    try {
        await carregarScript( './src/scripts/class.js' );
        await carregarScript( './src/scripts/core.js' );
        
        LoopGame();
    }
    catch( error ) {
        console.error( 'Erro ao carregar scripts: ', error );
    }
}

// Iniciar o carregamento
startGame();