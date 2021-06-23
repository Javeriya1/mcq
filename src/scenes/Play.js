import Phaser from "phaser";

class Play extends Phaser.Scene {
    constructor(config) {
        super("PlayScene");
        this.config = config;

        this.fontSize = 18;
        this.fontFamily = "Arial";
        this.fontOptions = {
            fontSize: `${this.fontSize}px`,
            fontFamily: `${this.fontFamily}`,
            fill: "#000",
        };

        this.json;

        this.startingPointX = 90;
        this.optionStaringX = 80;
        this.gapX = 180;
        this.startingPointY = 200;
        this.gapY = 200;
        this.numOfItemsInRow = 3;
        this.menuItems = [];

        this.textStart = { x: 0, y: 0 };

        this.gapBetweenText = 40;


    }

    preload() {

        this.load.json("data", "assets/data/mcq.json");
        this.load.image("logo", "assets/logo.png");
        this.load.image('spark', 'assets/blue.png');

        this.load.on("filecomplete-json-data", (key, type, data) => {
            this.load.image("background", "assets/" + data.gameData.background);
            this.json = data;
            this.randomizeItems();
            for (let i = 0; i < this.json.gameData.items.length; i++) {
                this.load.image(
                    "items" + i,
                    "assets/" + this.json.gameData.items[i].image
                );
            }
            const choicesLength = this.json.gameData.items[0].choices.length;

            this.textStart.x = (choicesLength - 1) * (this.gapBetweenText * 0.5);
        });
    }

    randomizeItems() {
        const randomMenu = this.json.gameData.isRandonmize;

        if (randomMenu == true) {
            let j, x, i = 0, len = this.json.gameData.items.length;
            let pictures = this.json.gameData.items;

            for (i; i < len; i++) {
                j = Math.floor(Math.random() * len);
                x = pictures[i];
                pictures[i] = pictures[j];
                pictures[j] = x;
            }
        }
    }

    create() {
        this.background = this.add
            .image(0, 0, "background")
            .setOrigin(0)
            .setScale(2);
        this.add.image(40, 20, "logo").setOrigin(0).setScale(1.5);
        this.add.text(20, 100, this.json.gameData.heading, this.fontOptions);
        this.particles = this.add.particles('spark');
        this.createMenuItems();
    }

    createMenuItems() {
        for (let i = 0; i < this.json.gameData.items.length; i++) {
            this.createItem(this.json.gameData.items[i], i);
        }
    }

    createItem(menuJsonItem, index) {
        this.menuItems[index] = {};

        this.menuItems[index].image = this.add.image(
            this.startingPointX + this.gapX * (index % this.numOfItemsInRow),
            this.startingPointY +
            this.gapY * Math.floor(index / this.numOfItemsInRow),
            "items" + index
        );

        this.menuItems[index].choices = [];
        this.menuItems[index].isComplete = false;
       
        for (
            let choiceIndex = 0;
            choiceIndex < menuJsonItem.choices.length;
            choiceIndex++
        ) {
            this.textWithCircles(
                this.menuItems[index],
                choiceIndex,
                menuJsonItem.choices
            );
        }

        this.setupMenuItems(this.menuItems[index]);

    }

    textWithCircles(menuItem, choiceIndex, choicesJson) {
        // const textOffsetX = 35;
        const textOffsetY = 40;
        const circleOffsetY = 20;

        let object = {};
        object.text = choicesJson[choiceIndex].choice;
        object.circle = "";
        menuItem.choices[choiceIndex] = object;

        menuItem.choices[choiceIndex].text = this.add
            .text(
                menuItem.image.x - this.textStart.x + this.gapBetweenText * choiceIndex,
                menuItem.image.y + textOffsetY,
                menuItem.choices[choiceIndex].text,
                this.fontOptions
            )
            .setAlign("center")
            .setOrigin(0.5);

        menuItem.choices[choiceIndex].circle = this.add.circle(
            menuItem.choices[choiceIndex].text.x,
            menuItem.choices[choiceIndex].text.y + circleOffsetY,
            6
        );
        menuItem.choices[choiceIndex].circle
            .setStrokeStyle(1, 0x000)
            .setOrigin(0.5);

        menuItem.choices[choiceIndex].circle.setDataEnabled();

        menuItem.choices[choiceIndex].circle.data.set(
            "isMatch",
            choicesJson[choiceIndex].isCorrect ? true : false
        );
        menuItem.choices[choiceIndex].circle.data.set(
            "isSelected", false);
    }


    setupMenuItems(menuItem) {
        const choices = menuItem.choices;
        for (let choiceIndex = 0; choiceIndex < choices.length; choiceIndex++) {
            // let isSelected = false;
            const currentChoice = choices[choiceIndex];
            currentChoice.circle.setInteractive();

            currentChoice.circle.on("pointerover", () => {
                currentChoice.circle.setScale(1.3);
            });

            currentChoice.circle.on("pointerout", () => {
                currentChoice.circle.setScale(1);
            });

            currentChoice.circle.on("pointerdown", () => {

                const isMatch = currentChoice.circle.data.get("isMatch");
                let isSelected = currentChoice.circle.data.get("isSelected");
                if (isSelected) {
                    return;
                }
                currentChoice.circle.data.values.isSelected = true;
                if (isMatch == true) {
                    menuItem.isComplete = true;
                    currentChoice.circle.setFillStyle(0x03680d);
                    this.clearOtherCircles(choiceIndex, choices);
                    this.positionToCenter(choiceIndex, choices, menuItem)

                } else {
                    currentChoice.circle.setFillStyle(0xc6041a);
                    this.makeNormalColor(choiceIndex, choices, menuItem);

                }

                this.matchAllItems(menuItem);
                console.log(menuItem);

            });
        }
    }

    clearOtherCircles(choiceIndex, choices) {
        for (let i = 0; i < choices.length; i++) {
            if (choiceIndex != i) {
                choices[i].text.destroy();
                choices[i].circle.destroy();
            }
        }
    }

    makeNormalColor(choiceIndex, choices, menuItem) {

        for (let i = 0; i < choices.length; i++) {

            if (choiceIndex != i) {
                choices[i].circle.data.values.isSelected = false;

                choices[i].circle.setFillStyle(0xffffff, 0);

            }
        }
        this.tweengForWrongMatch(menuItem);

    }

    tweengForWrongMatch(menuItem) {

        let count = 0;
        const displayText = this.add.text(menuItem.image.x,
            menuItem.image.y - 50, 'Try again', this.fontOptions).setOrigin(0.5);


        this.tweens.add({
            targets: displayText,
            ease: 'Power1',
            alpha: 0,
            duration: 3000,
            onComplete: () => {
                displayText.destroy();
            }

        })

        this.tweens.add({
            targets: menuItem.image,
            scale: { from: 1, to: 1.1 },
            ease: 'Sine.easeInOut',
            duration: 300,
            delay: count * 50,
            repeat: 2,
            yoyo: true

        });
    }

    positionToCenter(choiceIndex, choices, menuItem) {

        for (let i = 0; i < choices.length; i++) {
            if (choiceIndex == i) {
                this.tweens.add({
                    targets: choices[i].text,
                    x: menuItem.image.x,
                    ease: 'POWER1',
                    duration: 1000,
                    yoyo: false,
                    repeat: 0,

                });
                this.tweens.add({
                    targets: choices[i].circle,
                    x: menuItem.image.x,
                    ease: 'POWER1',
                    duration: 1000,
                    yoyo: false,
                    repeat: 0,

                });
                const emitterImage = this.particles.createEmitter({
                    on: false,
                    x: menuItem.image.x,
                    y: menuItem.image.y,
                    speed: { min: - 20, max: 50 },
                    lifespan: 2000,
                    scale: { start: 0.1, end: 0 },
                    blendMode: 'ADD'
                });

                emitterImage.start();

                this.time.delayedCall(2000, () => {

                    emitterImage.stop();
                    emitterImage.killAll();

                });
                this.time.delayedCall(2000, () => {

                    choices[i].circle.destroy();

                });
            }

        }

    }

    matchAllItems() {
        let isComplete = true;
        for (let i = 0; i < this.menuItems.length; i++) {

            if (this.menuItems[i].isComplete == false) {
                isComplete = false;
            }

        }
        if (isComplete) {
            this.time.delayedCall(1500, () => {
                const displayText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU WON!', this.fontOptions).setOrigin(0.5);;

                this.tweens.add({
                    targets: displayText,
                    scale: 2,
                    duration: 5000,
                    yoyo: -1
                })

                const emitterBackground = this.particles.createEmitter({
                    on: false,
                    delay: 1000,
                    x: this.background.x + 250,
                    y: this.background.y - 50,
                    angle: { min: -180, max: -360 },
                    speed: { min: 180, max: 360 },
                    quantity: 6,
                    lifespan: 10000,
                    scale: { start: 0.1, end: 0 },
                    blendMode: 'ADD'
                });

                emitterBackground.start();

                this.time.delayedCall(5000, () => {

                    emitterBackground.stop();

                });
            })
        }
    }
}

export default Play;
