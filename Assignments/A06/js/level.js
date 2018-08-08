/**
 * 
 * @param {object} game | phaser game object
 * @param {string} map_key | cache name
 * @param {string} map_path | path to json for tilemap
 * @param {string} mini_map_path | path to mini map image
 */
var Level = function (game, map_key,map_path,mini_map_path,collision_index) {
    this.game = game;
    this.map_key = map_key;
    this.map_path = map_path;
    this.mini_map_path = mini_map_path;
    this.mini_map_key = this.map_key+'_mini';
    this.map_collision_index = collision_index;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// PRELOAD ////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.preload = function () {

    this.portalOverFlag = false;
    this.transport = false;

    this.mapjson = this.game.global.levels[this.map_key];

    this.mh = new MapHelper(game, this.map_key, this.map_path,this.map_collision_index);

    this.mh.preload();

    game.load.image(this.mini_map_key, this.mini_map_path);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.create = function () {
    
    //set the player location on each level
    if(game.global.current_level=="level_03")
    {
      this.player = new Player(game, 1728, 1024, 'knight_atlas');
    }
    else if(game.global.current_level=="level_02")
    {
      this.player = new Player(game, 1568, 1760, 'knight_atlas');
    }
    else if(game.global.current_level=="level_05")
    {
       this.player=new Player(game,488,270,'knight_atlas');
    }
    else
    {
      this.player = new Player(game, game.camera.width / 2, game.camera.height / 2, 'knight_atlas');
    } 

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.mh.create();

    this.mh.addCollisionLayer('layer_collision');

    this.mh.resizeWorld('layer_0_floor');
    var max=3400;
    var min=30;
    this.apples = game.add.group();
    this.apples.enableBody = true;
    
    // adds apples to the tile sheet distributed randomnly
    for(i=0;i<=50;i++)
	{ 
        var ex=Math.floor(Math.random() * (max - min) ) + min;
        var ey=Math.floor(Math.random() * (max - min) ) + min;
        if(this.mh.getTilePropertiescoll('layer_collision',ex,ey)==null)
        {   
			var apple = game.add.sprite(ex,ey, 'apple');
		    apple.animations.add('rotate', Phaser.Animation.generateFrameNames('apple', 3, 4), 3, true);
            apple.animations.play('rotate');
            game.physics.arcade.enable(apple);
            this.apples.add(apple);
       }
    }
    //turn on physics
    game.physics.arcade.enable(this.apples);
    
    //heads up displpay 
    this.hud = new Hud(game, 100, 200);
    this.hud.addTitle();
    this.hud.trackValue(this.player.alias, "health");
    this.hud.trackValue(this.player.alias, "coins");
    
    //mini map
    this.mini_map = new MiniMap(game, 200, 200, 4096, 4096, this.mini_map_key, 'upper_right');
    var x,y,l,m,p3x,p3y,p4x,p4y,p5x,p5y,bx,by,sx,sy;
    game.camera.follow(this.player.alias);
    
    //to assign portal positions in each level
    if(game.global.current_level=="level_01")
    {
      x=game.camera.width / 2 + 100;
      y= game.camera.height / 2 + 100;
      l=2825;
      m=2642;
      p3x=457;
      p3y=1483;
      p4x=506;
      p4y=3873;
      p5x=1962;
      p5y=3781;
      bx=-100;
      by=-100;
      sx=-3780;
      sy=-210;
    }
    if(game.global.current_level=="level_02"){
        x=game.camera.width / 2 + 100;
        y= game.camera.height / 2 + 100; 
        l=358;
        m=3613;
        p3x=1249;
        p3y=3825;
        p4x=3304;
        p4y=867;
        p5x=2359;
        p5y=3570;
        bx=225;
        by=2752;
        sx=-3780;
        sy=-210;
    } 
    if(game.global.current_level=="level_03"){
        x = 18
        y = 1568;
        l = 4039;
        m = 1408;
        p3x=874;
        p3y=2680;
        p4x=3141;
        p4y=2848;
        bx=1730;
        by=1123;
        sx=-3780;
        sy=-210;
    } 
    if(game.global.current_level=="level_04"){
        x= 1008;
        y= 314;
        l=2833;
        m=1903;
        p3x=308;
        p3y=2201;
        bx=game.camera.width / 2 + 250;
        by=game.camera.height / 2 + 550;
        sx=-3780;
        sy=-210;
    } 
    if(game.global.current_level=="level_05"){
        x=-game.camera.width / 2 + 100;
        y=-game.camera.height / 2 + 100;
        l=-1528;
        m=- 446;
        sx=3780;
        sy=210;
        bx=891;
        by=468;
    } 

    //creates portals on the tile map
    this.backportal= game.add.sprite(bx, by, 'blue_portal');
    this.backportal.animations.add('rotate', Phaser.Animation.generateFrameNames('portal', 1, 3), 60, true);
    this.backportal.animations.play('rotate');

    this.santaportal= game.add.sprite(sx, sy, 'santa');
    this.santaportal.animations.add('rotate', Phaser.Animation.generateFrameNames('santa', 1, 4), 6, true);
    this.santaportal.animations.play('rotate');

    this.portal2 = game.add.sprite(p3x, p3y, 'red_portal');
    this.portal2.animations.add('rotate', Phaser.Animation.generateFrameNames('new_portal', 1, 4), 30, true);
    this.portal2.animations.play('rotate');
    
    // set the anchor for sprite to middle of the view
    this.portal2.anchor.setTo(0.5);
       // turn physics on for everyone
    game.physics.enable([this.player.alias, this.portal2], Phaser.Physics.ARCADE);

    this.portal = game.add.sprite(x, y, 'red_portal');
    this.portal.animations.add('rotate', Phaser.Animation.generateFrameNames('new_portal', 1, 4), 30, true);
    this.portal.animations.play('rotate');
    
    // set the anchor for sprite to middle of the view
    this.portal.anchor.setTo(0.5);
    // turn physics on for everyone
    game.physics.enable([this.player.alias, this.portal], Phaser.Physics.ARCADE);

    this.portal1 = game.add.sprite(l,m, 'red_portal');
    this.portal1.animations.add('rotate', Phaser.Animation.generateFrameNames('new_portal', 1, 4), 30, true);
    this.portal1.animations.play('rotate');
    // set the anchor for sprite to middle of the view
    this.portal1.anchor.setTo(0.5);  
    //
    game.physics.enable([this.player.alias, this.portal1], Phaser.Physics.ARCADE);

    this.portal3 = game.add.sprite(p4x,p4y, 'red_portal');
    this.portal3.animations.add('rotate', Phaser.Animation.generateFrameNames('new_portal', 1, 4), 30, true);
    this.portal3.animations.play('rotate');
    // set the anchor for sprite to middle of the view
    this.portal3.anchor.setTo(0.5);  
    //
    game.physics.enable([this.player.alias, this.portal3], Phaser.Physics.ARCADE);

    this.portal4 = game.add.sprite(p5x,p5y, 'red_portal');
    this.portal4.animations.add('rotate', Phaser.Animation.generateFrameNames('new_portal', 1, 4),30, true);
    this.portal4.animations.play('rotate');
    // set the anchor for sprite to middle of the view
    this.portal4.anchor.setTo(0.5);  

    game.physics.enable([this.player.alias, this.portal4], Phaser.Physics.ARCADE);
    //game.physics.enable([this.player.alias, this.apples], Phaser.Physics.ARCADE);

    // Makes sure player sprite is in front of the map.
    this.player.bringToFront();

    // Spawn ghosts when level loads
    this.ghosts = new Ghosts(game, 1, this.player.x, this.player.y);

    game.physics.enable([this.player.alias, this.ghosts], Phaser.Physics.ARCADE);

    // Track the ghosts on the mini map
    for (i = 0; i < this.ghosts.ghosts.length; i++) {
        this.mini_map.trackEnemy(this.ghosts.ghosts[i]);
    }

    console.log(this.player.alias);

}

//decreases health on collision with the monster
Level.prototype.decreasehealth = function (){
    this.player.alias.health-=1;
}

//collects apple on collision with the player
Level.prototype.collectApple = function (player,apple){
            apple.kill();     
            game.global.score = game.global.score+10;
            this.player.alias.coins = game.global.score;
}
Level.prototype.over = function (){
    game.world.removeAll();
    this.background = game.add.tileSprite(3114,32, game.width, game.height, 'gameOver');
} 
///////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.update = function () {
    
    // keeps hud in upper left of the screen 
    this.hud.displayHud()
    
    // spawn enemies on three different locations in tile map
    if(this.player.alias.x>=654 && this.player.alias.x<=657)
    {
        this.ghosts.spawnGhosts(1,this.player.alias.x,this.player.alias.y);
    }
    if(this.player.alias.x>=1402 && this.player.alias.x<=1403)
    {
        this.ghosts.spawnGhosts(1,this.player.alias.x,this.player.alias.y);
    }
    if(this.player.alias.x>=1150 && this.player.alias.x<=1152)
    {
        this.ghosts.spawnGhosts(1,this.player.alias.x,this.player.alias.y);
    }

    // keeps map updated in top right of the screen
    this.mini_map.updatePlayerLocation(this.player.alias);

    // lets you control your player
    this.player.move();
    console.log(this.player.alias)

   this.ghosts.moveGhosts(this.player.alias);

   for (i = 0; i < this.ghosts.ghosts.length; i++) {
        //check ghosts collide
       game.physics.arcade.collide(this.ghosts.ghosts[i],this.player.alias,this.decreasehealth,null,this);
   }   

   //check apples overlap with player
    game.physics.arcade.overlap(this.player.alias, this.apples,this.collectApple, null, this);

    var portls=[this.portal,this.portal1,this.portal2,this.portal3,this.portal4];

    //obvious finish portal
    if (this.player.intersectsWith(this.santaportal)) {
         this.over();
    } 
          
    // checks if player intersects with a portal
    // hard coded destination. Needs improved
  
    //check for portal intersection with the player takes to the next level
    for(var i=0;i<portls.length;i++)
    {
        if (this.player.intersectsWith(portls[i])) {
            if(game.global.current_level=="level_01")
            { 
                 game.global.current_level="level_02";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_02")
            { 
                //this.player.transportPlayer(1568, 1760);
                 game.global.current_level="level_03";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_03")
            { 
                 game.global.current_level="level_04";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_04")
            { 
                 game.global.current_level="level_05";
                 game.state.start(game.global.current_level);
            }
        }
    }

    // check for portal intersection with the player takes to the previous level
        if (this.player.intersectsWith(this.backportal)) {
            if(game.global.current_level=="level_02")
            { 
                 game.global.current_level="level_01";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_03")
            { 
                 game.global.current_level="level_02";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_04")
            { 
                 game.global.current_level="level_03";
                 game.state.start(game.global.current_level);
            }
            else if(game.global.current_level=="level_05")
            { 
                 game.global.current_level="level_04";
                 game.state.start(game.global.current_level);
            }
        }


    // Necessary to make sure we always check player colliding with objects
    game.physics.arcade.collide(this.player.alias, this.mh.collisionLayer);

}

///////////////////////////////////////////////////////////////////////////////////////////////////
// RENDER /////////////////////////////////////////////////////////////////////////////////////////
Level.prototype.render = function () {
    //game.debug.bodyInfo(this.player, 16, 24);
    // Instructions:
    //game.debug.text("And here is our new level!", game.width / 2, game.height - 10);
}