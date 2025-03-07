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

        // Adiciona suporte a touch
        this.touchStartX = 0
        this.touchStartY = 0
        this.touchThreshold = 30 // Sensibilidade do touch

        // Bind dos eventos de touch
        this.handleTouchStart = this.handleTouchStart.bind( this )
        this.handleTouchMove  = this.handleTouchMove.bind( this )
        this.handleTouchEnd   = this.handleTouchEnd.bind( this )
    }

    log() {
        return [this.states, this.commands, this.currentState]
    }

    init() {
        window.addEventListener( 'keydown', this.handleKeyDown )
        window.addEventListener( 'keyup', this.handleKeyUp )

        // eventos de touch
        canvas.addEventListener( 'touchstart', this.handleTouchStart )
        canvas.addEventListener( 'touchmove', this.handleTouchMove )
        canvas.addEventListener( 'touchend', this.handleTouchEnd )
    }

    handleKeyDown ( e ) {
        this.activeKeys.add( e.key )
        // console.log( e.code )
        // console.log( 'key down: ['+ e.code +']['+ e.keyCode +']' )
    }
    handleKeyUp ( e ) {
        this.activeKeys.delete( e.key )
    }

    handleTouchStart( e ) {
        e.preventDefault()

        const touch = e.touches[ 0 ]

        this.touchStartX = touch.clientX
        this.touchStartY = touch.clientY
    }
    handleTouchMove( e ) {
        e.preventDefault()

        const touch = e.touches[ 0 ]
        const deltaX = touch.clientX - this.touchStartX
        const deltaY = touch.clientY - this.touchStartY

        // Simula teclas baseado na direção do touch
        this.activeKeys.clear()
        
        if ( Math.abs( deltaX ) > this.touchThreshold || Math.abs( deltaY ) > this.touchThreshold ) {
            if ( Math.abs( deltaX ) > Math.abs( deltaY ) ) {
                // Movimento horizontal
                this.activeKeys.add( deltaX > 0 ? 'd' : 'a')
            }
            else {
                // Movimento vertical
                this.activeKeys.add(deltaY > 0 ? 's' : 'w')
            }
        }
    }
    handleTouchEnd( e ) {
        e.preventDefault()
        this.activeKeys.clear()
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

        // eventos de touch
        canvas.removeEventListener( 'touchstart', this.handleTouchStart )
        canvas.removeEventListener( 'touchmove', this.handleTouchMove )
        canvas.removeEventListener( 'touchend', this.handleTouchEnd )
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
    }
    
    log(){
        return this;
    }

    Moving( dx, dy ){
        const newX = this.x + dx * this.speed
        const newY = this.y + dy * this.speed
        
        this.x = Math.max( 0, Math.min( WORLD_WIDTH - this.width, newX )  )
        this.y = Math.max( 0, Math.min( WORLD_HEIGHT - this.height, newY ) )

        /*
        // movimentação um tile por vez
        const newX = this.x + (dx * TILE_SIZE)
        const newY = this.y + (dy * TILE_SIZE)
        
        this.x = Math.max(0, Math.min(BASE_WIDTH - this.width, newX))
        this.y = Math.max(0, Math.min(BASE_HEIGHT - this.height, newY))*/
    }

    Render( ctx ){
        ctx.fillStyle = this.color
        ctx.fillRect( this.x, this.y, this.width, this.height )
    }
}


///// CHARACTER
class Player extends Pawn {
    constructor( config = {} ) {
        super( config )
        // atributos de status
        this.speed = config.speed || 3
    }
}


///// CAMERA
class Camera {
    constructor( config ){
        this.x = 0
        this.y = 0

        // tamanho do mundo virtual
        this.worldWidth  = WORLD_WIDTH
        this.worldHeight = WORLD_HEIGHT
        
        // Adiciona smoothing
        this.smoothSpeed = 0.08  // Ajuste este valor entre 0.01 e 0.1
        this.targetX = 0
        this.targetY = 0

        // dead-zone
        this.deadZoneSize = {
            width: BASE_WIDTH - 250,
            height: BASE_HEIGHT - 250
        }
        this.showDeadZone = false
    }

    lerp( start, end, t ) {
        return start + ( end - start ) * t
    }

    // seguir o player
    follow( target, ctx ) {
        // salvando o estado atual do contexto
        ctx.save()

        // dead-zone - calcula o centro da dead-zone
        const deadZoneCenterX = BASE_WIDTH / 2
        const deadZoneCenterY = BASE_HEIGHT / 2

        // limites da dead-zone
        const deadZoneLeft   = deadZoneCenterX - this.deadZoneSize.width / 2
        const deadZoneRight  = ( deadZoneCenterX + this.deadZoneSize.width / 2) - TILE_SIZE
        const deadZoneTop    = deadZoneCenterY - this.deadZoneSize.height / 2
        const deadZoneBottom = ( deadZoneCenterY + this.deadZoneSize.height / 2 ) - TILE_SIZE

        // atulizando a posição da camera APENAS se o target sair da dead-zone
        const screenX = target.x - this.x
        const screenY = target.y - this.y

        // move a cemra APENAS se o target estiver fora da dead-zone
        if( screenX < deadZoneLeft || screenX > deadZoneRight ){
            this.targetX = target.x - ( screenX < deadZoneLeft ? deadZoneLeft : deadZoneRight )
        }
        if( screenY < deadZoneTop || screenY > deadZoneBottom ){
            this.targetY = target.y - ( screenY < deadZoneTop ? deadZoneTop : deadZoneBottom )
        }

        // Aplica suavização
        this.x = this.lerp( this.x, this.targetX, this.smoothSpeed )
        this.y = this.lerp( this.y, this.targetY, this.smoothSpeed )

        // limita a movimentação da camera aos limites do mundo virtual
        this.x = Math.max( 0, Math.min( this.x, this.worldWidth - BASE_WIDTH ) )
        this.y = Math.max( 0, Math.min( this.y, this.worldHeight - BASE_HEIGHT ) )

        // aplica a transformação
        ctx.translate( -this.x, -this.y )
        
        // desenha a dead-zone
        if( this.showDeadZone ){
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            ctx.strokeRect(
                this.x + deadZoneLeft,
                this.y + deadZoneTop,
                this.deadZoneSize.width,
                this.deadZoneSize.height
            )
        }
    }
}