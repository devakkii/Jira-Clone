
var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn"); 
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const toolBoxColors = document.querySelectorAll(".toolbox-color-cont>*");
const removeBtn = document.querySelector(".fa-xmark");
const colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colors[colors.length - 1];
let ticketsArr = [];
// console.log(modalPriorityColor);
//console.log(allPriorityColors);
// console.log(toolBoxColors);

var isModalPresent = false; 
addBtn.addEventListener("click", function(){
     
    if(!isModalPresent) {
        // alert("Display Modal");
        modalCont.style.display = "flex";
    } 
    else {
        // alert("Display None");
        modalCont.style.display = "none";
        
    }

    isModalPresent = !isModalPresent;

});


modalCont.addEventListener("keydown", function(e) {
    // console.log(e);

    if(e.key == "Shift") {
        /* 1) createTicket 
           2) hide the model 
           3) update isModalPresent
        */
        //console.log(textArea.value);
        createTicket(modalPriorityColor, textArea.value);

        modalCont.style.display = "none";
        isModalPresent = false;
        textArea.value = "";
    } 
});


function createTicket(ticketColor, data, ticketId) {
    //generate uid
    let id = ticketId || uid();

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML=  ` 
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    // if ticket is being generated save it in local storage
    if(!ticketId) {
        ticketsArr.push({
            ticketId: id,
            ticketColor,
            ticketTask:data,
        });
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCont, id);
    handlePriorityColor(ticketCont, id);
    handleLock(ticketCont,id);
}

// getting data from localStorage, for re rendering of tickets
if (localStorage.getItem("tickets")) {
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(ticketObj=>createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId))
}


allPriorityColors.forEach(colorElement => {
    colorElement.addEventListener("click", function() {
        allPriorityColors.forEach(el => {
            el.classList.remove("active");
        });
        colorElement.classList.add("active"); 
        modalPriorityColor = colorElement.classList[0];
    });
});


// getting tickets on the basis of ticket color

for (let i=0;i<toolBoxColors.length;i++) {
    toolBoxColors[i].addEventListener("click", function() {
        let currColor = toolBoxColors[i].classList[0];
        let filteredTickets = ticketsArr.filter(ticketObj => ticketObj.ticketColor == currColor);
        // console.log(filteredTickets);

        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(ticket => ticket.remove());

        filteredTickets.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    });

    toolBoxColors[i].addEventListener("dblclick", function() {
        
        //remove specific tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(ticket => ticket.remove());

        //display all tickets
        ticketsArr.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));

    });
}


// remove button functionality
var isRemoveBtnActive = false; 
removeBtn.addEventListener("click", function(){
    // remove btn make it active 
    if(!isRemoveBtnActive) {
        console.log("activated");
        removeBtn.style.color = "red";
    } 
    else {
        removeBtn.style.color = "white";    
    }

    isRemoveBtnActive = !isRemoveBtnActive;

});


//helps in removing the ticket from frontend and saving in localStorage
function handleRemoval(ticketCont,id){
    ticketCont.addEventListener("click", function () {
      if (!isRemoveBtnActive) return;
  
      //remove from ticketsArr
      let idx = getTicketIdx(id);
      console.log(idx);
      ticketsArr.splice(idx, 1);
      console.log(ticketsArr);
      //set in local storage
      localStorage.setItem("tickets", JSON.stringify(ticketsArr));
      //remove from frontend
      ticketCont.remove();
    });
}
  
  
  
//retuns the index of ticket present in ticketsArr
function getTicketIdx(id) { 
    let idx = ticketsArr.findIndex(ticketObj => {
        return ticketObj.ticketId==id
    })
    return idx;
}



//change the priority of the ticketColor in ticketCont 
function handlePriorityColor(ticketCont, id) {
    let ticketColor = ticketCont.querySelector(".ticket-color");
  
    //addevemt listener of type click on  ticketColor
    ticketColor.addEventListener("click", function () {
      let currTicketColor = ticketColor.classList[1]; //lightpink
      let currTicketColorIdx = colors.indexOf(currTicketColor); //0
      let newTicketColorIdx = (currTicketColorIdx + 1)%colors.length; //1
      let newTicketColor = colors[newTicketColorIdx]; //lightgreen
      ticketColor.classList.remove(currTicketColor); //lightpink class removed
      ticketColor.classList.add(newTicketColor); //lightgreen class added
  
      //update local storage
      let idx = getTicketIdx(id);
      //update the newticketcolor in ticketArr
      ticketsArr[idx].ticketColor = newTicketColor;
      //set in local storage
      localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    });
}


//unlock class->fa-lock-open
const unlock = "fa-lock-open";
function handleLock(ticketCont, id) {
  let ticketLock = ticketCont.querySelector(".ticket-lock");
  let lock = ticketLock.children[0].classList[1];
  let ticketTaskArea = ticketCont.querySelector(".task-area");

  ticketLock.addEventListener("click", function () {
    if (ticketLock.children[0].classList.contains(lock)) {
      //remove lock class
      ticketLock.children[0].classList.remove(lock);
      //add unlock class 
      ticketLock.children[0].classList.add(unlock);

      //make content editable 
      ticketTaskArea.setAttribute("contenteditable", "true");
    }

    else if (ticketLock.children[0].classList.contains(unlock)) {
      //add lock class
      ticketLock.children[0].classList.add(lock);
      
      //remove unlocked class
      ticketLock.children[0].classList.remove(unlock);

      //make content not editable
      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    let idx = getTicketIdx(id);
    console.log(ticketTaskArea.textContent);
    ticketsArr[idx].ticketTask = ticketTaskArea.textContent;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    
  })
}
