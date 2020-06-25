const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)
console.log("JG Version 3");
app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  console.log("event=requestIndex");
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#FF0000',
    head: 'smile',
    tail: 'bolt'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body
  console.log("event=handleStart gameData=");
  console.log(gameData);

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body
  console.log("event=handleMove gameData=");
  console.dir(gameData,{depth:null});

  let targetCoords = searchClosestFood(gameData);
  if (targetCoords === null) {
    targetCoords = {
      x: Math.ceil(gameData.board.width / 2) - 1,
      y: Math.ceil(gameData.board.height / 2) - 1
    }
  }

  const directionPriority = getDirectionPriority(targetCoords, gameData)
  let move = 'left'; //because why not

  for (let i = 0; i < directionPriority.length; i++) {
    const directionName = directionPriority[i]
    const destinationCoords = getCoordsFromDirection(directionName, gameData.you.head)
    if (isSafeDestination(destinationCoords, gameData)) {
      move = directionName
      break
    } else {
      console.log("event=handleMove badDirection=" + directionName)
    }
  }
  console.log("event=handleMove move=" + move)
  response.status(200).send({
    move: move
  })
}

function getDirectionPriority(targetCoords, gameData) {
  console.log("event=getDirectionPriority targetCoords=" + coordsToString(targetCoords))
  const headCoords = gameData.you.head
  let resultOrder = [];
  
  const usedDirections = {
    up: false,
    right: false,
    down: false,
    left: false
  }

  if (targetCoords.x < headCoords.x) {
    resultOrder.push('left');
    usedDirections.left = true;
  } else if (targetCoords.x > headCoords.x) {
    resultOrder.push('right');
    usedDirections.right = true;
  } //we ignore an equals

  if (targetCoords.y < headCoords.y) {
    resultOrder.push('down');
    usedDirections.down = true;
  } else if (targetCoords.x > headCoords.x) {
    resultOrder.push('up');
    usedDirections.up = true;
  } //we ignore an equals

  if (!usedDirections.up) {
    resultOrder.push('up');
  }

  if (!usedDirections.right) {
    resultOrder.push('right');
  }

  if (!usedDirections.down) {
    resultOrder.push('down');
  }

  if (!usedDirections.left) {
    resultOrder.push('left');
  }

  console.log("event=getDirectionPriority resultOrder=" + JSON.stringify(resultOrder))
  return resultOrder;
}

function getCoordsFromDirection(directionName, headCoords) {
  console.log("event=getCoordsFromDirection directionName=" + directionName)
  let result = null;
  if (directionName === 'up') {
    result = {x: headCoords.x, y: headCoords.y + 1}
  } else if (directionName === 'right') {
    result = {x: headCoords.x + 1, y: headCoords.y}
  } else if (directionName === 'down') {
    result = {x: headCoords.x, y: headCoords.y - 1}  
  } else if (directionName === 'left') {
    result = {x: headCoords.x - 1, y: headCoords.y}
  }

  console.log("event=getCoordsFromDirection resultCoords=" + coordsToString(result))
  return result;
}

/**
 * Evaluates provided direction against
 * - Self
 * - (not yet) walls
 * - (not yet) other snakes
 */
function isSafeDestination(targetCoords, gameData) {
  console.log("event=isSafeDestination targetCoords=" + coordsToString(targetCoords))

  for (let i = 0; i < gameData.you.body.length; i++) {
    const considerCoords = gameData.you.body[i]
    if (isSameCoords(targetCoords, considerCoords)) {
      return false
    }
  }
  return true
}

function isSameCoords(coords0, coords1) {
  console.log("event=isSameCoords coords0=" + coordsToString(coords0) + " coords1=" +  coordsToString(coords1))
  return coords0.x === coords1.x && coords0.y === coords1.y
}

function coordsToString(coords) {
  if (!coords) { 
    return "(yikesX, yikesY)"
  } else {
    return "{" + coords.x + "," + coords.y + "}"
  }
}

function searchClosestFood(gameData) {
  const food = gameData.board.food
  console.log("event=searchClosestFood food:")
  console.dir(food)

  let bestDistance = gameData.board.height + gameData.board.width
  let bestPellet = null

  food.forEach((pellet) => {
    const pelletDistance = Math.abs(gameData.you.head.x - pellet.x) + Math.abs(gameData.you.head.y - pellet.y)

    if (pelletDistance < bestDistance) {
      bestDistance = pelletDistance
      bestPellet = pellet
      console.log("event=searchClosestFood pelletCoords=" + coordsToString(pellet) + " distance=" + pelletDistance + " best=true")
    } else {
      console.log("event=searchClosestFood pelletCoords=" + coordsToString(pellet) + " distance=" + pelletDistance + " best=false")
    }
  })
  console.log("event=searchClosestFood bestPellet=" + coordsToString(bestPellet))
  return bestPellet
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
