import Phaser from "phaser"
import { Player } from "../entities/Player"
import { Enemy } from "../entities/Enemy"

export class GameScene extends Phaser.Scene {
    player!: Player
    enemies: Enemy[] = []
    
    score = 0
    scoreText!: Phaser.GameObjects.Text
    hpText!: Phaser.GameObjects.Text
    gameOverText!: Phaser.GameObjects.Text
    
    gameWidth = 390
    gameHeight = 844
    isGameOver = false
    
    spawnTimer!: Phaser.Time.TimerEvent

    constructor() {
        super('GameScene')    
    }

    create() {
        this.score = 0
        this.isGameOver = false
        this.enemies = []

        this.cameras.main.setBackgroundColor('#020617')

        this.player = new Player(this, 200, 700)

        this.scoreText = this.add.text(16, 16, 'Score: 0'), {
            fontSize: '24px',
            color: '#fff'
        }

        this.hpText = this.add.text(16, 48, '', {
            fontSize: '20px',
            color: '#fff'
        })

        this.gameOverText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, '', {
            fontSize: '32px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5).setVisible(false)

        this.updateScoreText()
        this.updateHpText()

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.spawnEnemy(),
        })

        this.input.keyboard?.on('keydown-SPACE', () => {
            if (this.isGameOver) {
                this.scene.restart()
            }
        })

        this.input.on('pointerdown', () => {
            if (this.isGameOver) {
                this.scene.restart()
            }
        })

        this.spawnTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.isGameOver) {
                    this.spawnEnemy()
                }
            }
        })
    }

    update(time: number, delta: number): void {
        if (this.isGameOver) return

        this.player.update(delta)

        this.updateEnemies(delta)
        this.handleBulletEnemyCollisions()
        this.handlePlayerEnemyCollisions()
    }

    updateScoreText() {
        this.scoreText.setText(`Score: ${this.score}`)
    }

    updateHpText() {
        this.hpText.setText(`HP: ${this.player.hp}`)
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
        if (this.isGameOver) return
        if (!this.player?.sprite?.active) return

        for (const enemy of this.enemies) {
            if (!enemy?.sprite?.active) continue

            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.sprite.getBounds(),
                enemy.sprite.getBounds()
            )) {
                enemy.destroy()

                const died = this.player.takeHit()

                if(died){
                    this.isGameOver = true
                    this.triggerGameOver()
                    this.updateHpText()
                    return
                } else {
                    this.updateHpText()
                }
            }
        }
    }

    triggerGameOver() {
        this.isGameOver = true

        this.spawnTimer?.remove(false)

        this.player.destroy()
        this.enemies.forEach((enemy) => enemy.destroy())
        this.enemies = []

        this.gameOverText.setText(`GAME OVER\nScore: ${this.score}\n\nTap to restart`)
        this.gameOverText.setVisible(true)
    }
}