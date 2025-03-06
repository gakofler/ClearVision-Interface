document.addEventListener("DOMContentLoaded", () => {
    const rotatable = document.querySelector(".rotatable");
    const thumb = document.querySelector(".thumb");
    const track = document.querySelector(".track");

    const totalLength = track.getTotalLength();
    let isInteracting = false;
    let startAngle = 0;
    let currentAngle = 255; // Startwinkel auf 255 setzen
    let interactionTarget = null;

    const borderAngleLeft = 255;
    const borderAngleRight = 170;

    function getAngle(center, point) {
        const dx = point.clientX - center.x;
        const dy = point.clientY - center.y;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    function updateThumbPosition(angle) {
        const ratio = (angle - borderAngleRight) / (borderAngleLeft - borderAngleRight);
        const positionOnPath = totalLength * ratio;
        const point = track.getPointAtLength(positionOnPath);

        thumb.setAttribute("cx", point.x);
        thumb.setAttribute("cy", point.y);
    }

    function startInteraction(event, target) {
        const point = event.touches ? event.touches[0] : event;
        const rect = track.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

        startAngle = getAngle(center, point) - currentAngle;
        isInteracting = true;
        interactionTarget = target;
        event.preventDefault();
    }

    function moveInteraction(event) {
        if (!isInteracting) return;

        const point = event.touches ? event.touches[0] : event;
        const rect = track.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const angle = getAngle(center, point);

        let newAngle = angle - startAngle;

        if (newAngle > borderAngleLeft) {
            newAngle = borderAngleLeft;
        } else if (newAngle < borderAngleRight) {
            newAngle = borderAngleRight;
        }

        currentAngle = newAngle;

        rotatable.style.transform = `rotate(${currentAngle}deg)`;
        updateThumbPosition(currentAngle);
    }

    function endInteraction() {
        isInteracting = false;
        interactionTarget = null;
    }

    rotatable.addEventListener("pointerdown", (e) => startInteraction(e, "rotatable"));
    thumb.addEventListener("pointerdown", (e) => startInteraction(e, "thumb"));
    document.addEventListener("pointermove", moveInteraction);
    document.addEventListener("pointerup", endInteraction);
    document.addEventListener("pointercancel", endInteraction);

    // Setze Anfangsrotation und Thumb-Position
    rotatable.style.transform = `rotate(${currentAngle}deg)`;
    updateThumbPosition(currentAngle);
});
