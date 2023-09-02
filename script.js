let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = 1200
canvas.height = 600

let gravity = 0.2

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite{
    constructor({position, velocity, color ='red', offset}){
        this.position = position
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
            width: 100,
            height: 50,
            offset
        }
        this.isAttacking = false

    }
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }

        }
    update(){
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.position.y + this.height>= canvas.height){
            this.velocity.y = 0
            setTimeout(() => {
                this.dobleJump = 0
            }, 0);
        }else{
            this.velocity.y += gravity
            
        }
        console.log(this.dobleJump)

    }
    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}

let player = new Sprite({
    position:{
        x: 40,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    }
})

let enemy = new Sprite({
    position:{
        x: 600,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0
    }
})

keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    }
}

function retangularCollision({rect1, rect2}) {
    return (rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x  <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height)
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if(keys.a.pressed && player.position.x >= 0 && player.lastKey ==='a'){
        player.velocity.x = -5
    }else if(keys.d.pressed && player.position.x + player.width <= canvas.width && player.lastKey ==='d'){
        player.velocity.x = 5
    }

    if(retangularCollision({
        rect1: player,
        rect2: enemy
    }) && player.isAttacking){
        player.isAttacking = false
        console.log('go')
    }

}
animate()

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
    
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'w':
            if(player.dobleJump<2){
                player.velocity.y = -10
                player.dobleJump++;
            }
            break;
        case 'k':
            player.attack()
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'a':
            keys.a.pressed = false
            break;
    
        case 'd':
            keys.d.pressed = false
            break;
    }
})