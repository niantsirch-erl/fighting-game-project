document.addEventListener('DOMContentLoaded', function(){

    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = 1024
    canvas.height = 576

    c.fillRect(0, 0, canvas.width, canvas.height)

    const gravity = 0.6

    class Sprite {
        constructor ({position, imgScr, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){
            this.position = position
            this.width = 50
            this.height = 150
            this.image = new Image()
            this.image.src = imgScr
            this.scale = scale
            this.framesMax = framesMax
            this.framesCurrent = 0
            this.framesElapsed = 0
            this.framesHold = 10
            this.offset = offset
        }
    
        draw(){
            c.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesMax) * this.scale, 
                this.image.height * this.scale
            )
            
        }

        animateFrames() {
            this.framesElapsed++

            if (this.framesElapsed % this.framesHold === 0){
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                }else{
                    this.framesCurrent = 0
                }
    
            }
        }
    
        update() {
            this.draw()
            this.animateFrames()
        }
    
    }

    
    
    
    class Figther extends Sprite{
        constructor ({
            position, 
            velocity, 
            color = 'red', 
            imgScr, 
            scale = 1, 
            framesMax = 1, 
            offset = {x: 0, y: 0}, 
            sprites, 
            attackBox = {offset: {}, width: undefined, height: undefined}
            }){

            super({
                position,
                imgScr,
                scale,
                framesMax,
                offset
            })

            this.velocity = velocity
            this.width = 50
            this.height = 150
            this.lastKey
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset: attackBox.offset,
                width: attackBox.width,
                height: attackBox.height,
            }
            this.color = color
            this.isAttacking
            this.health = 100
            this.framesCurrent = 0
            this.framesElapsed = 0
            this.framesHold = 10
            this.sprites = sprites
            this.dead = false

            for (const sprite in this.sprites) {
                sprites[sprite].image = new Image()
                sprites[sprite].image.src = sprites[sprite].imgScr
            }

            console.log(this.sprites);
        }
    
        
    
        update() {
            this.draw();
            if(!this.dead){
                this.animateFrames()
            }
            
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y

            // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height) //attckbox
    
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
    
            if (this.position.y + this.height + this.velocity.y >= canvas.height - 97){
                this.velocity.y = 0
                this.position.y = 329
            }else{
                this.velocity.y += gravity
            }
            
        }
    
        attack(){
            this.switchSprite('attack1')
            this.isAttacking = true
            
        }

        takehit(){
           
            this.health -= 20

            if(this.health <= 0 ){
                this.switchSprite('death')
            }else{
                this.switchSprite('takeHit')
            }
        }

        switchSprite(sprite){
            if(this.image === this.sprites.death.image){
                if(this.framesCurrent === this.sprites.death.framesMax - 1){
                    this.dead = true
                }
                return
            }
            //it will overide all animations with the attack animations
            if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

            //will overide all animations with the takeHit animations
            if (this.image === this.sprites.takehit.image && this.framesCurrent < this.sprites.takehit.framesMax - 1) return

            switch (sprite) {
                case 'idle':
                    if(this.image !== this.sprites.idle.image){
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'run':
                    if (this.image !== this.sprites.run.image) {
                        this.image = this.sprites.run.image
                        this.framesMax = this.sprites.run.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'jump':
                    if (this.image !== this.sprites.jump.image) {
                        this.image = this.sprites.jump.image
                        this.framesMax = this.sprites.jump.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'fall':
                    if (this.image !== this.sprites.fall.image) {
                        this.image = this.sprites.fall.image
                        this.framesMax = this.sprites.fall.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'attack1':
                    if (this.image !== this.sprites.attack1.image) {
                        this.image = this.sprites.attack1.image
                        this.framesMax = this.sprites.attack1.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'takeHit':
                    if (this.image !== this.sprites.takehit.image) {
                        this.image = this.sprites.takehit.image
                        this.framesMax = this.sprites.takehit.framesMax
                        this.framesCurrent = 0
                    }
                    break
                case 'death':
                    if (this.image !== this.sprites.death.image) {
                        this.image = this.sprites.death.image
                        this.framesMax = this.sprites.death.framesMax
                        this.framesCurrent = 0
                    }
                    break
            }
        }
    }


    

    const background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imgScr: './assets/background.png'
    })

    const shop = new Sprite({
        position: {
            x: 600,
            y: 130
        },
        imgScr: './assets/shop.png',
        scale: 2.75,
        framesMax: 6
    })

    const player = new Figther({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },imgScr: './assets/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x: 215,
            y: 155
        },
        sprites: {
            idle: {
                imgScr: './assets/samuraiMack/Idle.png',
                framesMax: 8
            },
            run: {
                imgScr: './assets/samuraiMack/Run.png',
                framesMax: 8,
                
            },
            jump: {
                imgScr: './assets/samuraiMack/Jump.png',
                framesMax: 2
            },
            fall: {
                imgScr: './assets/samuraiMack/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgScr: './assets/samuraiMack/Attack1.png',
                framesMax: 6
            },
            takehit: {
                imgScr: './assets/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imgScr: './assets/samuraiMack/Death.png',
                framesMax: 6
            }
        },
        attackBox: {
            offset: {
              x: 100,
              y: 50
            },
            width: 160,
            height: 50
          }
    })

    const player2 = new Figther({
        position: {
            x: 400,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        },imgScr: './assets/kenji/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset: {
            x: 214,
            y: 167
        },
        sprites: {
            idle: {
                imgScr: './assets/kenji/Idle.png',
                framesMax: 4
            },
            run: {
                imgScr: './assets/kenji/Run.png',
                framesMax: 8,
                
            },
            jump: {
                imgScr: './assets/kenji/Jump.png',
                framesMax: 2
            },
            fall: {
                imgScr: './assets/kenji/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgScr: './assets/kenji/Attack1.png',
                framesMax: 4
            },
            takehit: {
                imgScr: './assets/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imgScr: './assets/kenji/Death.png',
                framesMax: 7
            }
        },attackBox: {
            offset: {
              x: -170,
              y: 50
            },
            width: 170,
            height: 50
          }

    })

    console.log(player);

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        }
    }

    function RectCollisions({ rectangle1, rectangle2 }) {
        return (
          rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
            rectangle2.position.x &&
          rectangle1.attackBox.position.x <=
            rectangle2.position.x + rectangle2.width &&
          rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
            rectangle2.position.y &&
          rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
    }
      
    function determineWinner({ player, enemy, timerId }) {
      clearTimeout(timerId)
      document.querySelector('#displayText').style.display = 'flex'
      if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
      } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
      } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
      }

        document.querySelector('#restartButton').innerHTML = 'Restart';
        document.querySelector('#restartButton').style.display = 'flex';

        document.querySelector('#restartButton').addEventListener('click', function(){
            location.reload()
        })
    }
    
    let timer = 60
    let timerId
    function decreaseTimer() {
      if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
      }
    
      if (timer === 0) {
        determineWinner({ player, enemy: player2, timerId })
      }
    }
    
    decreaseTimer()

    // const player1Options = document.getElementById('player1-options');
    // const player2Options = document.getElementById('player2-options');
    // const startButton = document.getElementById('start-game');

    // let selectedCharacterPlayer1 = null;
    // let selectedCharacterPlayer2 = null;

    // player1Options.addEventListener('click', (event) => {
    //     const characterOption = event.target.closest('.character-option');
    //     if (characterOption) {
    //         selectedCharacterPlayer1 = characterOption.getAttribute('data-character');
           
    //     }
    // });

    // player2Options.addEventListener('click', (event) => {
    //     const characterOption = event.target.closest('.character-option');
    //     if (characterOption) {
    //         selectedCharacterPlayer2 = characterOption.getAttribute('data-character');
            
    //     }
    // });

    // startButton.addEventListener('click', () => {
    //     if (selectedCharacterPlayer1 && selectedCharacterPlayer2) {
    //         document.querySelector('.character-select').style.display = 'none';

    //         document.querySelector('.game-container').style.display = 'block';

    //         startGame(selectedCharacterPlayer1, selectedCharacterPlayer2);
            
    //         document.querySelector('.character-select').style.display = 'none';
        
    //     } else {
    //         alert('Both players need to select characters before starting the game.');
    //     }
    // });

    // function startGame(player1Character, player2Character) {
        
    //     const player1Sprites = getCharacterSprites(player1Character);
    //     const player2Sprites = getCharacterSprites(player2Character);
    
    //     player.imgScr = player1Sprites.idle.imgScr;
    //     player.framesMax = player1Sprites.idle.framesMax;
    //     player.sprites = player1Sprites;

    //     player2.imgScr = player2Sprites.idle.imgScr;
    //     player2.framesMax = player2Sprites.idle.framesMax;
    //     player2.sprites = player2Sprites;
        
    // }
    
    
    // function getCharacterSprites(characterName) {
        
    //     const characterSprites = {
    //         samuraiMack: {
    //             idle: {
    //                 imgScr: './assets/samuraiMack/Idle.png',
    //                 framesMax: 8
    //             },
                
    //         },
    //         kenji: {
    //             idle: {
    //                 imgScr: './assets/kenji/Idle.png',
    //                 framesMax: 4
    //             },
                
    //         }
    //     };
    
    //     return characterSprites[characterName];
    // }


    

    function animate () {
        window.requestAnimationFrame(animate)
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
        background.update()
        shop.update()
        c.fillStyle = 'rgba(255, 255, 255, 0.1)'
        c.fillRect(0, 0, canvas.width, canvas.height)
        player.update()
        player2.update()

        player.velocity.x = 0
        player2.velocity.x = 0

        //player movement
        if(keys.a.pressed && player.lastKey === 'a'){
            player.velocity.x = -3
            player.switchSprite('run')
        }else if(keys.d.pressed && player.lastKey === 'd'){
            player.velocity.x = 3
            player.switchSprite('run')
        }else{
            player.switchSprite('idle')
        }

        if(player.velocity.y < 0){
            player.switchSprite('jump')
        }else if (player.velocity.y > 0){
            player.switchSprite('fall')
        }

            //enemy movement
        if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
            player2.velocity.x = -3
            player2.switchSprite('run')
        }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
            player2.velocity.x = 3
            player2.switchSprite('run')
        }else{
            player2.switchSprite('idle')
        }

        if(player2.velocity.y < 0){
            player2.switchSprite('jump')
        }else if (player2.velocity.y > 0){
            player2.switchSprite('fall')
        }


        //detect collisions & take hit 
        if (RectCollisions({
            rectangle1: player, 
            rectangle2: player2
        }) && player.isAttacking && player.framesCurrent === 4) {
            player2.takehit()
            player.isAttacking = false
            
            // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
            gsap.to( '#enemyHealth', {
                width: player2.health + '%'
            })
            console.log('Hit')
        }

        //border collision player
        if(player.position.x < 0){
            player.position.x = 0
        }else if (player.position.x + player.width * player.scale > canvas.width){
            player.position.x = canvas.width - player.width * player.scale
        }

        //border collision enemy
        if(player2.position.x < 0){
            player2.position.x = 0
        }else if (player2.position.x + player2.width * player2.scale > canvas.width){
            player2.position.x = canvas.width - player2.width * player2.scale
        }

        //player misses
        if(player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false
        }

        //player gets hit
        if (RectCollisions({
            rectangle1: player2, 
            rectangle2: player
        }) && player2.isAttacking && player2.framesCurrent === 2) {
            player.takehit()
            player2.isAttacking = false
            // document.querySelector('#playerHealth').style.width = player.health + '%'
            gsap.to( '#playerHealth', {
                width: player.health + '%'
            })
            console.log('Hit')
        }

        // enemy misses
        if(player2.isAttacking && player2.framesCurrent === 2){
            player2.isAttacking = false
        }

        //end game base on health
        if (player2.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy: player2, timerId })
        }
        
    }

    animate();

    window.addEventListener('keydown', (event) => {
        if(!player.dead){
            switch(event.key){
                case 'd':
                    keys.d.pressed = true
                    player.lastKey = 'd'
                    break
                case 'a':
                    keys.a.pressed = true
                    player.lastKey = 'a'
                    break
                case 'w':
                    player.velocity.y = -20
                    break
                case ' ':
                    player.attack()
                    break;
            }
        }

        if(!player2.dead){
            switch (event.key) {
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true
                    player2.lastKey = 'ArrowRight'
                    break
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true
                    player2.lastKey = 'ArrowLeft'
                    break
                case 'ArrowUp':
                    player2.velocity.y = -20
                    break
                case 'ArrowDown':
                    player2.attack()
                    break
            }   
        }

    });

    window.addEventListener('keyup', (event) => {
        switch(event.key){
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
        }

        //enemy case
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
        }
        

    });

    
})