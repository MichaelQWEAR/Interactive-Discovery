// ===== Which scene is showing right now =====
let currentScene = "entrance";

// ===== Switch scenes =====
// Hide the old scene, show the new one
function showScene(id) {
  document.getElementById(currentScene).style.display = "none";
  document.getElementById(id).style.display = "flex";
  currentScene = id;

  // The back button only shows inside the three rooms
  if (id === "entrance" || id === "hall") {
    document.getElementById("backBtn").style.display = "none";
  } else {
    document.getElementById("backBtn").style.display = "block";
  }
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

// The platform is locked for now. Later we will check the clues here.
document.getElementById("goPlatform").addEventListener("click", function () {
  document.getElementById("hallMessage").innerHTML =
    "The destination is still unclear. Keep exploring.";
});

// ===== Back to Hall =====
document.getElementById("backBtn").addEventListener("click", function () {
  document.getElementById("hallMessage").innerHTML = "";
  showScene("hall");
});
