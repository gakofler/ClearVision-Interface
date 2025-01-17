document.addEventListener("DOMContentLoaded", () => {
    const rotatable = document.querySelector(".rotatable");
    let isInteracting = false; // Status für Maus oder Touch
    let startAngle = 0; // Anfangswinkel
    let currentAngle = 0; // Aktueller Rotationswinkel
    const borderAngleRight = 60; // Minimaler Winkel in Grad
    const borderAngleLeft = 210; // Maximaler Winkel in Grad

    // Funktion: Berechnet den Winkel zwischen Zentrum und einem Punkt
    function getAngle(center, point) {
        const dx = point.clientX - center.x;
        const dy = point.clientY - center.y;
        return Math.atan2(dy, dx) * (180 / Math.PI); // Winkel in Grad
    }

    // Gemeinsame Logik für Start (Maus oder Touch)
    function startInteraction(event) {
        const point = event.touches ? event.touches[0] : event;
        const rect = rotatable.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        startAngle = getAngle(center, point) - currentAngle;
        isInteracting = true;
    }

    // Gemeinsame Logik für Bewegung (Maus oder Touch)
    function moveInteraction(event) {
        if (!isInteracting) return;

        const point = event.touches ? event.touches[0] : event;
        const rect = rotatable.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const angle = getAngle(center, point);

        let newAngle = angle - startAngle;

        // Begrenzung Winkel
        if (newAngle > borderAngleRight && newAngle < (borderAngleLeft - borderAngleRight)/2+borderAngleRight) {
            newAngle = borderAngleRight;
        } else if (newAngle < borderAngleLeft && newAngle > (borderAngleLeft - borderAngleRight)-borderAngleRight) {
            newAngle = borderAngleLeft;
        }

        currentAngle = newAngle;
        rotatable.style.transform = `rotate(${currentAngle}deg)`;
    }

    // Gemeinsame Logik für Ende der Interaktion
    function endInteraction() {
        isInteracting = false;
    }

    // Touch-Ereignisse
    rotatable.addEventListener("touchstart", startInteraction);
    rotatable.addEventListener("touchmove", (e) => {
        e.preventDefault(); // Verhindert das Scrollen
        moveInteraction(e);
    }, { passive: false });
    rotatable.addEventListener("touchend", endInteraction);

    // Maus-Ereignisse
    rotatable.addEventListener("mousedown", startInteraction);
    document.addEventListener("mousemove", moveInteraction);
    document.addEventListener("mouseup", endInteraction);
});
