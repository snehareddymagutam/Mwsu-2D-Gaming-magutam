var level_01 = {

	preload: function () {

	},

	create: function () {
		console.log("level_01.js");

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.prevDir = 'left';	// holds sprites previous direction (left , right) so
		this.animation_playing_attack = true;
		this.animation_playing = true;
		// we can face the correct direction when using the 'idle' animation

		// Adding the knight atlas that contains all the animations
		this.player = game.add.sprite(game.camera.width / 2, game.camera.height / 2, 'knight_atlas');


		// Add walking and idle animations. Different aninmations are needed based on direction of movement.
		this.player.animations.add('walk_left', Phaser.Animation.generateFrameNames('Walk_left', 0, 8), 20, true);
		this.player.animations.add('walk_right', Phaser.Animation.generateFrameNames('Walk_right', 0, 8), 20, true);
		this.player.animations.add('idle_left', Phaser.Animation.generateFrameNames('Idle_left', 0, 9), 20, true);
		this.player.animations.add('idle_right', Phaser.Animation.generateFrameNames('Idle_right', 0, 9), 20, true);
		this.player.animations.add('run_left', Phaser.Animation.generateFrameNames('Run_left', 0, 9), 20, true);
		this.player.animations.add('run_right', Phaser.Animation.generateFrameNames('Run_right', 0, 9), 20, true);
		this.player.animations.add('jump_left', Phaser.Animation.generateFrameNames('Jump_left', 0, 9), 20, true);
		this.player.animations.add('jump_right', Phaser.Animation.generateFrameNames('Jump_right', 0, 9), 20, true);
		this.player.animations.add('dead', Phaser.Animation.generateFrameNames('Dead', 1, 10), 20, false);
		this.player.animations.add('attack_left', Phaser.Animation.generateFrameNames('Attack_left', 0, 9), 20, false);
		this.player.animations.add('attack_right', Phaser.Animation.generateFrameNames('Attack_right', 0, 9), 20, false);
		this.player.animations.add('jumpattack_left', Phaser.Animation.generateFrameNames('JumpAttack_left', 0, 9), 20, true);
		this.player.animations.add('jumpattack_right', Phaser.Animation.generateFrameNames('JumpAttack_right', 0, 9), 20, true);

		this.player.animations.play('idle_left');

		game.physics.arcade.enable(this.player);

		// set the anchor for sprite to middle of the view
		this.player.anchor.setTo(0.5);

		game.input.mouse.capture = true;


		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		this.deadkey = game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.jumpkey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		game.addPauseButton(game);
	},

	update: function () {
		// Each key changes the players velocity in the x or y direction
		// and plays the proper animation. It sets the prevDir so we can
		// face the correct way when stopped.

		
		//attack on left mouse
		if (game.input.activePointer.leftButton.isDown && this.animation_playing) {
			if (this.prevDir == 'left') {
				this.player.animations.play('attack_left');
				this.animation_playing_attack = false;
			}
			else {
				this.player.animations.play('attack_right');
				this.animation_playing_attack = false;
			}
		}

		// Use the shift key to add running by changing speed and animation
		if (this.shiftKey.isDown && this.animation_playing) {
			this.animation_playing_attack = true;
			if (this.prevDir == 'left') {
				this.player.body.velocity.x = -350;
				this.player.animations.play('run_left');
				this.prevDir = 'left'
			}
			else if (this.prevDir == 'right') {
				this.player.body.velocity.x = 350;
				this.player.animations.play('run_right');
				this.prevDir = 'right'
			}
		}

		// Create a move class or function to clean up code.
		if (this.leftKey.isDown && this.animation_playing ) {			
			this.animation_playing_attack = true;
			this.player.animations.play('walk_left');
			this.player.body.velocity.x = -200;
			this.prevDir = 'left'
		}

		if (this.rightKey.isDown && this.animation_playing ) {		
			this.animation_playing_attack = true;
			this.player.animations.play('walk_right');
			this.player.body.velocity.x = 200;
			this.prevDir = 'right'
		}
		if (this.upKey.isDown && this.animation_playing ) {
			
			this.animation_playing_attack = true;
			if (this.prevDir == 'left') {
				this.player.animations.play('walk_left');
			} else {
				this.player.animations.play('walk_right');
			}
			this.player.body.velocity.y = -200;
		}
		if (this.downKey.isDown && this.animation_playing) {
			
			this.animation_playing_attack = true;
			if (this.prevDir == 'left') {
				this.player.animations.play('walk_left');
			} else {
				this.player.animations.play('walk_right');
			}
			this.player.body.velocity.y = 200;
		}

		if (!this.leftKey.isDown && !this.rightKey.isDown &&
			!this.upKey.isDown && !this.downKey.isDown &&
			!this.spaceBar.isDown && !this.shiftKey.isDown &&
			!game.input.activePointer.leftButton.isDown &&
			!this.deadkey.isDown && this.animation_playing && this.animation_playing_attack) {
			if (this.prevDir == 'left') {
				this.player.animations.play('idle_left');
			} else {
				this.player.animations.play('idle_right');
			}
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
		}

		if (this.leftKey.isDown && this.animation_playing && !this.upKey.isDown ) {
			if(this.prevDir=='left')
		    {
			this.player.animations.play('walk_left');
			}
			this.player.body.velocity.y = 0;
			this.animation_playing_attack = true;	
		}

		if (!this.leftKey.isDown && this.animation_playing && this.upKey.isDown ) {
			if(this.prevDir=='left')
		    {
			this.player.animations.play('walk_left');
			}
			this.player.body.velocity.x = 0;
			this.animation_playing_attack = true;	
		}

		/*if (this.rightKey.isDown && this.animation_playing && !this.upKey.isDown ) {
			if(this.prevDir=='right')
		    {
			this.player.animations.play('walk_right');
			}
			this.player.body.velocity.y = 0;
			this.animation_playing_attack = true;	
		}

		if (!this.rightKey.isDown && this.animation_playing && this.upKey.isDown ) {
			if(this.prevDir=='right')
		    {
			this.player.animations.play('walk_right');
			}
			this.player.body.velocity.x = 0;
			this.animation_playing_attack = true;	
		}*/

		if (this.spaceBar.isDown && this.animation_playing) {
			this.animation_playing_attack = true;
			this.jumpplayer();
			//this.player.animations.play('jump_left');
		}

		//jump and attack on shift left mouse
		if (this.jumpkey.isDown && this.animation_playing) {
			this.animation_playing_attack = true;
			if (this.prevDir == 'left') {
				this.jumpplayer();
                this.player.animations.play('jumpattack_left');
			}
		else {
			    this.jumpplayer();
		     	this.player.animations.play('jumpattack_right');
			}
		}

		//die
		if (this.deadkey.isDown && this.animation_playing) {
			this.animation_playing_attack = true;
			this.player.animations.play('dead');
			this.animation_playing = false;
		}
	},

	render: function () {
		game.debug.bodyInfo(this.player, 16, 24);
		// Instructions:
		game.debug.text("Use arrow keys to move sprite around.", game.width / 2, game.height - 10);
	},

	jumpplayer: function () {
		this.player.body.velocity.y = -250;
		var anims = game.add.tween(this.player.animations);
		anims.to({ x: 0, y: 0 }, 100, Phaser.Easing.Elastic.Out, true);
		anims.start();
		anims.onComplete.add(function () {
			this.player.body.velocity.y = 250;
			anims.stop();
		}, this);
	},
}