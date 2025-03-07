////////// INPUT
class InputManager {
    constructor() {
        this.states = {}
        this.commands = {}
        this.currentState = 'GAME'
        this.activeKeys = new Set()

        // bind (troca) estre o estato da tecla (precissonada / solta)
        this.handleKeyDown = this.handleKeyDown.bind( this )
        this.handleKeyUp   = this.handleKeyUp.bind( this )
    }

    log() {
        console.log([ this.states, this.commands, this.currentState ])
    }

    init() {
        window.addEventListener( 'keydown', this.handleKeyDown )
        window.addEventListener( 'keyup', this.handleKeyUp )
    }

    handleKeyDown ( e ) {
        this.activeKeys.add( e.key )
        // console.log( e.code )
        // console.log( 'key down: ['+ e.code +']['+ e.keyCode +']' )
    }

    handleKeyUp ( e ) {
        this.activeKeys.delete( e.key )
    }

    // altera o estado da tecla - para mudar a ação da mesma tecla
    setState( newState ) {
        if( this.states[newState] ){
            this.currentState = newState
        }
    }

    // verifica o estado ativo
    // passa por todas as teclas mapeadas e verifica se a tecla está ativa
    // se estiver, executa a ação - chama o método
    // o update é chamado no game loop
    update() {
        const currentMapping = this.states[ this.currentState ]

        this.activeKeys.forEach( key => {
            const commandName = currentMapping[key]

            if( commandName && this.commands[ commandName ] ){
                this.commands[ commandName ]()
            }
        } )
    }

    // cadastra uma ação - com seu nome e o método que será executado
    addCommand( name, callBack ) {
        this.commands[ name ] = callBack
    }

    // cadastr novos states
    addState( stateName, mappings ) {
        this.states[ stateName ] = mappings
    }

    destroy() {
        window.removeEventListener( 'keydown', this.handleKeyDown )
        window.removeEventListener( 'keyup', this.handleKeyUp )
    }
}


////////// ELEMENTOS GRAFICOS
class Pawn {
    constructor( config ){
        // atributos base
        this.color  = config.color || 'purple'
        this.width  = config.width || TILE_SIZE
        this.height = config.height || TILE_SIZE
        this.x = config.x || 0
        this.y = config.y || 0

        // atributos de status
        this.speed = this.speed || 5
    }
    
    log(){
        console.log( this )
    }

    Moving( dx, dy ){
        const newX = this.x + dx * this.speed * this.speed
        const newY = this.y + dy * this.speed * this.speed

        this.x = Math.max( 0, Math.min( BASE_WIDTH - this.width, newX )  )
        this.y = Math.max( 0, Math.min( BASE_HEIGHT - this.height, newY ) )
    }

    Render( ctx ){
        ctx.fillStyle = this.color
        ctx.fillRect( this.x, this.y, this.width, this.height )
    }
}