var destroyer = {
	create: function () {
		console.log("play.js");

		this.gameover=false;
		this.flag=false;
		game.globals.health=100;
		game.globals.health1=100;
		//Client.sendNewPlayerRequest();
		
		//two players
		this.player = new Ufo(game);
		this.player1 = new Ufo1(game);

		w = game.width // Game width and height for convenience
		h = game.height
		frame_counter = 0 // variable to help with the creation of obstacles

		//used for score points right now
		this.item_destroyed = false;
		this.item_destroyed1 = false;

		//The scrolling starfield background
		this.starfield = game.add.tileSprite(0, 0, w, h, 'starfield');

		this.earth = game.add.sprite(0, 0, 'earth');

		// add two reticle buttons on left and right side to fire bullets
		this.buton = game.add.button(game.world.centerX - 405, 400, 'button', this.actionOnClick, this, 2, 1, 0);
        this.buton = game.add.button(game.world.centerX+250, 400, 'button', this.actionOnClick1, this, 2, 1, 0);
		
		this.earth.animations.add('spin', 0, 48);
		this.earth.animations.play('spin', 10, true);

		// Score sound
		this.sound.score = game.add.audio('score')
		this.sound.score.volume = .4
		
		// explosion group to add new explosion to the ship
		this.explosionGroup = this.game.add.group();

		// Death sound
		this.sound.kill = game.add.audio('kill')

		// Music
		this.music = game.add.audio('music')
		this.music.play('', 0, 0.5, true)

		this.physics.startSystem(Phaser.Physics.ARCADE)

		// Obstacles (little icons of food)
		this.obstacles = game.add.group()

		// An explosion pool that gets attached to each icon
		this.explosions = game.add.group();
		this.explosions.createMultiple(10, 'kaboom');
		this.explosions.forEach(this.setupObstacles, this);

		// Player
		// calls the create method of the two ufo objects
		this.player.create(randomInt(0,game.width), randomInt(0,game.height/2), 0.75, 0.75); 
		this.player1.create(randomInt(0,game.width), randomInt(0,game.height/2), 0.75, 0.75); 

		// Score label for player1
		this.bmpText = game.add.bitmapText(750, 100, 'fontUsed', '', 150);
		this.bmpText.anchor.setTo(.5, .5)
		this.bmpText.scale.setTo(.3, .3)
		
		// Score label for player2
		this.bmpTextl = game.add.bitmapText(50, 100, 'fontUsed', '', 150);
		this.bmpTextl.anchor.setTo(.5, .5)
		this.bmpTextl.scale.setTo(.3, .3)

		// health label for player1
		this.bmpText1 = game.add.bitmapText(750, 140, 'fontUsed', '', 150);
		this.bmpText1.anchor.setTo(.5, .5)
		this.bmpText1.scale.setTo(.3, .3)

		// health label for player2
		this.bmpText1l = game.add.bitmapText(50, 140, 'fontUsed', '', 150);
		this.bmpText1l.anchor.setTo(.5, .5)
		this.bmpText1l.scale.setTo(.3, .3)

		///// Tracking keyboard inputs /////////////

		// Fire the ufo big laser when the 'X' key is pressed
		laserFire = this.input.keyboard.addKey(Phaser.Keyboard.X);
		laserFire.onDown.add(this.player.startLaser, this.player);

		// Assigns arrow keys for movement for player1
		this.player.assignMovementKeys(38, 40, 37, 39);

		// Assigns W,S,A,D keys for movement for player2
		this.player1.assignMovementKeys(Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D);
		this.player.assignFireKeys(Phaser.KeyCode.SPACEBAR);
		this.player1.assignFireKeys(Phaser.Keyboard.SHIFT);

        // Place health on game screen
		this.bmpText1.text = game.globals.health;
		this.bmpText1l.text = game.globals.health1;
    
		this.pauseAndUnpause(game)

	},

	actionOnClick: function () {
		this.player1.fireBullets();		    
	},
	actionOnClick1: function () {
		this.player.fireBullets();		    
	},
	

	update: function () {

		//if (game.num_other_players > 0) {
			if(this.gameover)
			return

			// Place score on game screen
			this.bmpText.text = game.globals.score
			this.bmpTextl.text = game.globals.score1
			
			// Move background to look like space is moving
			this.starfield.tilePosition.y -= 2;

			// Check for overlap between game ship and obstacles for both the players
			game.physics.arcade.overlap(this.player.ship, this.obstacles, this.killPlayer, null, this)
			game.physics.arcade.overlap(this.player1.ship, this.obstacles, this.killPlayer1, null, this)


			// Check for overlap between bullets and obstacles for both the players
			game.physics.arcade.overlap(this.player.bullets, this.obstacles, this.destroyItem, null, this);
            game.physics.arcade.overlap(this.player1.bullets, this.obstacles, this.destroyItem1, null, this);

			if (this.item_destroyed) {
				// Check to see if we score any points
				// needs changed since we added bullets
				game.globals.score += this.scorePoint();
				this.item_destroyed = false;
			}
			if (this.item_destroyed1) {
				// Check to see if we score any points
				// needs changed since we added bullets
				game.globals.score1 += this.scorePoint();
				this.item_destroyed1 = false;
			}


			spawn_rate = 100 - game.globals.score; // how fast to add new obstacles to screen (smaller value = more obstacles)
			obstacle_speed = game.globals.score * 1.5 + 200; // how fast should each obstacle move

			// Spawn rate continuously shrinks so stop it at 5
			if (spawn_rate < 5) {
				spawn_rate = 5;
			}

			// Spawn obstacles
			if (frame_counter % spawn_rate == 0) {
				//console.log(spawn_rate);
				//console.log(obstacle_speed);
				this.spawnObstacle(game.rnd.integerInRange(32, game.width - 32), game.height, speed = obstacle_speed, 0.5, 0.5)
			}
		
			// decrease the health of player on higher collision with the other player
			if(this.player.xRate>this.player1.xRate || this.player.yRate>this.player1.yRate  )
			{ 
				game.physics.arcade.overlap(this.player1.ship,this.player.ship, this.bumpcollide, null, this);
			}
			else if(this.player1.xRate>this.player.xRate || this.player1.yRate>this.player.yRate  )
			{
				game.physics.arcade.overlap(this.player.ship,this.player1.ship, this.bump, null, this);
			}			   
		    this.player.move();
		    this.player1.move();
			
			frame_counter++;
		//}
	},

	
	bumpcollide: function (player1,player){
	    // on collide with the other player decrease the health
		game.globals.health1 -= 5;
		// show health on the screen
		this.bmpText1l.text = game.globals.health1;
		// when health is zero explode the ship
		if(game.globals.health1==0)
		{
			this.getExplosion(player1.x, player1.y);
			player1.kill();
		    this.gameover=true;
		}
		// bump two ships from each other in certain velocity
		player.body.velocity.x = 650;
		player1.body.velocity.x = -650;
		var anims = game.add.tween(player.animations);
		anims.to({ x: 0, y: 0 }, 100, Phaser.Easing.Elastic.Out, true);
		anims.start();
		anims.onComplete.add(function () {
			player.body.velocity.y = 0;
			player.body.velocity.x = 0;
			player1.body.velocity.y = 0;
			player1.body.velocity.x = 0;
			anims.stop();
		}, this);
	},

	bump: function (player,player1){
        // on collide with the other player decrease the health
		game.globals.health -= 5;
		// show health on the screen
		this.bmpText1.text = game.globals.health;
		// when health is zero explode the ship
		if(game.globals.health==0)
		{
			this.getExplosion(player.x, player.y);
			player.kill();
		    this.gameover=true;
		}	
		// bump two ships from each other in certain velocity
		player.body.velocity.x = 650;
		player1.body.velocity.x = -650;
		var anims = game.add.tween(player.animations);
		anims.to({ x: 0, y: 0 }, 100, Phaser.Easing.Elastic.Out, true);
		anims.start();
		anims.onComplete.add(function () {
			player.body.velocity.y = 0;
			player.body.velocity.x = 0;
			player1.body.velocity.y = 0;
			player1.body.velocity.x = 0;
			anims.stop();
		}, this);
	},

	/**
	 * Spawn New Player
	 */
	spawnNewPlayer: function (player) {
		game.players.push(new Ufo(game));
		game.players[game.players.length-1].create(player.x,player.y,0.75,0.75);
	},

	/**
	 * spawn a new obstacle
	 * 
	 * @param x : x coord
	 * @param y : y coord
	 * @param speed : speed to move across game board
	 */
	spawnObstacle: function (x, y, speed, x_scale, y_scale) {
		// randomly choose an icon from an array of icon names
		var choice = game.rnd.integerInRange(0, game.globals.obstacle_icons.length - 1);
		var name = game.globals.obstacle_icons[choice];
		if(name.includes('earth'))
		{ 
			// add animation for three planets
			var obstacle = game.add.sprite(x, y, name);
		    obstacle.animations.add('spin', 0, 48);
			obstacle.animations.play('spin', 10, true);
			this.obstacles.add(obstacle);
		}
		else
		{
		//create the obstacle with its randomly chosen name
		var obstacle = this.obstacles.create(x, y, 'icon-'+name)
		game.debug.body(obstacle);
		}
	
		game.physics.enable(obstacle, Phaser.Physics.ARCADE)

		obstacle.enableBody = true
		obstacle.body.colliderWorldBounds = true
		obstacle.body.immovable = true
		obstacle.anchor.setTo(.5, .5)
		obstacle.scale.setTo(x_scale, y_scale)
		obstacle.body.setSize(obstacle.width + 20, obstacle.height - 20);
		obstacle.body.velocity.y = -speed

		obstacle.checkWorldBounds = true;

		// Kill obstacle/enemy if vertically out of bounds
		obstacle.events.onOutOfBounds.add(this.killObstacle, this);

		obstacle.outOfBoundsKill = true;
	},

	/**
	 * removes an obstacle from its group
	 */
	killObstacle: function (obstacle) {
		this.obstacles.remove(obstacle);
	},

	/**
	 * Adds an explosion animation to each obstacle when created
	 */
	setupObstacles: function (obstacle) {
		obstacle.anchor.x = 0.5;
		obstacle.anchor.y = 0.5;
		obstacle.animations.add('kaboom');
	},

	/**
	 * Determines score. Needs changed
	 */
	scorePoint: function () {
		// silly but wanted a function in case points started
		// to change based on logic.
		return 1;
	},

	getExplosion: function(x, y) {
		// Get the first dead explosion from the explosionGroup
		var explosion = this.explosionGroup.getFirstDead();
		// If there aren't any available, create a new one
		if (explosion === null) {
			explosion = this.game.add.sprite(x,y, 'shipexp');
			explosion.anchor.setTo(0.5, 0.5);
			var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 20, false);
			//animation.killOnComplete = true;
			// Add the explosion sprite to the group
			this.explosionGroup.add(explosion);
		}	
		explosion.animations.play('boom');
	},

	/**
	 * Kills player. Things commented out for debugging.
	 */
	killPlayer: function (player) {
		//issues with this
		//game.plugins.screenShake.shake(20);
		//decrease the health of the player on hit with obstacle
		game.globals.health=game.globals.health-5;
		//show health on screen
		this.bmpText1.text = game.globals.health;
		this.sound.kill.play('', 0, 0.5, false);
		// when health is zero explode the ship
		if(game.globals.health==0)
		{
			this.getExplosion(player.x, player.y);
			player.kill();
		    this.gameover=true;
		}	
	},
	killPlayer1: function (player) {
		//issues with this
		//game.plugins.screenShake.shake(20);
		//decrease the health of the player on hit with obstacle
		game.globals.health1=game.globals.health1-5;
		//show health on screen
		this.bmpText1l.text = game.globals.health1;
		this.sound.kill.play('', 0, 0.5, false);
		// when health is zero explode the ship
		if(game.globals.health1==0)
		{
			this.getExplosion(player.x, player.y);
			player.kill();
		    this.gameover=true;
		}	
	},
	/**
	 * Source: https://phaser.io/examples/v2/games/invaders
	 * 
	 * Collision handler for a bullet and obstacle
	 */
	destroyItem: function (bullet, obstacle) {
		bullet.kill();
		obstacle.kill();
		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(obstacle.body.x, obstacle.body.y);
		explosion.play('kaboom', 30, false, true);
		this.item_destroyed = true;
	},
	destroyItem1: function (bullet, obstacle) {
		bullet.kill();
		obstacle.kill();
		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(obstacle.body.x, obstacle.body.y);
		explosion.play('kaboom', 30, false, true);
		this.item_destroyed1 = true;
	},

	/**
	 * Tap on touchscreen or click with mouse
	 * not used for this game
	 */
	onDown: function (pointer) {
		//console.log(pointer);
	},

	/**
	 * This method lets a user pause the game by pushing the pause button in
	 * the top right of the screen. 
	 */
	pauseAndUnpause: function (game) {
		var pause_button = game.add.sprite(game.width - 40, 40, 'pause')
		pause_button.anchor.setTo(.5, .5)
		pause_button.inputEnabled = true
		// pause:
		pause_button.events.onInputUp.add(
			function () {
				if (!game.paused) {
					game.paused = true
				}
				pause_watermark = game.add.sprite(game.width / 2, game.height / 2, 'pause')
				pause_watermark.anchor.setTo(.5, .5)
				pause_watermark.alpha = .1
			}, this)
		// Unpause:
		game.input.onDown.add(
			function () {
				if (game.paused) {
					game.paused = false
					pause_watermark.destroy()
				}
			}, self)
	}
}