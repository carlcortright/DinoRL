
var game = window.dinoGame;
var player = new Player();

// create an environment object
var env = {};
env.getNumStates = function() { return 3; }
env.getMaxNumActions = function() { return 3; }

// create the DQN agent
var spec = { alpha: 0.05, experience_size: 500, epsilon: 0.20}
agent = new RL.DQNAgent(env, spec);

// start the learning loop
previous = 0; // holds the previous obstacle
accum = 0;
setInterval(function(){
  if (!game.started) {
    game.playIntro();
    game.play();
  } else if (game.activated) {
    // Create the feature vector
    s = [0,600, 0];
    if(game.horizon.obstacles.length == 0){
      s[0] = game.currentSpeed;
    } else if (game.horizon.obstacles.length == 1){
      s[0] = game.currentSpeed;
      obst = game.horizon.obstacles[0];
      s[1] = obst.xPos - game.tRex.xPos;
      if(obst.typeConfig.type == "CACTUS_LARGE"){
        s[2] = 1;
      } else if (obst.typeConfig.type == "CACTUS_SMALL") {
        s[2] = 2;
      } else if (obst.typeConfig.type == "PTERODACTYL") {
        s[2] = 3;
      }
    } else if (game.horizon.obstacles.length == 2){
      s[0] = game.currentSpeed;
      firstDist = game.horizon.obstacles[0].xPos - game.tRex.xPos;
      secondDist = game.horizon.obstacles[1].xPos - game.tRex.xPos;
      obst = (firstDist > 0 ? game.horizon.obstacles[0] : game.horizon.obstacles[1]);
      s[1] = obst.xPos - game.tRex.xPos;
      if(obst.typeConfig.type == "CACTUS_LARGE"){
        s[2] = 1;
      } else if (obst.typeConfig.type == "CACTUS_SMALL") {
        s[2] = 2;
      } else if (obst.typeConfig.type == "PTERODACTYL") {
        s[2] = 3;
      }
    } else if (game.horizon.obstacles.length >= 3){
      s[0] = game.currentSpeed;
      firstDist = game.horizon.obstacles[0].xPos - game.tRex.xPos;
      secondDist = game.horizon.obstacles[1].xPos - game.tRex.xPos;
      thirdDist = game.horizon.obstacles[2].xPos - game.tRex.xPos;
      obst = (firstDist > 0 ? game.horizon.obstacles[0] : (secondDist > 0 ? game.horizon.obstacles[1] : game.horizon.obstacles[2]));
      s[1] = obst.xPos - game.tRex.xPos;
      if(obst.typeConfig.type == "CACTUS_LARGE"){
        s[2] = 1;
      } else if (obst.typeConfig.type == "CACTUS_SMALL") {
        s[2] = 2;
      } else if (obst.typeConfig.type == "PTERODACTYL") {
        s[2] = 3;
      }
    }

    var action = agent.act(s); // s is an array of length 10

    // Take the action chosen by the agent
    if(action == 0){
      player.do(Player.actions.IDLE);
      document.getElementById("action").innerHTML = "Idle";
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
    temp = 0;
    reward = -10;
    agent.learn(reward);
    accum = reward;
    document.getElementById("reward").innerHTML = accum.toString();
    game.restart();
  }

  localStorage.setItem("agent", JSON.stringify(agent));
}, 100);

// Reward loop, rewards the agent when it is above/below an obstacle
setInterval(function(){
  if(typeof game.horizon.obstacles[0] != 'undefined'){
    if(game.tRex.xPos > game.horizon.obstacles[0].xPos && game.tRex.xPos < game.horizon.obstacles[0].xPos + game.horizon.obstacles[0].width ){
      reward = 1;
      agent.learn(reward);
      if(accum === -10){
        accum = 0;
      }
      accum += reward;
      document.getElementById("reward").innerHTML = accum.toString();
    }
  }
  if(typeof game.horizon.obstacles[1] != 'undefined'){
    if(game.tRex.xPos > game.horizon.obstacles[1].xPos && game.tRex.xPos < game.horizon.obstacles[1].xPos + game.horizon.obstacles[1].width ){
      reward = 1;
      agent.learn(reward);
      if(accum === -10){
        accum = 0;
      }
      accum += reward;
      document.getElementById("reward").innerHTML = accum.toString();
    }
  }
  if(typeof game.horizon.obstacles[2] != 'undefined'){
    if(game.tRex.xPos > game.horizon.obstacles[2].xPos && game.tRex.xPos < game.horizon.obstacles[2].xPos + game.horizon.obstacles[2].width ){
      reward = 1;
      agent.learn(reward);
      if(accum === -10){
        accum = 0;
      }
      accum += reward;
      document.getElementById("reward").innerHTML = accum.toString();
    }
  }
}, 10);
