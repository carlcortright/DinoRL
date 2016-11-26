
var game = window.dinoGame;
var player = new Player();

// create an environment object
var env = {};
env.getNumStates = function() { return 8; }
env.getMaxNumActions = function() { return 4; }

// create the DQN agent
var spec = { alpha: 0.01 } // see full options on DQN page
agent = new RL.DQNAgent(env, spec);

setInterval(function(){ // start the learning loop

  if (!game.started) {
    game.playIntro();
    game.play();
  } else if (game.activated) {

    player.do(Player.actions.JUMP);

    console.log(game.horizon.obstacles);


  } else {
    game.restart();
  }

  // var action = agent.act(s); // s is an array of length 8
  // //... execute action in environment and get the reward
  // agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float



}, 500);
