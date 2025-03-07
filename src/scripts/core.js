// variaveis
// const BASE_WIDTH  = CONFIG.CANVAS.W
const BASE_WIDTH  = Math.round( CONFIG.TILE_SIZE * 30 )
// const BASE_HEIGHT = CONFIG.CANVAS.H
const BASE_HEIGHT = Math.round( CONFIG.TILE_SIZE * 17 )
const BASE_BG     = CONFIG.CANVAS.BG
const TILE_SIZE   = CONFIG.TILE_SIZE
const GRID_COLOR  = 'purple' 

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
        
        for( let x = 0; x < BASE_WIDTH + TILE_SIZE; x += TILE_SIZE ) {
            for( let y = 0; y < BASE_HEIGHT + TILE_SIZE; y += TILE_SIZE ) {
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

////////////////////////////////////////

function Render(){
    // layer 1 -  limpando o canvas virtual
    virtualCtx.fillStyle = BASE_BG
    virtualCtx.fillRect( 0, 0, BASE_WIDTH, BASE_HEIGHT )


    ////////////////////
    LAYER.GRID( virtualCtx )

    virtualCtx.fillStyle = 'red'
    virtualCtx.fillRect( 0, 0, 50, 50 )
    ////////////////////


    // limpando o canvas real
    ctx.fillStyle = BASE_BG
    ctx.fillRect( 0, 0, BASE_WIDTH, BASE_HEIGHT )

    // desenhando o canvas virtual no canvas real
    ctx.drawImage(
        virtualCanvas,
        0, 0,
        BASE_WIDTH, BASE_HEIGHT,
    )
}

function LoopGame(){
    Render()
    requestAnimationFrame( LoopGame )
}