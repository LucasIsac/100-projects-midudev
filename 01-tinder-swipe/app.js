let isAnimation = false;
let pullDeltaX = 0; // distancia que la card se arrastra
const DECISION_THRESHOLD = 80;
let actualCard = null;

function startDrag(event) {
  if (isAnimation) return;

  //get the first article element
  const actualCard = event.target.closest("article");
  if (!actualCard) return;

  //get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;
  console.log(startX);

  //listen de mouse and touch moments
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(event) {
    //current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;

    // the distnace between the initial and current position
    pullDeltaX = currentX - startX;

    //No hay distancia recorrida
    if (pullDeltaX === 0) return;

    //change the flag to indicate we are animation
    isAnimation = true;

    // calculate the rotation of the card using the distance
    const deg = pullDeltaX / 10;

    // apply the transformation to the card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    //chage de cursor to grabbing
    actualCard.style.cursor = "grabbing";

    // change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;
    
    const choiceElement = isRight ? actualCard.querySelector(".choice.like") : actualCard.querySelector(".choice.nope");

    choiceElement.style.opacity = opacity;
  }

  function onEnd(event) {
    // remove the event listeners
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    // saber si el usuario tomo una decisión
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;

      // add class according to the decision
      actualCard.classList.add(goRight ? "go-right" : "go-left");
      actualCard.addEventListener("transitionend", ()=>{
        actualCard.remove();
      }, {once: true});
    } else {
      actualCard.classList.add("reset");
      actualCard.classList.remove("go-right", "go-left");
      actualCard.querySelector(".choice").forEach((el) => {
        el.style.opacity = 0;
      });
    }

    //reser the variables
    actualCard.addEventListener("transitionend", ()=>{
        actualCard.removeAttribute("style");
        actualCard.classList.remove("reset");

        pullDeltaX = 0;
        isAnimation = false;
    })
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
