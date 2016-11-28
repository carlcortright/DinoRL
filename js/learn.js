
var game = window.dinoGame;
var player = new Player();

// create an environment object
var env = {};
env.getNumStates = function() { return 10; }
env.getMaxNumActions = function() { return 3; }

// create the DQN agent
var spec = { alpha: 0.05, experience_size: 5000} // see full options on DQN page
agent = new RL.DQNAgent(env, spec);

temp = 0;

setInterval(function(){ // start the learning loop
  if (!game.started) {
    game.playIntro();
    game.play();
    temp = 0;
  } else if (game.activated) {
    // Create the feature vector
    s = [0,0,0,0,0,0,0,0,0,0];
    if(game.horizon.obstacles.length == 0){
      s[0] = game.currentSpeed;
    } else if (game.horizon.obstacles.length == 1){
      s[0] = game.currentSpeed;
      s[1] = game.horizon.obstacles[0].xPos - game.horizon.obstacles[0].spritePos.x;
      s[2] = game.horizon.obstacles[0].yPos;
      s[3] = game.horizon.obstacles[0].width;
    } else if (game.horizon.obstacles.length == 2){
      s[0] = game.currentSpeed;
      s[1] = game.horizon.obstacles[0].xPos - game.horizon.obstacles[0].spritePos.x;
      s[2] = game.horizon.obstacles[0].yPos;
      s[3] = game.horizon.obstacles[0].width;
      s[4] = game.horizon.obstacles[1].xPos - game.horizon.obstacles[1].spritePos.x;
      s[5] = game.horizon.obstacles[1].yPos;
      s[6] = game.horizon.obstacles[1].width;
    } else if (game.horizon.obstacles.length >= 3){
      s[0] = game.currentSpeed;
      s[1] = game.horizon.obstacles[0].xPos - game.horizon.obstacles[0].spritePos.x;
      s[2] = game.horizon.obstacles[0].yPos;
      s[3] = game.horizon.obstacles[0].width;
      s[4] = game.horizon.obstacles[1].xPos - game.horizon.obstacles[1].spritePos.x;
      s[5] = game.horizon.obstacles[1].yPos;
      s[6] = game.horizon.obstacles[1].width;
      s[7] = game.horizon.obstacles[2].xPos - game.horizon.obstacles[2].spritePos.x;
      s[8] = game.horizon.obstacles[2].yPos;
      s[9] = game.horizon.obstacles[2].width;
    }

    var action = agent.act(s); // s is an array of length 10


    // Take the action chosen by the agent
    if(action == 0){
      player.do(Player.actions.IDLE);
    } else if(action == 1){
      player.do(Player.actions.JUMP);
    } else if (action == 2) {
      player.do(Player.actions.DUCK);
    }


    if(typeof game.horizon.obstacles[0] != 'undefined'){
      if(game.horizon.obstacles[0].ident != temp){
        reward = 100;
        agent.learn(reward);
        temp = game.horizon.obstacles[0].ident;
        console.log(reward);
      }
    }


  } else {
    reward = -100;
    agent.learn(reward);
    console.log(reward);
    game.restart();
  }

}, 100);
