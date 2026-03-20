import Phaser from "phaser";

export class Player{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Rectangle

    targetX: number
    targetY: number

    speed = 0.15

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.scene = scene
                                                    //! coloring  0x inside code; in css -> # ; R = 38; G = bd; B = f8
        this.sprite = scene.add.rectangle(x, y, 30, 30, 0x38bdf8)

        this.targetX = x
        this.targetY = y

        this.setupInput()
    }

    setupInput() {
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.targetX = pointer.x
            this.targetY = pointer.y
        })
    }

    update(delta: number) {
        const dx = this.targetX - this.sprite.x
        const dy = this.targetY - this.sprite.y

        this.sprite.x += dx * this.speed
        this.sprite.y += dy * this.speed
    }
}