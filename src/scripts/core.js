// console.log( CONFIG.CANVAS.W )
// const myPlayer = new Player()

function Render(){
    // console.log( 'função Render()' )
}


function LoopGame(){
    // console.log( 'função LoopGame()' )

    Render();
    requestAnimationFrame(LoopGame);
}