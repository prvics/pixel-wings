import Phaser from "phaser"
import { Player } from "../entities/Player"

export class GameScene extends Phaser.Scene {
    player!: Player

    constructor() {
        super('GameScene')    
    }

    create() {
        this.player = new Player(this, 200, 700)
    }

    update(time: number, delta: number): void {
        this.player.update(delta)
    }
}