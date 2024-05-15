import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    cursor: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {      
        // Add start to follow cursor
        this.cursor = this.add.image(512, 100, 'suika_cherry').setDepth(150).setScale(0.25);
        this.input.on('pointermove', () => {
            this.cursor.setPosition(this.input.mousePointer.x, 100);
        });

        this.matter.world.setBounds(0, 0, 540, 960);

        const cherry_shape = this.cache.json.get('suika_cherry-shape');
        const strawberry_shape = this.cache.json.get('suika_strawberry-shape');

        this.input.on('pointerdown', () => {
            console.log("click!");
            this.matter.add.image(this.input.mousePointer.x, 100, 'suika_cherry', null, { shape: cherry_shape }).setScale(0.3);
        });

        const t = this;
        this.matter.world.on('collisionstart', function (e, objA, objB) {
            console.log(objA); // TODO
            console.log(objB); // TODO
            if((objA.label == "suika_cherry.png-fixture-0") && (objB.label == "suika_cherry.png-fixture-0")) {
                t.matter.add.image(objA.position.x, objA.position.y, 'suika_strawberry', null, { shape: strawberry_shape }).setScale(0.4);
                // addStrawberry(bodyA.position.x, bodyA.position.y);
                objA.gameObject.destroy();
                objB.gameObject.destroy();
            }
        });
        // this.physics.add.collider(fruits, fruits);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
function combineObjects(bodyA: any, bodyB: any) {
    throw new Error('Function not implemented.');
}

function addStrawberry(x: any, y: any) {
    throw new Error('Function not implemented.');
}

