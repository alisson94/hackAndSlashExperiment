class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0,y:0}}){
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 20
        this.offset = offset
    }
    draw(){
        c.drawImage(
            this.image,
            this.framesCurrent * this.image.width/this.framesMax,
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale)

    }

    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent + 1<this.framesMax){
                this.framesCurrent++
            }else{
                this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}



class Fighter extends Sprite{
    constructor({
        position, 
        velocity, 
        color ='red', 
        offset,
        imageSrc,
        scale,
        framesMax,
        sprites,
        attackBox = {offset:{}, width: undefined, height: undefined}
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        
        this.velocity = velocity
        this.color = color
        this.width = 50
        this.height = 150
        this.lastKey
        this.dobleJump = 0
        this.attackBox ={
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: attackBox.width,
            height:attackBox.height,
            offset: attackBox.offset
        }
        this.isAttacking = false
        this.health = 100

        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
        this.sprites = sprites
        this.death = false
        this.lado = 'r'

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].src
        }

    }
    
    update(){
        this.draw()

        if(!this.death){this.animateFrames()}

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.position.y + this.height + this.velocity.y>= canvas.height -95){
            this.velocity.y = 0
            this.position.y = 331
            setTimeout(() => {
                this.dobleJump = 0
            }, 0);
        }else{
            this.velocity.y += gravity
            
        }

    }

    switchSprite(sprite){
        //death
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax -1){
                this.death = true
            }
            return
        }
        //attack sprite
        if(this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax -1) return
        if(this.image === this.sprites.attack1L.image && this.framesCurrent < this.sprites.attack1L.framesMax -1) return

        //hit sprite
        if(this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax -1) return

        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break;
        
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'runL':
                if(this.image !== this.sprites.runL.image){
                    this.image = this.sprites.runL.image
                    this.framesMax = this.sprites.runL.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':{
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'fall':{
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'attack1':{
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'attack1L':{
                if(this.image !== this.sprites.attack1L.image){
                    this.image = this.sprites.attack1L.image
                    this.framesMax = this.sprites.attack1L.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'takeHit':{
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            }
            case 'death':{
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
            }
        }
    }

    attack(){
        if(this.lado === 'r'){
            this.switchSprite('attack1')
        }else{
            this.switchSprite('attack1L')
        }
        this.isAttacking = true
    }

    takeHit(hit){
        if(this.health<=0){
            this.switchSprite('death')
        }else{
            this.switchSprite('takeHit')
            this.health -= hit
        }
    }
}




// draw(){
//     c.fillStyle = this.color
//     c.fillRect(this.position.x, this.position.y, this.width, this.height)

//     if(this.isAttacking){
//         c.fillStyle = 'green'
//         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
//     }

//     }
// update(){
//     this.draw()
//     this.attackBox.position.x = this.position.x + this.attackBox.offset.x
//     this.attackBox.position.y = this.position.y + this.attackBox.offset.y

//     this.position.x += this.velocity.x
//     this.position.y += this.velocity.y
    
//     if(this.position.y + this.height>= canvas.height - 100){
//         this.velocity.y = 0
//         setTimeout(() => {
//             this.dobleJump = 0
//         }, 0);
//     }else{
//         this.velocity.y += gravity
        
//     }
//     console.log(this.dobleJump)

// }