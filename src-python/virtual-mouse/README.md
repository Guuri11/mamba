# Virtual Mouse

Control your PC mouse using hand gestures and computer vision (MediaPipe) in Python.

## Features & Gestures

- **Move mouse**: Raise only the index finger (other fingers down). The cursor follows your index finger within a virtual frame.
- **Pause mouse movement**: Raise index and middle fingers (peace sign), separated (distance > 0.08). The mouse stops moving.
- **Left click**: Raise index and middle fingers together (distance ≤ 0.08). Triggers a left click.
- **Scroll**: Raise all four fingers (index, middle, ring, pinky; thumb down). Move your hand up/down to scroll.
- **Two hands detected**: No mouse action, just prints a message to the console (for future use).

## How it works

- Uses MediaPipe Hands to detect hand landmarks from your webcam.
- Maps the index finger tip position to a smaller, central virtual frame for more precise control.
- Interprets finger states (up/down) and distances between fingertips to detect gestures.
- Uses `pyautogui` to move the mouse, click, and scroll.
- All logic is in `src/main.py`.

## Usage

1. Instala las dependencias en el entorno Python 3.10:
   ```bash
   poetry install
   ```
2. Ejecuta el script:
   ```bash
   poetry run python src/main.py
   ```
3. Asegúrate de tener la webcam conectada y suficiente luz.

## Notas
- El marco virtual es el 60% central de la imagen de la cámara.
- Los umbrales de distancia y buffers de gestos pueden ajustarse en el código para mayor sensibilidad o robustez.
- El gesto de dos manos solo muestra un mensaje, no pausa ni afecta el ratón.
- Puedes extender el código fácilmente para nuevos gestos o acciones.

---

¿Ideas o mejoras? ¡Edita este README y el código!
