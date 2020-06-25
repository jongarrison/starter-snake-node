const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)
console.log("JG Version 2");
app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  console.log("event=requestIndex");
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#001000',
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
 
  //var possibleMoves = ['up', 'down', 'left', 'right']
  //var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  
  console.log("turn = "+gameData.turn)
  
  //move = 'left'+'down'+'right'+'up'
  if (gameData.turn%4===0){
    move = "left"
  }else if(gameData.turn%4===1){
    move = "up"
  }else if(gameData.turn%4===2){
    move = "right"
  }else if(gameData.turn%4===3){
    move = "down"
  }
  console.log("head@")
  console.dir(gameData.you.head)
  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
