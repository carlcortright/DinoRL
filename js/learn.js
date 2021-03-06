var game = window.dinoGame;
var player = new Player();

// create an environment object
var env = {};
env.getNumStates = function() { return 6; }
env.getMaxNumActions = function() { return 3; }

// create the DQN agent
var spec = { alpha: 0.005, experience_size: 100, epsilon: 0.20, num_hidden_units: 1000}
agent = new RL.DQNAgent(env, spec);

// Variables for graph
successfulJumpsSinceAvg = 0;
trialsSinceLastAvg = 0;
trial = 0;
jumped = false;

/*
* Starts the Learning Loop
*/
setInterval(function(){
  if (!game.started) {
    game.playIntro();
    game.play();
  } else if (game.activated) {
    // Create the feature vector
    s = [0, 0, 600, 0, 0, 0];
    if(game.horizon.obstacles.length == 0){
      s[0] = game.currentSpeed;
      s[1] = 93 - game.tRex.yPos; // Game default is 93
    } else if (game.horizon.obstacles.length > 0 && game.tRex.xPos < game.horizon.obstacles[0].xPos + game.horizon.obstacles[0].width){
      // If there is an obstacle, log it's distance.
      s[0] = game.currentSpeed;
      s[1] = 93 - game.tRex.yPos; // Game default is 93
      obst = game.horizon.obstacles[0];
      s[2] = obst.xPos - game.tRex.xPos;
      s[3] = obst.typeConfig.height;
      s[4] = obst.typeConfig.width;
      if(obst.typeConfig.type == "CACTUS_LARGE"){
        s[5] = 1;
      } else if (obst.typeConfig.type == "CACTUS_SMALL") {
        s[5] = 2;
      } else if (obst.typeConfig.type == "PTERODACTYL") {
        s[5] = 3;
      }
    } else if (game.horizon.obstacles.length > 1 && game.tRex.xPos > game.horizon.obstacles[0].xPos){
      // There's more than one obstacle, and we've passed the first already
      console.log("Passed First");
      s[0] = game.currentSpeed;
      s[1] = 93 - game.tRex.yPos; // Game default is 93
      obst = game.horizon.obstacles[1];
      s[2] = obst.xPos - game.tRex.xPos;
      s[3] = obst.typeConfig.height;
      s[4] = obst.typeConfig.width;
      if(obst.typeConfig.type == "CACTUS_LARGE"){
        s[5] = 1;
      } else if (obst.typeConfig.type == "CACTUS_SMALL") {
        s[5] = 2;
      } else if (obst.typeConfig.type == "PTERODACTYL") {
        s[5] = 3;
      }
    }

    var action = agent.act(s); // s is an array of length 5

    // Take the action chosen by the agent
    if(action == 0){
      player.do(Player.actions.IDLE);
      document.getElementById("action").innerHTML = "Idle";
      agent.learn(3);
    } else if(action == 1){
      player.do(Player.actions.JUMP);
      document.getElementById("action").innerHTML = "Jump";
    } else if (action == 2) {
      player.do(Player.actions.DUCK);
      document.getElementById("action").innerHTML = "Duck";
    }

    // Decrement epsilon slowly
    if(agent.epsilon > 0.01){
      agent.epsilon = agent.epsilon - 0.0000025;
    }

  } else {
    // Punish for dying
    agent.learn(-25);

    // Updates the google chart to display performance
    trial += 1;
    trialsSinceLastAvg += 1;
    if(trialsSinceLastAvg/50 == 1){
      avg = successfulJumpsSinceAvg / 50;
      updateChart([trial, avg]);
      successfulJumpsSinceAvg = 0;
      trialsSinceLastAvg = 0;
    }

    // Restart the game automatically
    game.restart();
  }

  localStorage.setItem("agent", JSON.stringify(agent));
}, 150);

// Reward loop, rewards the agent when it is above/below an obstacle
setInterval(function(){
  if(typeof game.horizon.obstacles[0] != 'undefined'){
    if(game.tRex.xPos > game.horizon.obstacles[0].xPos + game.horizon.obstacles[0].width && jumped === false) {
      agent.learn(50);
      jumped = true;
      successfulJumpsSinceAvg += 1;
    } else if(game.tRex.xPos < game.horizon.obstacles[0].xPos + game.horizon.obstacles[0].width) {
      jumped = false;
    }
  }
}, 10);
