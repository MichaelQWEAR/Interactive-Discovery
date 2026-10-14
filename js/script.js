// ===== Story state =====
let currentScene = "entrance";
let clues = 0;

let ticketFlipped = false;
let ticketRead = false;
let timetableRead = false;

let lampOn = false;
let photoStep = 0; // 0 = not seen, 1 = front seen, 2 = back read
let hasKey = false;

let drawerOpen = false;
let letterRead = false;
let noteFound = false;

// ===== Switch scenes =====
// Hide the old scene, show the new one
function showScene(id) {
    document.getElementById(currentScene).style.display = "none";
    document.getElementById(id).style.display = "flex";
    currentScene = id;

    saveGame();
}

// ===== Clue counter =====
function addClue() {
    clues += 1;
    updateClues();
}

function updateClues() {
    document.getElementById("clueCount").innerHTML = "Clues found: " + clues + " / 3";

    // All three clues found: open the gate
    // Swap the closed gate for the open one
    if (clues === 3) {
        document.getElementById("goPlatform").style.display = "none";
        document.getElementById("goPlatformOpen").style.display = "block";
    }
}

// ===== Items list =====
function updateItems() {
    let items = "";

    if (hasKey === true) {
        items = "small brass key";
    }
    if (noteFound === true) {
        items = items + ", folded note";
    }

    if (items === "") {
        items = "none";
    }
    document.getElementById("itemList").innerHTML = "Items: " + items;
}

// ===== Scene 1: Entrance =====
document.getElementById("enterBtn").addEventListener("click", function () {
    showScene("hall");
});

// ===== Scene 2: Main Hall =====
document.getElementById("goBooth").addEventListener("click", function () {
    showScene("booth");
});

document.getElementById("goWaiting").addEventListener("click", function () {
    showScene("waiting");
});

document.getElementById("goLost").addEventListener("click", function () {
    showScene("lost");
});

// The closed gate only shows a hint
document.getElementById("goPlatform").addEventListener("click", function () {
    document.getElementById("hallMessage").innerHTML =
        "The destination is still unclear. Keep exploring.";
});

// The open gate leads to the platform
document.getElementById("goPlatformOpen").addEventListener("click", function () {
    showScene("platform");
});

// ===== Scene 3: Ticket Booth =====
// Flip the ticket back and forth
document.getElementById("flipTicket").addEventListener("click", function () {
    ticketFlipped = !ticketFlipped;

    if (ticketFlipped === true) {
        document.getElementById("boothTicket").innerHTML =
            "<p class='stamp'>Back of the ticket</p>" +
            "<p class='ticket-top'>Valid for one journey only</p>" +
            "<p class='ticket-main'>Return to where it began.</p>" +
            "<p class='ticket-bottom'>A tiny blue paper train is drawn in the corner.</p>";
        document.getElementById("flipTicket").innerHTML = "Turn it back";

        // The first time only, this counts as a clue
        if (ticketRead === false) {
            ticketRead = true;
            addClue();
            document.getElementById("goBooth").innerHTML = "Ticket Booth (explored)";
            document.getElementById("flipResult").innerHTML =
                "Clue found: the back of the ticket.";
            saveGame();
        }
    } else {
        document.getElementById("boothTicket").innerHTML =
            "<p class='stamp'>Punched 11:47</p>" +
            "<p class='ticket-top'>Admit one, platform 3</p>" +
            "<p class='ticket-main'>Your last train leaves at 11:47.</p>" +
            "<p class='ticket-bottom'>Destination: Unknown</p>";
        document.getElementById("flipTicket").innerHTML = "Turn the ticket over";
    }
});

// Show the timetable
document.getElementById("readTimetable").addEventListener("click", function () {
    if (timetableRead === false) {
        timetableRead = true;
        document.getElementById("timetable").style.display = "block";
        document.getElementById("timetableResult").innerHTML =
            "The date is from 2006, the summer you turned ten. One train has no city, only a name.";
        document.getElementById("readTimetable").innerHTML = "Nothing else on the timetable";
        saveGame();
    }
});

// ===== Scene 4: Waiting Room =====
// Turn the lamp on and off
document.getElementById("lampBtn").addEventListener("click", function () {
    lampOn = !lampOn;
    document.getElementById("photoResult").innerHTML = "";

    if (lampOn === true) {
        document.getElementById("waiting").style.backgroundColor = "#fdcb34b2";
        document.getElementById("lampBtn").innerHTML = "Turn off the lamp";
        document.getElementById("waitingText").innerHTML =
            "Warm light fills the room. The bench is worn smooth, and the frame on the wall holds an old photograph.";
        // If the photo was already seen, it stays visible
        if (photoStep > 0) {
            document.getElementById("photo").style.display = "block";
        }
    } else {
        document.getElementById("waiting").style.backgroundColor = "#121212";
        document.getElementById("lampBtn").innerHTML = "Turn on the lamp";
        document.getElementById("waitingText").innerHTML =
            "It is almost too dark to see. You can make out a long wooden bench, a desk lamp, and a small frame on the wall.";
        document.getElementById("photo").style.display = "none";
    }
    saveGame();
});

// The photo button has three steps:
// look at it, turn it over, then nothing more to find
document.getElementById("photoBtn").addEventListener("click", function () {
    if (lampOn === false) {
        document.getElementById("photoResult").innerHTML =
            "It is too dark to see the photograph clearly.";
    } else if (photoStep === 0) {
        photoStep = 1;
        document.getElementById("photo").style.display = "block";
        document.getElementById("photoResult").innerHTML =
            "A family on this same bench. The child holds a blue paper train, just like the drawing on your ticket.";
        document.getElementById("photoBtn").innerHTML = "Turn the photo over";
    } else if (photoStep === 1) {
        photoStep = 2;
        document.getElementById("photoBack").style.display = "block";
        addClue();
        document.getElementById("goWaiting").innerHTML = "Waiting Room (explored)";
        document.getElementById("photoResult").innerHTML =
            "Clue found: the back of the photograph. The same time again, 11:47.";
        document.getElementById("photoBtn").innerHTML = "Nothing else on the photo";
    }
    saveGame();
});

// Find the key under the bench (only once)
document.getElementById("benchBtn").addEventListener("click", function () {
    if (hasKey === false) {
        hasKey = true;
        updateItems();
        document.getElementById("benchResult").innerHTML =
            "Item found: a small brass key, taped under the bench. You put it in your pocket.";
        document.getElementById("benchBtn").innerHTML = "Nothing else under the bench";
        saveGame();
    }
});

// ===== Scene 5: Lost and Found =====
// The drawer needs the key from the waiting room
document.getElementById("drawerBtn").addEventListener("click", function () {
    if (hasKey === true) {
        drawerOpen = true;
        document.getElementById("drawerResult").innerHTML =
            "The brass key fits. Inside is an envelope with your name on it.";
        document.getElementById("drawerBtn").style.display = "none";
        document.getElementById("letterBtn").style.display = "block";
        saveGame();
    } else {
        document.getElementById("drawerResult").innerHTML =
            "The drawer is locked. There must be a key somewhere in the station.";
    }
});

// The letter button has three steps:
// read the letter, check the envelope again, then nothing more
document.getElementById("letterBtn").addEventListener("click", function () {
    if (letterRead === false) {
        letterRead = true;
        addClue();
        document.getElementById("letter").style.display = "block";
        document.getElementById("goLost").innerHTML = "Lost and Found (explored)";
        document.getElementById("letterResult").innerHTML =
            "Clue found: a letter you wrote when you were ten. The envelope still feels heavier than one sheet of paper.";
        document.getElementById("letterBtn").innerHTML = "Check the envelope again";
    } else if (noteFound === false) {
        // Hidden item: only curious players find it
        noteFound = true;
        updateItems();
        document.getElementById("noteResult").innerHTML =
            "Item found: a folded note slips out of the envelope. It is in your mother's handwriting. You keep it for later.";
        document.getElementById("letterBtn").innerHTML = "Nothing else in the envelope";
    }
    saveGame();
});

// ===== Scene 6: Platform =====
// Show an ending and the Play Again button
function showEnding(text) {
    // The family note from the Lost and Found changes the ending
    if (noteFound === true) {
        text = text +
            "<p class='ending-note'>In your pocket, the folded note: 'Wherever you go, we will be proud of you.'</p>";
    }
    document.getElementById("endingText").innerHTML = text;
    document.getElementById("endingChoices").style.display = "none";
    document.getElementById("againBtn").style.display = "inline-block";
}

document.getElementById("boardBtn").addEventListener("click", function () {
    showEnding(
        "<p>You step onto the train. The doors close softly behind you.</p>" +
        "<p>Outside the window, the rain stops. You are ten again, holding a blue paper train, and you remember what you promised yourself: to go and see the world.</p>"
    );
});

document.getElementById("stayBtn").addEventListener("click", function () {
    showEnding(
        "<p>You watch the last train leave without you.</p>" +
        "<p>But the promise is not lost. You fold the ticket, put it back in your pocket, and decide that tomorrow you will start your own journey.</p>"
    );
});

// ===== Back to Hall =====
// Each room has its own back button at the bottom
function backToHall() {
    document.getElementById("hallMessage").innerHTML = "";
    if (clues === 3) {
        document.getElementById("hallMessage").innerHTML =
            "All three clues found. The gate to the platform is open.";
    }
    showScene("hall");
}

document.getElementById("backFromBooth").addEventListener("click", function () {
    backToHall();
});

document.getElementById("backFromWaiting").addEventListener("click", function () {
    backToHall();
});

document.getElementById("backFromLost").addEventListener("click", function () {
    backToHall();
});

// ===== Save and load (localStorage) =====
// Every key starts with "lastTrain_" so it does not mix with other projects
function saveGame() {
    localStorage.setItem("lastTrain_scene", currentScene);
    localStorage.setItem("lastTrain_clues", clues);
    localStorage.setItem("lastTrain_ticketRead", ticketRead);
    localStorage.setItem("lastTrain_timetableRead", timetableRead);
    localStorage.setItem("lastTrain_lampOn", lampOn);
    localStorage.setItem("lastTrain_photoStep", photoStep);
    localStorage.setItem("lastTrain_hasKey", hasKey);
    localStorage.setItem("lastTrain_drawerOpen", drawerOpen);
    localStorage.setItem("lastTrain_letterRead", letterRead);
    localStorage.setItem("lastTrain_noteFound", noteFound);
}

function clearGame() {
    localStorage.removeItem("lastTrain_scene");
    localStorage.removeItem("lastTrain_clues");
    localStorage.removeItem("lastTrain_ticketRead");
    localStorage.removeItem("lastTrain_timetableRead");
    localStorage.removeItem("lastTrain_lampOn");
    localStorage.removeItem("lastTrain_photoStep");
    localStorage.removeItem("lastTrain_hasKey");
    localStorage.removeItem("lastTrain_drawerOpen");
    localStorage.removeItem("lastTrain_letterRead");
    localStorage.removeItem("lastTrain_noteFound");
}

// "Play again" is a link back to index.html.
// Clear the save first, so the game really starts over.
document.getElementById("againBtn").addEventListener("click", function () {
    clearGame();
});

// localStorage only stores text, so "true" has to be compared as a string
function loadGame() {
    if (localStorage.getItem("lastTrain_scene") === null) {
        return; // nothing saved yet
    }

    clues = parseInt(localStorage.getItem("lastTrain_clues"));
    photoStep = parseInt(localStorage.getItem("lastTrain_photoStep"));
    ticketRead = localStorage.getItem("lastTrain_ticketRead") === "true";
    timetableRead = localStorage.getItem("lastTrain_timetableRead") === "true";
    lampOn = localStorage.getItem("lastTrain_lampOn") === "true";
    hasKey = localStorage.getItem("lastTrain_hasKey") === "true";
    drawerOpen = localStorage.getItem("lastTrain_drawerOpen") === "true";
    letterRead = localStorage.getItem("lastTrain_letterRead") === "true";
    noteFound = localStorage.getItem("lastTrain_noteFound") === "true";

    // Put the page back the way the user left it
    updateClues();
    updateItems();

    if (ticketRead === true) {
        document.getElementById("goBooth").innerHTML = "Ticket Booth (explored)";
        document.getElementById("flipResult").innerHTML = "Clue found: the back of the ticket.";
    }

    if (timetableRead === true) {
        document.getElementById("timetable").style.display = "block";
        document.getElementById("timetableResult").innerHTML =
            "The date is from 2006, the summer you turned ten. One train has no city, only a name.";
        document.getElementById("readTimetable").innerHTML = "Nothing else on the timetable";
    }

    if (lampOn === true) {
        document.getElementById("waiting").style.backgroundColor = "#fdcb34b2";
        document.getElementById("lampBtn").innerHTML = "Turn off the lamp";
        document.getElementById("waitingText").innerHTML =
            "Warm light fills the room. The bench is worn smooth, and the frame on the wall holds an old photograph.";
        if (photoStep > 0) {
            document.getElementById("photo").style.display = "block";
        }
    }

    if (photoStep === 1) {
        document.getElementById("photoBtn").innerHTML = "Turn the photo over";
        document.getElementById("photoResult").innerHTML =
            "A family on this same bench. The child holds a blue paper train, just like the drawing on your ticket.";
    } else if (photoStep === 2) {
        document.getElementById("photoBack").style.display = "block";
        document.getElementById("photoBtn").innerHTML = "Nothing else on the photo";
        document.getElementById("goWaiting").innerHTML = "Waiting Room (explored)";
        document.getElementById("photoResult").innerHTML =
            "Clue found: the back of the photograph. The same time again, 11:47.";
    }

    if (hasKey === true) {
        document.getElementById("benchBtn").innerHTML = "Nothing else under the bench";
        document.getElementById("benchResult").innerHTML =
            "Item found: a small brass key, taped under the bench. You put it in your pocket.";
    }

    if (drawerOpen === true) {
        document.getElementById("drawerBtn").style.display = "none";
        document.getElementById("letterBtn").style.display = "block";
        document.getElementById("drawerResult").innerHTML =
            "The brass key fits. Inside is an envelope with your name on it.";
    }

    if (letterRead === true) {
        document.getElementById("letter").style.display = "block";
        document.getElementById("letterBtn").innerHTML = "Check the envelope again";
        document.getElementById("goLost").innerHTML = "Lost and Found (explored)";
        document.getElementById("letterResult").innerHTML =
            "Clue found: a letter you wrote when you were ten. The envelope still feels heavier than one sheet of paper.";
    }

    if (noteFound === true) {
        document.getElementById("letterBtn").innerHTML = "Nothing else in the envelope";
        document.getElementById("noteResult").innerHTML =
            "Item found: a folded note slips out of the envelope. It is in your mother's handwriting. You keep it for later.";
    }

    // Go back to the scene the user was in
    showScene(localStorage.getItem("lastTrain_scene"));
}

loadGame();
