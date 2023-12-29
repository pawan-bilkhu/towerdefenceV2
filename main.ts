namespace SpriteKind {
    export const Turret = SpriteKind.create()
    export const Indicator = SpriteKind.create()
    export const Launcher = SpriteKind.create()
    export const Barrel = SpriteKind.create()
    export const RocketCalibre = SpriteKind.create()
    export const SmallCalibre = SpriteKind.create()
    export const Explosion = SpriteKind.create()
}
// Player movement controls
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += -1
    setPlayerTileMapPosition()
})
// ------------------------------------------
// Selecting a Tower Sprite
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    towerType += 1
    towerType = towerType % 2
    displayTilePlacementIndicator(towerType)
})
// Barrel Generation for tower
function generateBarrel (barrelType: number, targetSprite: Sprite, shootingSprite: Sprite, length: number, steps: number) {
    for (let sprite of spriteutils.getSpritesWithin(SpriteKind.Barrel, length*steps, shootingSprite)){
        sprites.destroy(sprite)
    }
    if (targetSprite != shootingSprite) {
        for (let index = 1; index <= length; index++) {
            barrelSprite = sprites.create(barrelSpriteObject["Image"][barrelType], SpriteKind.Barrel)
            barrelSprite.setPosition(shootingSprite.x, shootingSprite.y)
            spriteutils.placeAngleFrom(
            barrelSprite,
            spriteutils.angleFrom(shootingSprite, targetSprite),
            index*steps,
            shootingSprite
            )
            barrelSprite.z = 15
            //barrelSprite.lifespan = lifespan
        }
    } else {
        for (let index = 1; index <= length; index++) {
            barrelSprite = sprites.create(barrelSpriteObject["Image"][barrelType], SpriteKind.Barrel)
            barrelSprite.setPosition(shootingSprite.x, shootingSprite.y - (index*steps))
            barrelSprite.z = 15
            //barrelSprite.lifespan = lifespan
        }
    }
}
// Placing a Tower Sprite
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tiles.tileAtLocationEquals(playerSprite.tilemapLocation(), assets.tile`transparency16`) && emptyTile) {
        generateTower(towerType)
    }
})
// Generate a Player Sprite
function generatePlayer () {
    playerColumn = 4
    playerRow = 5
    playerSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . f . . . . . . . . 
        . . . . . . f 1 f . . . . . . . 
        . . . . . f 1 1 1 f . . . . . . 
        . . . . f 1 1 1 1 1 f . . . . . 
        . . . . . f f 1 f f . . . . . . 
        . . . . . . f 1 f . . . . . . . 
        . . . . . . f 1 f . . . . . . . 
        . . . . . . f 1 f . . . . . . . 
        . . . . . . . f . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)
    playerSprite.z = 50
    playerSprite.setFlag(SpriteFlag.GhostThroughWalls, true)
    scene.cameraFollowSprite(playerSprite)
}
// ------------------------------------------
// Destroying Enemy Sprites upon overlapping with a lava tile
scene.onOverlapTile(SpriteKind.Enemy, sprites.dungeon.hazardLava1, function (sprite, location) {
    sprites.destroy(sprite, effects.fire, 100)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColumn += -1
    setPlayerTileMapPosition()
})
// Destroying sprites on zero health
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    sprites.destroy(status.spriteAttachedTo())
})
// Enemy Sprite movement behaviour
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn2)) {
        sprite.setVelocity(0, enemySpeed)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn4)) {
        sprite.setVelocity(enemySpeed * -1, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn1)) {
        sprite.setVelocity(0, enemySpeed)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadTurn3)) {
        sprite.setVelocity(enemySpeed, 0)
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection3)) {
        if (Math.percentChance(50)) {
            sprite.setVelocity(enemySpeed * -1, 0)
            sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
        } else {
            sprite.setVelocity(0, enemySpeed)
        }
    } else if (sprite.tileKindAt(TileDirection.Center, sprites.vehicle.roadIntersection4)) {
        sprite.setVelocity(0, enemySpeed)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    playerColumn += 1
    setPlayerTileMapPosition()
})
// Destroying enemies when a rocket strikes them
sprites.onOverlap(SpriteKind.RocketCalibre, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -20
    sprites.destroy(sprite)
})

// Setting player on tilemap based on playerColumn and playerRow variables
function setPlayerTileMapPosition () {
    playerColumn = playerColumn % 16
    playerRow = playerRow % 16
    if (playerColumn < 0) {
        playerColumn += 16
    }
    if (playerRow < 0) {
        playerRow += 16
    }
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(playerColumn, playerRow))
}
// Enemy Sprite movment when they overlap an intersection tile
scene.onOverlapTile(SpriteKind.Enemy, sprites.vehicle.roadHorizontal, function (sprite, location) {
    if (!(tiles.tileAtLocationIsWall(location))) {
        sprite.setFlag(SpriteFlag.GhostThroughWalls, false)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    playerRow += 1
    setPlayerTileMapPosition()
})
// Debugging tools
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    playerSprite.sayText("" + playerSprite.tilemapLocation().column + ", " + playerSprite.tilemapLocation().row)
    info.setScore(sprites.allOfKind(SpriteKind.Player).length)
})
// Enemy being hit by rapid fire Tower Sprite
sprites.onOverlap(SpriteKind.SmallCalibre, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -3
    sprites.destroy(sprite)
})
// Generating projectiles that are shot from Tower Sprites
function generateProjectile (projectileType: number, targetSprite: Sprite, shootingSprite: Sprite, speed: number) {
    projectile = sprites.create(projectileSpriteObject["Image"][projectileType], projectileSpriteObject["Kind"][projectileType])
    projectile.setPosition(shootingSprite.x, shootingSprite.y)
    projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
    projectile.follow(targetSprite, 100)
    projectile.lifespan = 1500
}
// Displaying the tile placement indicator
function displayTilePlacementIndicator (indicatorType: number) {
    animation.runImageAnimation(
    currentTileIndicatorSprite,
    indicatorSpriteAnimationList[indicatorType],
    150,
    true
    )
}
// A function that creates Tower Sprites
function generateTower (towerType: number) {
    let nearbyEnemyList: Sprite[] = []
    towerSprite = sprites.create(towerSpriteObject["Image"][towerType], towerSpriteObject["Kind"][towerType])
    towerSprite.z = 10
    tiles.placeOnTile(towerSprite, playerSprite.tilemapLocation())
    spriteutils.onSpriteUpdateInterval(towerSprite, towerSpriteObject["Update"][towerType], function (sprite) {
        nearbyEnemyList = spriteutils.getSpritesWithin(SpriteKind.Enemy, 50, sprite)
        if (nearbyEnemyList.length > 0) {
            generateProjectile(towerType, nearbyEnemyList[0], sprite, towerSpriteObject["Update"][towerType] / 5)
            generateBarrel(towerType, nearbyEnemyList[0], sprite, barrelSpriteObject["Size"][towerType], 2)
        } else {
            generateBarrel(towerType, sprite, sprite, barrelSpriteObject["Size"][towerType], 2)
        }
    })
}


let statusbar: StatusBarSprite = null
let enemySprite: Sprite = null
let towerSprite: Sprite = null
let projectile: Sprite = null
let explosionSprite: Sprite = null
let playerColumn = 0
let playerSprite: Sprite = null
let barrelSprite: Sprite = null
let playerRow = 0
let currentTileIndicatorSprite: Sprite = null
let fireRate = 0
let enemySpeed = 0
let emptyTile = false
let towerType = 0
let indicatorSpriteAnimationList: Image[][] = []
let towerSpriteObject = {
    "Image": [img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . b b b b . . . . . . 
    . . . . . b b f f b b . . . . . 
    . . . . . b f 2 2 f b . . . . . 
    . . . . . b f 2 2 f b . . . . . 
    . . . . . b b f f b b . . . . . 
    . . . . . . b b b b . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . b . . . . . . . . b . . . 
    . . . . b f f . . f f b . . . . 
    . . . . f b b f f b b f . . . . 
    . . . . . b f c c f b . . . . . 
    . . . . . b f c c f b . . . . . 
    . . . . f b b f f b b f . . . . 
    . . . . b f f . . f f b . . . . 
    . . . b . . . . . . . . b . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `],
    "Kind": [SpriteKind.Turret, SpriteKind.Launcher],
    "Update": [250, 700],
}
let barrelSpriteObject = {
    "Image": [img`
        2 2
        2 2
    `, img`
        c c
        c c
    `],
    "Size": [3, 5]
}
indicatorSpriteAnimationList = [assets.animation`myAnim0`, assets.animation`myAnim1`]
let projectileSpriteObject = {
    "Image": [img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . 4 4 . . . . . . . 
    . . . . . . 4 5 5 4 . . . . . . 
    . . . . . . 2 5 5 2 . . . . . . 
    . . . . . . . 2 2 . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . b b . . . . . . . 
    . . . . . . . b b . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `],
    "Kind": [SpriteKind.SmallCalibre, SpriteKind.RocketCalibre]
}
towerType = 0
emptyTile = true
enemySpeed = 30
fireRate = 500
currentTileIndicatorSprite = sprites.create(img`
    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 . . . . . . . . . . . . . . 5 
    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
    `, SpriteKind.Indicator)
displayTilePlacementIndicator(0)
currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, true)
scene.setBackgroundColor(1)
tiles.setCurrentTilemap(tilemap`level1`)
generatePlayer()
setPlayerTileMapPosition()

game.onUpdate(function () {
    for (let kindValue of towerSpriteObject["Kind"]) {
        for (let value of sprites.allOfKind(kindValue)) {
            emptyTile = true
            if (playerSprite.overlapsWith(value)) {
                emptyTile = false
                break;
            }
        }
    }
})
game.onUpdate(function () {
    if (playerSprite.tileKindAt(TileDirection.Center, assets.tile`transparency16`) && emptyTile) {
        tiles.placeOnTile(currentTileIndicatorSprite, playerSprite.tilemapLocation())
        currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, false)
    } else {
        currentTileIndicatorSprite.setFlag(SpriteFlag.Invisible, true)
    }
})
game.onUpdate(function () {
    for(let kindValue of projectileSpriteObject["Kind"]) {
        for (let value of sprites.allOfKind(kindValue)) {
            if (Math.abs(value.vx) + Math.abs(value.vy) == 0) {
                sprites.destroy(value)
            }
        }
    }
})
game.onUpdateInterval(3000, function () {
    enemySprite = sprites.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        ......fffcdb1bdffff.....
        ....fc111cbfbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbffffffbfbfbf....
        .........ffffff.........
        ...........fff..........
        ........................
        ........................
        ........................
        ........................
        `, SpriteKind.Enemy)
    tiles.placeOnRandomTile(enemySprite, assets.tile`myTile`)
    enemySprite.setVelocity(53, 0)
    statusbar = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
    let maxHealth = Math.randomRange(100, 200)
    statusbar.max = maxHealth
    statusbar.value = maxHealth
    statusbar.attachToSprite(enemySprite)
})
