// variaveis
// const BASE_WIDTH  = CONFIG.CANVAS.W
const BASE_WIDTH   = Math.round( CONFIG.TILE_SIZE * 30 )
// const BASE_HEIGHT = CONFIG.CANVAS.H
const BASE_HEIGHT  = Math.round( CONFIG.TILE_SIZE * 17 )
const BASE_BG      = CONFIG.CANVAS.BG
const TILE_SIZE    = CONFIG.TILE_SIZE
const GRID_COLOR   = 'purple' 
const WORLD_WIDTH  = CONFIG.WORLD.WIDTH
const WORLD_HEIGHT = CONFIG.WORLD.HEIGHT

// configuração inicial do canvas
const canvas = document.getElementById( 'gameStage' )
const ctx = canvas.getContext( '2d' )
canvas.width  = BASE_WIDTH
canvas.height = BASE_HEIGHT

////////////////////////////////////////

// buffer virtual - canvas dinamico
const virtualCanvas = document.createElement( 'canvas' )
const virtualCtx    = virtualCanvas.getContext( '2d' )
virtualCanvas.width  = BASE_WIDTH
virtualCanvas.height = BASE_HEIGHT


const LAYER = {
    GRID2: ( ctx ) => {
        ctx.strokeStyle = GRID_COLOR

        for( let x = 0; x < BASE_WIDTH + TILE_SIZE; x += TILE_SIZE ){
            for( let y = 0; y < BASE_HEIGHT + TILE_SIZE; y += TILE_SIZE ){
                ctx.strokeRect( x, y, TILE_SIZE, TILE_SIZE )
            }
        }
    },
    
    GRID: ( ctx ) => {
        ctx.strokeStyle = GRID_COLOR;
        
        for( let x = 0; x < WORLD_WIDTH + TILE_SIZE; x += TILE_SIZE ) {
            for( let y = 0; y < WORLD_HEIGHT + TILE_SIZE; y += TILE_SIZE ) {
                // Linha vertical (direita)
                ctx.beginPath()
                ctx.moveTo( x + TILE_SIZE, y )
                ctx.lineTo( x + TILE_SIZE, y + TILE_SIZE )
                ctx.stroke()
                
                // Linha horizontal (base)
                ctx.beginPath()
                ctx.moveTo( x, y + TILE_SIZE )
                ctx.lineTo( x + TILE_SIZE, y + TILE_SIZE )
                ctx.stroke()
            }
        }
    }
}



////////// criação da camera principal do jogo
const gameCamera = new Camera()

////////// INPUT

const gameInputs = new InputManager()
gameInputs.init()

///// cadastro da ação [NOME, FUNÇÃO]
gameInputs.addCommand( 'teste', () => console.log('attack') )

///// cadastro dos estados
// gameInputs.setState( 'MENU' )

///// cadastro do estado [NOME, { 'KEY': 'ACTION' }]
// gameInputs.addState( 'GAME', { 'u': 'teste' } )
gameInputs.addState( 'GAME', { ' ': 'teste' } )



////////// CHAR
const player = new Player({ color: 'green', x:0, y:0, speed: 5 })

let currentTarget = player;

gameInputs.addCommand( 'moveUp',    () => currentTarget.Moving(0, -1) )
gameInputs.addCommand( 'moveDown',  () => currentTarget.Moving(0,  1) )
gameInputs.addCommand( 'moveLeft',  () => currentTarget.Moving(-1, 0) )
gameInputs.addCommand( 'moveRight', () => currentTarget.Moving(1,  0) )



const player2 = new Player({ color: 'gold', x:700, y:700, speed: 10 })
gameInputs.addCommand( 'focus', () => {
    currentTarget = currentTarget === player ? player2 : player;
} )


gameInputs.addState('GAME', {
    'ArrowUp': 'moveUp',
    'ArrowDown': 'moveDown',
    'ArrowLeft': 'moveLeft',
    'ArrowRight': 'moveRight',
    'w': 'moveUp',
    's': 'moveDown',
    'a': 'moveLeft',
    'd': 'moveRight',

    'm': 'focus'
})



////////////////////////////////////////

function Render(){
    // layer 1 -  limpando o canvas virtual
    virtualCtx.fillStyle = BASE_BG
    virtualCtx.fillRect( 0, 0, BASE_WIDTH, BASE_HEIGHT )

    gameCamera.follow( currentTarget, virtualCtx )
    
    ////////////////////////////////////////
    // layer 2
    LAYER.GRID( virtualCtx )

    // layer 3
    player.Render( virtualCtx )
    player2.Render( virtualCtx )
    ////////////////////////////////////////

    // limpando o canvas real
    // ctx.fillStyle = BASE_BG
    // ctx.fillRect( 0, 0, BASE_WIDTH, BASE_HEIGHT )
    virtualCtx.restore()

    // desenhando o canvas virtual no canvas real
    ctx.drawImage(
        virtualCanvas,
        0, 0,
        BASE_WIDTH, BASE_HEIGHT,
    )
}

function LoopGame(){
    gameInputs.update()
    Render()
    requestAnimationFrame( LoopGame )
}