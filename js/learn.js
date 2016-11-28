
var game = window.dinoGame;
var player = new Player();

// create an environment object
var env = {};
env.getNumStates = function() { return 10; }
env.getMaxNumActions = function() { return 3; }

// create the DQN agent
var spec = { alpha: 0.05, experience_size: 25, epsilon: 0.20}
agent = new RL.DQNAgent(env, spec);

// start the learning loop
previous = 0; // holds the previous obstacle
setInterval(function(){
  if (!game.started) {
    game.playIntro();
    game.play();
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

    // Reward the agent if it passes an obstacle successfully
    if(typeof game.horizon.obstacles[0] != 'undefined'){
      if(game.horizon.obstacles[0].ident != previous){
        reward = 1;
        agent.learn(reward);
        console.log("Reward!")
        previous = game.horizon.obstacles[0].ident;
      }
    }

    // Decrement epsilon slowly
    if(agent.epsilon > 0.01){
      agent.epsilon = agent.epsilon - 0.0000025;
    }

  } else {
    temp = 0;
    reward = -1;
    agent.learn(reward);
    console.log("Punishment!");
    game.playIntro();
    game.restart();
  }

  localStorage.setItem("agent", JSON.stringify(agent));
}, 200);
