var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");
var Neurons = [];
var x = 200;
var y = 200;
var xaccel1 = 0;
var yaccel1 = 0;
var xaccel2 = 0;
var yaccel2 = 0;
var xvel1 = 0;
var yvel1 = 0;
var xvel2 = 0;
var yvel2 = 0;
var xvel = 0;
var yvel = 0;
var timer = 0;

var npcx = [];
var npcy = [];
var npcxaccel = [];
var npcyaccel = [];
var npcxvel1 = [];
var npcyvel1 = [];
var npcxvel2 = [];
var npcyvel2 = [];
var npcxvel = [];
var npcyvel = [];
var npcNum = 50;

var bestscore = Infinity;
var bestindex = 0;
var fscores = [];
var model;
var istrue = false;

for (var k=0; k<npcNum; k++) {
  npcxaccel.push(0);
  npcyaccel.push(0);
  npcxvel1.push(0);
  npcxvel2.push(0);
  npcx.push(350);
  npcy.push(150);
  npcxvel.push(0);
  npcyvel.push(0);
  
  fscores.push(0);
}

//sloppy ways of doing things with vars, but they work.
var summation = 0;
var index = 0;

//Need neurons that read the current position of the npc!
for (var i=0; i<npcNum; i++) {
    Neurons[i] = [];
}

for (var k=0; k<npcNum; k++) {
  Neurons[k].push(new Neuron(0, 1, 1));
  Neurons[k].push(new Neuron(1, 1, 2));
  Neurons[k].push(new Neuron(2, 1, 1));
  Neurons[k].push(new Neuron(3, 1, 2));
  Neurons[k].push(new Neuron(4, 2, 1));
  Neurons[k].push(new Neuron(5, 2, 2));
  Neurons[k].push(new Neuron(6, 2, 3));
  Neurons[k].push(new Neuron(7, 3, 1));
  Neurons[k].push(new Neuron(8, 3, 2));
}

// console.log(Neurons);
document.onkeydown = KeyDown;
document.onkeyup = KeyUp;

      function KeyDown(event) {
      	event = event || window.event;
        if (event.keyCode === 65) {xaccel1 = -1;}
				if (event.keyCode === 68) {xaccel2 = 1;}
        if (event.keyCode === 83) {yaccel1 = 1;}
				if (event.keyCode === 87) {yaccel2 = -1;}
      }

      function KeyUp(event) {
      	event = event || window.event;
        if (event.keyCode === 65) {xaccel1 = 0;}
				if (event.keyCode === 68) {xaccel2 = 0;}
        if (event.keyCode === 83) {yaccel1 = 0;}
				if (event.keyCode === 87) {yaccel2 = 0;}
      }


function Neuron (id, layer, order, isfirst) {
  
  // this.isfirst = isfirst;
  // console.log(isfirst);
  this.id = id;
  this.layer = layer;
  this.order = order;
  this.bias = 0;
  if (model == undefined) {
    this.bias = (Math.round(Math.random()*20)-10);
  } else {
    this.bias = model[id].bias;
    if (isfirst != true) {
      this.bias += (Math.round(Math.random()*2)-1);
    }
  }
//   this.type = type;
  
  this.output = undefined;
  this.input = undefined;

  if (id == 0) {
    this.input = x;
  }
  if (id == 1) {
    this.input = y;
  }
  if (model == undefined) {
    this.weight = [];
    for (var i=0; i<4; i++) {
      this.weight.push(Math.round((Math.random()*20))/10-1);
    }
  } else {
    this.weight = [];
      for (var i=0; i<4; i++) {
        this.weight[i] = model[id].weight[i];
        if (isfirst != true) {
        this.weight[i] += (Math.round(Math.random()*20-10)/100);
      }
    }
  }
  // if (model != undefined && id == 5 && isfirst == true) {
  //   console.log(model[5].weight);
  //   console.log(this.weight); 
  // }
}

var mainloop = setInterval(function() {
  //Draws the background.
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0,0,500,500);
  //Update player pos and draw player.
  xvel += xaccel1 + xaccel2;
  yvel += yaccel1 + yaccel2;
  xvel *= 0.95;
  yvel *= 0.95;
  x += xvel;
  y += yvel;
  if (x > 475) {x = 475; xvel = 0;}
  if (x < 25) {x = 25; xvel = 0;}
  if (y > 275) {y = 275; yvel = 0;}
  if (y < 25) {y = 25; yvel = 0;}
  for (var k=0; k<npcNum; k++) {
    npcxaccel[k] = (Neurons[k][Neurons[k].length-2].output || 0)/100;
    npcyaccel[k] = (Neurons[k][Neurons[k].length-1].output || 0)/100;
    if (npcxaccel[k] > 1) {npcxaccel[k] = 1;}
    if (npcyaccel[k] > 1) {npcyaccel[k] = 1;}
    if (npcxaccel[k] < -1) {npcxaccel[k] = -1;}
    if (npcyaccel[k] < -1) {npcyaccel[k] = -1;}
    npcxvel[k] += npcxaccel[k];
    npcyvel[k] += npcyaccel[k];
    npcxvel[k] *= 0.95;
    npcyvel[k] *= 0.95;
    npcx[k] += npcxvel[k];
    npcy[k] += npcyvel[k];
    if (npcx[k] > 475) {npcx[k] = 475; npcxvel[k] = 0;}
    if (npcx[k] < 25) {npcx[k] = 25; npcxvel[k] = 0;}
    if (npcy[k] > 275) {npcy[k] = 275; npcyvel[k] = 0;}
    if (npcy[k] < 25) {npcy[k] = 25; npcyvel[k] = 0;}
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.arc(npcx[k], npcy[k], 15, 0, 2 * Math.PI);
    ctx.stroke();

    //Assignment of fscores
    //Remember, the lower the score the better!
    fscores[k] += (Math.abs((npcx[k]-x)^2)+Math.abs((npcy[k]-y)^2))^0.5;
    
    //Neuron Processing.
    for (var i=0; i< Neurons[k].length; i++) {
      //Updating Neurons.
      if (Neurons[k][i].id == 0) {
        Neurons[k][i].input = x;
        Neurons[k][i].output = (Neurons[k][i].input+Neurons[k][i].bias);
      } else if (Neurons[k][i].id == 1) {
        Neurons[k][i].input = y;
        Neurons[k][i].output = (Neurons[k][i].input+Neurons[k][i].bias);
      } else if (Neurons[k][i].id == 2) {
        Neurons[k][i].input = npcx[k];
        Neurons[k][i].output = (Neurons[k][i].input+Neurons[k][i].bias);
      } else if (Neurons[k][i].id == 3) {
        Neurons[k][i].input = npcy[k];
        Neurons[k][i].output = (Neurons[k][i].input+Neurons[k][i].bias);
      } else if (Neurons[k][i].layer == 2) {
        summation = 0;
        index = 0;
        for (var j=0; j<Neurons[k].length; j++) {
          if (Neurons[k][j].layer == 1) {
            summation += (Neurons[k][j].output+Neurons[k][j].bias)*Neurons[k][i].weight[index];
            index++;
          }
        }
        Neurons[k][i].input = summation;
        Neurons[k][i].output = summation;
      } else if (Neurons[k][i].layer == 3) {
        summation = 0;
        index = 0;
        for (var j=0; j<Neurons[k].length; j++) {
          if (Neurons[k][j].layer == 2) {
            summation += (Neurons[k][j].output+Neurons[k][j].bias)*Neurons[k][i].weight[index];
            index++;
          }
        }
        Neurons[k][i].input = summation;
        Neurons[k][i].output = summation;
      } else {

        Neurons[k][i].input = Neurons[k][0].output + Neurons[k][1].output + Neurons[k][2].output + Neurons[k][3].output;
        Neurons[k][i].output = (Neurons[k][i].input+Neurons[k][i].bias)*Neurons[k][i].weight[0];
      }
      //Drawing Neurons.
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.beginPath();
      ctx.arc(Neurons[0][i].layer*75, Neurons[0][i].order*50+Math.abs(Neurons[0][i].layer%2*25)+300, 15, 0, 2 * Math.PI);

      ctx.stroke();
      ctx.fillStyle = "rgb("+Math.abs(Neurons[0][i].output)+","+Math.abs(Neurons[0][i].output)+","+Math.abs(Neurons[0][i].output)+")";
      ctx.fill();
    }
    
  }
  //Draw player
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle="rgb(64,200,64)";
  ctx.fill();
  //Draw best fitness score & timer.
  ctx.fillStyle= "rgb(0,0,0)";
  ctx.fillText('Timer: '+Math.floor(timer/30)+'',10,325);
  bestscore = Infinity;
  bestindex = 0;
  for (var i=0; i<npcNum;i++) {
    if (bestscore > fscores[i]) {
      bestscore = fscores[i];
      bestindex = i;
    }
  }
  ctx.fillText('Best score: '+Math.floor(bestscore/100)+'',10,340);
  //Timer
  timer++;
  if (timer/30 == 10) {
    //Go to the next generation.
    timer = 0;
    bestscore = Infinity;
    x = 200;
    y = 200;
    npcx = [];
    npcy = [];
    npcxaccel = [];
    npcyaccel = [];
    npcxvel1 = [];
    npcyvel1 = [];
    npcxvel2 = [];
    npcyvel2 = [];
    npcxvel = [];
    npcyvel = [];
    
    fscores = [];
    for (var k=0; k<npcNum; k++) {
      npcxaccel.push(0);
      npcyaccel.push(0);
      npcxvel1.push(0);
      npcxvel2.push(0);
      npcx.push(350);
      npcy.push(150);
      npcxvel.push(0);
      npcyvel.push(0);

      fscores.push(0);
    }
    model = Neurons[bestindex];
    Neurons =[];
    for (var i=0; i<npcNum;i++) {
        Neurons[i] = [];
    }

    for (var k=0; k<npcNum; k++) {
      if (k==0) {istrue = true;} else {istrue = false;}
      Neurons[k].push(new Neuron(0, 1, 1, istrue));
      Neurons[k].push(new Neuron(1, 1, 2, istrue));
      Neurons[k].push(new Neuron(2, 1, 1, istrue));
      Neurons[k].push(new Neuron(3, 1, 2, istrue));
      Neurons[k].push(new Neuron(4, 2, 1, istrue));
      Neurons[k].push(new Neuron(5, 2, 2, istrue));
      Neurons[k].push(new Neuron(6, 2, 3, istrue));
      Neurons[k].push(new Neuron(7, 3, 1, istrue));
      Neurons[k].push(new Neuron(8, 3, 2, istrue));
    }
  }
}, 1000/30 );

//Quicksort :-)

function quickSort(items, left, right) {

    var ind;

    if (items.length > 1) {

        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        ind = partition(items, left, right);

        if (left < ind - 1) {
            quickSort(items, left, ind - 1);
        }

        if (ind < right) {
            quickSort(items, ind, right);
        }

    }

    return items;
}

function partition(items, left, right) {

    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;


    while (i <= j) {

        while (items[i] < pivot) {
            i++;
        }

        while (items[j] > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
