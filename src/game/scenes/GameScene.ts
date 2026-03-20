import Phaser from "phaser"
import { Player } from "../entities/Player"
import { Enemy } from "../entities/Enemy"

export class GameScene extends Phaser.Scene {
    player!: Player
    enemies: Enemy[] = []

    score = 0
    scoreText!: Phaser.GameObjects.Text

    gameWidth = 390
    gameHeight = 844

    constructor() {
        super('GameScene')    
    }

    create() {
        this.score = 0

        this.cameras.main.setBackgroundColor('#020617')

        this.player = new Player(this, 200, 700)

        this.scoreText = this.add.text(16, 16, 'Score: 0'), {
            fontSize: '24px',
            color: '#fff'
        }

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.spawnEnemy(),
        })
    }

    update(time: number, delta: number): void {
        this.player.update(delta)

        this.updateEnemies(delta)
        this.handleBulletEnemyCollisions()
        this.handlePlayerEnemyCollisions()
    }

    updateScoreText() {
        this.scoreText.setText(`Score: ${this.score}`)
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(30, this.gameWidth - 30)
        const enemy = new Enemy(this, x, -20)
        this.enemies.push(enemy)
    }

    updateEnemies(delta: number) {
        this.enemies = this.enemies.filter((enemy) => {
            enemy.update(delta)

            if (enemy.isOffscreen(this.gameHeight)){
                enemy.destroy()
                return false
            }
            return true
        })
    }

    handleBulletEnemyCollisions(){
        const bullets =  this.player.bullets

        for (let i = bullets.length - 1; i >= 0; i--){
            const bullet = bullets[i]

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j]

                const hit =  Phaser.Geom.Intersects.RectangleToRectangle(
                    bullet.sprite.getBounds(),
                    enemy.sprite.getBounds()
                )

                if (hit) {
                    bullet.destroy()
                    enemy.destroy()

                    bullets.splice(i, 1)
                    this.enemies.splice(j, 1)

                    this.score += 10
                    this.updateScoreText()
                    break
                }
            }
        }
    }

    handlePlayerEnemyCollisions() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i]

            const hit = Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.sprite.getBounds(),
                enemy.sprite.getBounds()
            )

            if (hit) {
                enemy.destroy()
                this.enemies.splice(i, 1)

                this.player.destroy()
                this.enemies.forEach((enemy) => enemy.destroy())
                this.enemies = []

                this.scene.restart()
                return
            }
        }
    }
}