let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

let gravity = 0.2

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

let background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
})

let shop = new Sprite({
    position:{
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

let player = new Fighter({
    position:{
        x: 40,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{
        x: 215,
        y: 157
    },
    sprites:{
        idle:{
            src: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            src: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        runL:{
            src: './img/samuraiMack/RunL.png',
            framesMax: 8
        },
        jump:{
            src: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:{
            src: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:{
            src: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        attack1L:{
            src: './img/samuraiMack/Attack1L.png',
            framesMax: 6
        },
        takeHit:{
            src: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:{
            src: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width: 160,
        height:50
    }
})

let enemy = new Fighter({
    position:{
        x: 600,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
        x: 215,
        y: 170
    },
    sprites:{
        idle:{
            src: './img/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            src: './img/kenji/Run.png',
            framesMax: 8
        },
        jump:{
            src: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall:{
            src: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1:{
            src: './img/kenji/Attack1.png',
            framesMax: 6
        },
        attack1L:{
            src: './img/samuraiMack/Attack1L.png',
            framesMax: 6
        },
        takeHit:{
            src: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death:{
            src: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x:0,
            y:0
        },
        width: 100,
        height:50
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
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if(keys.a.pressed && player.position.x >= 0 && player.lastKey ==='a'){
        player.switchSprite('runL')
        player.velocity.x = -5
        player.attackBox.offset.x = -150

    }else if(keys.d.pressed && player.position.x + player.width <= canvas.width && player.lastKey ==='d'){
        player.switchSprite('run')
        player.velocity.x = 5
        player.attackBox.offset.x = 100

    }else{
        player.switchSprite('idle')

    }

    //jumping
    if(player.velocity.y<0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')

    }
    //enemy movement
    if(!enemy.death){
        if(player.position.x < enemy.position.x){
            enemy.switchSprite('run')
            enemy.velocity.x = -0.3
        }else if(player.position.x > enemy.position.x){
            enemy.switchSprite('run')
            enemy.velocity.x = 0.3
        }else{
            enemy.switchSprite('idle')
        }

    }

    //detect collision player attack
    if(retangularCollision({
        rect1: player,
        rect2: enemy
    }) && player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
        enemy.takeHit(20)
    }

    //if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false

    }

    //player hit only contact
    // if(retangularCollision({
    //     rect1: enemy,
    //     rect2: player
    // })){
    //     console.log('hit')
    //     player.takeHit(1)
    // }

}
animate()

window.addEventListener('keydown', (e) => {
    if(!player.death){
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
                break
        }

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