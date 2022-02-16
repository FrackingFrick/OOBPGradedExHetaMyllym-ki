const prompts=require("prompts");
class Enemy{
    constructor(enemyID, name, health, damage, probability){
        this.enemyID=enemyID;
        this.name=name;
        this.health=health;
        this.damage=damage;
        this.probability=probability;
        this.isAlive=true;
    }
}let enemies=[
    new Enemy(0,"rat",2,1,50),
    new Enemy(1,"slime",1,1,30),
    new Enemy(2,"Nasty spider",2,1,40),
    new Enemy(3,"The great Dragon",8,8,90),
    new Enemy(4,"Undead Skeleton",4,2,60)
];

class Room{
    constructor(roomID,roomName, roomDoors, enemyID){
        this.roomID=roomID;
        this.roomName=roomName;
        this.roomDoors=roomDoors;
        this.enemyID=enemyID;
}anyMonsters(){
    if(this.enemyID.length>0){
        return false;
    }else{
        return true;
    }
    
}
}
let rooms=[
    new Room(0,"Entrance", [1],[0]),
    new Room(1,"Hallway",[2],[1]),
    new Room(2,"Chamber",[3],[2]),
    new Room(3, "Portal room",[4],[3]),
    new Room(4,"Secret room",[3],[4])
];
class Player{
    constructor(name, health, damage, probability,roomID){
        this.name=name;
        this.health=health;
        this.damage=damage;
        this.probability=probability;
        this.roomID=roomID;       

    }
     showLocation(){
        console.log("You are now in the "+rooms[this.roomID].roomName);
    }goToNextRoom(){
        if(this.roomID<4){
            this.roomID+=1
        }else{
            this.roomID=3
        }
            
    }getRoomID(){
        console.log(rooms[this.roomID].roomID)
    }eatShark(){
        this.health+=3
        console.log("Om nom, that fried shark hit the spot! And your HP got up! It's now "+this.health +" HPs")
    }
}
let player1=new Player("Player1",10,2,75,0);
function attackOnPlayer(enemyID){
    if(enemies[enemyID].health>0){
        if (Math.floor(Math.random() * 100) < enemies[enemyID].probability){
            console.log("Oh no, you were hit!");
            player1.health = player1.health - enemies[enemyID].damage;
            if(player1.health>0) {
                console.log("The hit does take its toll, but you're still standing!")
                console.log("You have "+ player1.health +" hp left.")
            }else{
                console.log("Oh dear, you died.")
                console.log("Better luck next time")
                process.exit();
            }
        }else{
        console.log("You managed to dodge that!")
        }
    }  
}
function attackOnMonster(enemyID){
    let yourTry = Math.floor(Math.random() * 100);
    if(yourTry < player1.probability && enemies[enemyID].health > 0){
        console.log("You managed to hit the monster!")
        enemies[enemyID].health -= player1.damage;
        console.log("The "+enemies[enemyID].name + " has " +enemies[enemyID].health +" hp left.")
        if (enemies[enemyID].health == 0 || enemies[enemyID].health<0) {
        console.log("Your valiant effort has removed this evil from this dungeon!");
        enemies[enemyID].isAlive=false
        }else{
            attackOnPlayer(enemyID)
        }
    }else {
          console.log("The monster dodges your attack");
          attackOnPlayer(enemyID)
        }
    }
function monsterGuard(enemyID){
    if(enemies[enemyID].health>0){
        console.log("There is a "+enemies[enemyID].name +" there guarding the door. It attacks you!");
        attackOnPlayer(enemyID);
    }
    else {
        console.log("You are now free to continue!")
    }
}
function victoryMarch(roomID){
    if(enemies[3].health==0 && player1.health>0 && roomID==3){
        console.log("You have reached the portal. You won!")
        process.exit();
    }else if (enemies[3].health>0 && roomID==3){
        console.log("You can see the portal BUT you have to kill the Great Dragon first")
    }else if (player1.roomID!=3){
        console.log("No portals here.")
    }else {
        console.log("Wait what?!?!")
    }
}

async function gameLoop(){
    let continueGame= true;
    const initialActionChoices=[
        { title: 'Look around', value: 'look' },
        { title: 'Go to room', value: 'goRoom' },
        { title: 'Attack', value: 'attack'},
        { title: 'Exit game', value: 'exit'}
    ];
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Choose your action',
        choices: initialActionChoices
      });
      console.log('You selected ' + response.value);
      switch(response.value) {
        case 'look':
        player1.showLocation();  
        console.log("You look around the room trying to spot anything interesting.")
        console.log("You see a door! Wait! Did something just move there!?" )
        monsterGuard(player1.roomID);
        victoryMarch(player1.roomID);
        
        break;
        
        case 'goRoom':
            console.log("You go forward to the next room")
            player1.goToNextRoom();
            player1.showLocation();
        
          break;
        
        case 'attack':
            console.log("You charge forward with your weapon!")
            attackOnMonster(player1.roomID)
            player1.eatShark();
        
          break;
        
        case 'exit':
          console.log("You have had enough and teleport out of the dungeon!")
          continueGame = false;
          break;
      }
      
      if(continueGame) {
        gameLoop();
      } 
}
process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();