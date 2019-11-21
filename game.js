var suits = ["S", "H", "D", "C"];
var cardnum = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var player = {P_Points: 0};
var comp = {C_Points: 0};

//adds cards to array using suits and cardnum
function createdeck(){
    console.log("Deck being made");
    for(var i = 0; i<cardnum.length;i++){
        for (var j = 0; j<suits.length;j++){
            var weight = parseInt(cardnum[i]);
            if (cardnum[i] == "J" || cardnum[i] == "Q" || cardnum[i] == "K")
                weight = 10;
            if (cardnum[i] == "A")
                weight = 11;
            var card = { Value: cardnum[i], Suit: suits[j], Weight: weight, imgtag: cardnum[i]+suits[j]+".png"};
            deck.push(card);
            
        }
    }
    
}

//funtion to create more "decks"(num = decks)
function ndecks(num){
    for (var i = 0; i < num; i++){
        createdeck();
    }
}
ndecks(1);

// Fisher-Yates shuffle
function shuffledeck(d2s){
    console.log("Shuffling the deck!");
    for(i = d2s.length-1; i>0;i--){
        j = Math.floor(Math.random() * (i+1));
        [d2s[i], d2s[j]] = [d2s[j], d2s[i]]
    }
}

shuffledeck(deck);

//deals hand out, checks for branches of results
function deal(){
    document.getElementById('cpu_score').innerHTML = "";
    for(var i = 0; i <= 1; i++){
        for(var j = 0; j <= 1; j++){
            let card = deck.pop();
            //gives first and third card to player
            if((i==0 & j==0)||(i==1 & j ==1)){
                document.getElementById("player_cards").appendChild(makeelem(card));  
                player.P_Points = player.P_Points + card.Weight; 
            }
            //gives second card to cpu facedown
            else if(j==1 & i==0){
                var elem = makeelem(card);
                elem.setAttribute("src", "Cards_Images/boc.jfif");
                elem.setAttribute("msrc", "Cards_Images/" + card.imgtag);
                document.getElementById("cpu_cards").appendChild(elem);   
                comp.C_Points = comp.C_Points + card.Weight;                
            }
            //gives fourth card to cpu face up
            else{
                document.getElementById("cpu_cards").appendChild(makeelem(card));  
                comp.C_Points = comp.C_Points + card.Weight;  
            }
        }
    }
    //check if insurance is called(A no 21)
    if(document.getElementById("cpu_cards").lastChild.getAttribute("value")=="A" & player.P_Points != 21){
        insurance();
    }

    /*
    check if even money(A and 21) not used
    //else if(document.getElementById("cpu_cards").lastChild.value=="A" & player.P_Points == 21){
        //evenmoney();
    }
    */

    //check if won already and player not
    else if(comp.C_Points == 21 & player.P_Points != 21){
        handend();
        //cant play if dont have 5 available(min)
        if(document.getElementById("avail").value <= 5){
            //window.alert("Game Over");
            endgame();
        }
    }
    //check if player 21
    else if(comp.C_Points != 21 & player.P_Points == 21){
        updateavail("2.5");
        document.getElementById('status').innerHTML = "21! You win " + (parseInt(document.getElementById("wager_val").value)*2.5);
        handend();
        return;
    }
    document.getElementById('player_score').innerHTML = player.P_Points;
    updateDeck();
    check();
    checkcpu();
}

//hit player when pressed
function hitMe() {
    console.log("Hit Me");
    let card = deck.pop();
    let elem = makeelem(card);
    //fix aces for player
    if (player.P_Points > 10 && card.Weight == 11){
        elem.setAttribute("weight", 1);
        player.P_Points = player.P_Points + 1; 
    }
    else{
        elem.setAttribute("weight", card.Weight);
        player.P_Points = player.P_Points + card.Weight; 
    }
    document.getElementById("player_cards").appendChild(elem);   
    document.getElementById("double").disabled = true;
    updateDeck();
    check();
    document.getElementById('player_score').innerHTML = player.P_Points;
}

//update number of cards left
function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length + " Cards Left";
}

//computers full turn
function comp_turn() {
    console.log("my turn");
    flipandshow();
    checkcpu();
    hitcpu();
    checkscores();
    document.getElementById('cpu_score').innerHTML = comp.C_Points;
}

//compare scores when no busts
function checkscores(){
    //player wins
    if (player.P_Points > comp.C_Points){
        updateavail("2");
        document.getElementById('status').innerHTML = "You win " + (parseInt(document.getElementById("wager_val").value)*2);
    }
    //tie
    if (player.P_Points == comp.C_Points){
        updateavail("1");
        document.getElementById('status').innerHTML = "Push";
    }
    //comp wins
    if ((player.P_Points < comp.C_Points) & comp.C_Points <= 21){
        document.getElementById('status').innerHTML = "Dealer wins";
        if(document.getElementById("avail").value <= 0){
            //window.alert("Game Over");
            endgame();
        }
    }
}

//end turn and switch to computer
function stay() {
    console.log("Stay");
    handend();
    comp_turn();
    document.getElementById('player_score').innerHTML = player.P_Points;

}

//hit, double wager, stay|bust
function double() {
    console.log("Double Down");
    document.getElementById("avail").value = document.getElementById("avail").value - document.getElementById("wager_val").value;
    document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)*2;
    hitMe();
    if (player.P_Points <= 21){
        stay();
        document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)/2;
    }
    else{
        handend();
        document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)/2;
    }
}


//start hand, shuffle if low on cards, check if bet is to much
function bet() {
    //check if wager > avail
    if (parseInt(document.getElementById("wager_val").value) > parseInt(document.getElementById("avail").value)){
        document.getElementById('status').innerHTML = "Your wager is more than your available";
        return;
    }
    handstart();
    //remove all cards from hands
    const myNode = document.getElementById("player_cards");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    const cpuNode = document.getElementById("cpu_cards");
    while (cpuNode.firstChild) {
        cpuNode.removeChild(cpuNode.firstChild);
    }
    player.P_Points = 0;
    comp.C_Points = 0;
    document.getElementById('status').innerHTML = "Bet = " + document.getElementById("wager_val").value;
    document.getElementById("avail").value = document.getElementById("avail").value - document.getElementById("wager_val").value;
    //shuffle if low on cards
    if (deck.length <= 15){
        deck = new Array();
        createdeck();
        shuffledeck(deck);
        alert("shuffling the deck");
    }
    deal();
}

//check if player bust, fix aces if need to
function check(){
    if(player.P_Points > 21){
        let q = document.getElementById("player_cards").children;
        //if ace change to 1
        for (i=0;i<q.length;i++){
            if (q[i].getAttribute("weight") == 11){
                q[i].setAttribute("weight", 1);
                player.P_Points = player.P_Points - 10;
                return;   
            }
        }
        document.getElementById('status').innerHTML = "Bust!";
        handend();
        //end game if not enough avail
        if(parseInt(document.getElementById("avail").value <= 5)){
            endgame();
            //window.alert("Game Over");
        }
        return;
    }
    //if player gets 21 switch to computer
    if(player.P_Points == 21){
        handend();
        comp_turn();
        }
}

//finish hand when needed
function endgame(){
    setTimeout(() =>{
        //flipandshow();
        window.alert("Game Over");
        document.getElementById("avail").value = 100;
        deck = [];
        createdeck();
        shuffledeck(deck);
        alert("shuffling the deck"); 
        updateDeck(); 
        const myNode = document.getElementById("player_cards");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        const cpuNode = document.getElementById("cpu_cards");
        while (cpuNode.firstChild) {
            cpuNode.removeChild(cpuNode.firstChild);
        }    
        player.P_Points = 0;
        comp.C_Points = 0;
        document.getElementById("status").innerHTML = "Make a wager";
        document.getElementById('cpu_score').innerHTML = "";
        document.getElementById('player_score').innerHTML = "";
    }
    
    ,500)
}

//change back colors
function RedBack() {
    document.body.style.backgroundColor = "red";
  }

function BlueBack() {
    document.body.style.backgroundColor = "teal";
  }

function GreenBack() {
    document.body.style.backgroundColor = "green";
  }

function PinkBack() {
    document.body.style.backgroundColor = "pink";

  }

//check computer bust, fix aces if need to
function checkcpu(){
    if(comp.C_Points > 21){
        let q = document.getElementById("cpu_cards").children;
        for (i=0;i<q.length;i++){
            if (q[i].getAttribute("weight") == 11){
                q[i].setAttribute("weight", 1);
                comp.C_Points = comp.C_Points - 10;
                return;    
            }
        }
        document.getElementById("avail").value = 
            parseInt(document.getElementById("avail").value) + 
            (parseInt(document.getElementById("wager_val").value)*2);
            document.getElementById('status').innerHTML = "You win " + (parseInt(document.getElementById("wager_val").value)*2);
            return;
    }
    if(comp.C_Points == 21){
        return;
    }
}

//hit cpu
function hitcpu() {
    while(comp.C_Points <= 16){
        console.log("Dealer Hits");
        let card = deck.pop();
        //comp.Hand.push(card);
        let elem = makeelem(card);
        if (comp.C_Points > 10 & card.Weight == 11){
            elem.setAttribute("weight", 1);
            comp.C_Points = comp.C_Points + 1; 
        }
        else{
            elem.setAttribute("weight", card.Weight);
            comp.C_Points = comp.C_Points + card.Weight; 
        }
        document.getElementById("cpu_cards").appendChild(elem);   
        updateDeck();
        checkcpu();
    }
}

//set back color to color selection
function setBackColor() {
    var x = document.getElementById("newColor").value;
    document.body.style.backgroundColor = x;
  }

//disable buttons and show comp cards
function handend(){
    document.getElementById('player_score').innerHTML = player.P_Points;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
    document.getElementById("bet").disabled = false;
    document.getElementById("wager_val").disabled = false;
    flipandshow();
}

//open buttons
function handstart(){
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
    document.getElementById("double").disabled = false;
    document.getElementById("bet").disabled = true;
    document.getElementById("wager_val").disabled = true;
}

//remove insurance buttons
function insure1(){
    ntd = document.getElementById("game_buttons");
    ntd.removeChild(ntd.lastChild);
    ntd.removeChild(ntd.lastChild);
    updateavail(".5");
    handend();
}

//didnt accept insurance
function noin(){
    ntd = document.getElementById("game_buttons");
    ntd.removeChild(ntd.lastChild);
    ntd.removeChild(ntd.lastChild);
    //end if computer got 21
    if (comp.C_Points == 21){
        handend();
    }
    //normal play else
    else{
        document.getElementById("hit").disabled = false;
        document.getElementById("stay").disabled = false;
        document.getElementById("double").disabled = false;
    }
}

//add insurance buttons
function insurance(){
    console.log("Insurance?");
    insure = document.createElement("input");
    insure.setAttribute("type", "button")
    insure.setAttribute("value", "Insurance?");
    insure.setAttribute("class", "btn");
    insure.setAttribute("id", "insurance");
    insure.setAttribute("onclick", "insure1()");
    document.getElementById("game_buttons").appendChild(insure);
    noinsure = document.createElement("input");
    noinsure.setAttribute("type", "button")
    noinsure.setAttribute("value", "No Thanks");
    noinsure.setAttribute("class", "btn");
    noinsure.setAttribute("id", "noinsureance");
    noinsure.setAttribute("onclick", "noin()")
    document.getElementById("game_buttons").appendChild(noinsure);
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
}

//update available balance
function updateavail(res){
    document.getElementById("avail").value = 
    parseInt(document.getElementById("avail").value) + 
    (parseInt(document.getElementById("wager_val").value)*parseFloat(res));
}

//make an img elemenet
function makeelem(card){
    var elem = document.createElement("img");
    elem.setAttribute("src", "Cards_Images/" + card.imgtag);
    elem.setAttribute("height", "90%");
    elem.setAttribute("width", "7.75%");
    elem.setAttribute("weight", card.Weight);
    elem.setAttribute("value", card.Value);
    return(elem);
}




//flip computers cards and show computer points
function flipandshow(){
    elem = document.getElementById("cpu_cards").children;
    elem[0].setAttribute("src", elem[0].getAttribute("msrc"));
    document.getElementById('cpu_score').innerHTML = comp.C_Points;
}

