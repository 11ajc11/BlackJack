var suits = ["S", "H", "D", "C"];
var cardnum = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
deck = new Array();
var player = { Name: 'Player', ID: 'player', P_Points: 0};
var comp = { Name: 'Comp', ID: 'comp', C_Points: 0};

function startBlackjack() {
    console.log("Create Deck");
    console.log("Shuffle Deck");
    console.log("Insurance?");
}

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

function deal(){
    document.getElementById('cpu_score').innerHTML = "";
    for(var i = 0; i <= 1; i++){
        for(var j = 0; j <= 1; j++){
            var card = deck.pop();
            if((i==0 & j==0)||(i==1&j==1)){
                //player.Hand.push(card);
                document.getElementById("player_cards").appendChild(makeelem(card));  
                player.P_Points = player.P_Points + card.Weight; 
            }
            else if(j==1 & i==0){
                //comp.Hand.push(card);
                var elem = makeelem(card);
                elem.setAttribute("src", "Cards_Images/boc.jfif");
                elem.setAttribute("msrc", "Cards_Images/" + card.imgtag);
                document.getElementById("cpu_cards").appendChild(elem);   
                comp.C_Points = comp.C_Points + card.Weight;                
            }
            else{
                //comp.Hand.push(card);
                document.getElementById("cpu_cards").appendChild(makeelem(card));  
                comp.C_Points = comp.C_Points + card.Weight;  
            }
        }
    }
    if(document.getElementById("cpu_cards").lastChild.getAttribute("value")=="A" & player.P_Points != 21){
        insurance();
    }
    else if(document.getElementById("cpu_cards").lastChild.value=="A" & player.P_Points == 21){
        evenmoney();
    }
    else if(comp.C_Points == 21 & player.P_Points != 21){
        handend();
        if(document.getElementById("avail").value <= 0){
            //window.alert("Game Over");
            endgame();
        }
    }
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



function hitMe() {
    console.log("Hit Me");
    var card = deck.pop();
    //player.Hand.push(card);
    var elem = makeelem(card);
    if (player.P_Points > 10 && card.Weight == 11){
        elem.setAttribute("weight", 1);
        player.P_Points = player.P_Points + 1; 
    }
    else{
        elem.setAttribute("weight", card.Weight);
        player.P_Points = player.P_Points + card.Weight; 
    }
    document.getElementById("player_cards").appendChild(elem);   
    updateDeck();
    document.getElementById("double").disabled = true;
    check();
    document.getElementById('player_score').innerHTML = player.P_Points;
}

function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length + " Cards Left";
}

function comp_turn() {
    console.log("my turn");
    flipandshow();
    checkcpu();
    hitcpu();
    checkscores();
    document.getElementById('cpu_score').innerHTML = comp.C_Points;
}

function checkscores(){
    if (player.P_Points > comp.C_Points){
        updateavail("2");
        document.getElementById('status').innerHTML = "You win " + (parseInt(document.getElementById("wager_val").value)*2);
    }
    if (player.P_Points == comp.C_Points){
        updateavail("1");
        document.getElementById('status').innerHTML = "Push";
    }
    if ((player.P_Points < comp.C_Points) & comp.C_Points <= 21){
        document.getElementById('status').innerHTML = "Dealer wins";
        if(document.getElementById("avail").value <= 0){
            //window.alert("Game Over");
            endgame();
        }
    }
}

function stay() {
    console.log("Stay");
    handend();
    comp_turn();
    document.getElementById('player_score').innerHTML = player.P_Points;

}

function double() {
    console.log("Double Down");
    document.getElementById("avail").value = document.getElementById("avail").value - document.getElementById("wager_val").value;
    document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)*2;
    hitMe();
    if (player.P_Points <= 21){
        stay()
        document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)/2;
    }
    else{
        handend();
        document.getElementById('wager_val').value = parseInt(document.getElementById("wager_val").value)/2;
    }
}



function bet() {
    handstart();
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
    if (deck.length <= 15){
        deck = new Array();
        createdeck();
        shuffledeck(deck);
        alert("shuffling the deck");
    }
    deal();
}

function check(){
    if(player.P_Points > 21){
        q = document.getElementById("player_cards").children;
        for (i=0;i<q.length;i++){
            if (q[i].getAttribute("weight") == 11){
                q[i].setAttribute("weight", 1);
                player.P_Points = player.P_Points - 10;
                return;   
            }
        }
        document.getElementById('status').innerHTML = "Bust!";
        handend();
        if(document.getElementById("avail").value <= 0){
            endgame();
            //window.alert("Game Over");
        }
        return;
    }
    if(player.P_Points == 21){
        handend();
        comp_turn();
        }
}

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

function checkcpu(){
    if(comp.C_Points > 21){
        q = document.getElementById("cpu_cards").children;
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

function hitcpu() {
    while(comp.C_Points <= 16){
        console.log("Dealer Hits");
        var card = deck.pop();
        //comp.Hand.push(card);
        var elem = makeelem(card);
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

function setBackColor() {
    var x = document.getElementById("newColor").value;
    document.body.style.backgroundColor = x;
  }

//Things to fix
//
//scoreboard
//onchange add/sub chips
//multideck

function handend(){
    document.getElementById('player_score').innerHTML = player.P_Points;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
    document.getElementById("bet").disabled = false;
    document.getElementById("wager_val").disabled = false;
    flipandshow();
}

function handstart(){
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
    document.getElementById("double").disabled = false;
    document.getElementById("bet").disabled = true;
    document.getElementById("wager_val").disabled = true;
}

function insure1(){
    ntd = document.getElementById("game_buttons");
    ntd.removeChild(ntd.lastChild);
    ntd.removeChild(ntd.lastChild);
    updateavail(".5");
    handend();
}

function noin(){
    ntd = document.getElementById("game_buttons");
    ntd.removeChild(ntd.lastChild);
    ntd.removeChild(ntd.lastChild);
    if (comp.C_Points == 21){
        handend();
    }
    else{
        document.getElementById("hit").disabled = false;
        document.getElementById("stay").disabled = false;
        document.getElementById("double").disabled = false;
    }
}

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

function evenmoney(){
    console.log("even money");
}

function updateavail(res){
    document.getElementById("avail").value = 
    parseInt(document.getElementById("avail").value) + 
    (parseInt(document.getElementById("wager_val").value)*parseFloat(res));
}

function makeelem(card){
    var elem = document.createElement("img");
    elem.setAttribute("src", "Cards_Images/" + card.imgtag);
    elem.setAttribute("height", "90%");
    elem.setAttribute("width", "7.75%");
    elem.setAttribute("weight", card.Weight);
    elem.setAttribute("value", card.Value);
    return(elem);
}



//<div>Select number of Decks
//<input type="number" name="decknum" min="1" max="6" value="1"> 
//</div>

function flipandshow(){
    elem = document.getElementById("cpu_cards").children;
    elem[0].setAttribute("src", elem[0].getAttribute("msrc"));
    document.getElementById('cpu_score').innerHTML = comp.C_Points;
}

