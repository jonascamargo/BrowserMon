//////////////////// CONFIGURAÇÕES ////////////////////
const CONFIG = {
    CANVAS: {
        W: 800,
        H: 576,
        BG: '#161616',
    },
    TILE_SIZE: 32,
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