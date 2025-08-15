"""
Virtual Mouse main entrypoint
- Detects hand with MediaPipe
- Moves mouse with pyautogui
"""
import cv2
import mediapipe as mp
import pyautogui
import sys
import math
from collections import deque
def distance(p1, p2):
    return math.hypot(p1.x - p2.x, p1.y - p2.y)


mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Screen size
screen_w, screen_h = pyautogui.size()


# Camera (reduce resolution for less lag)
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

# FPS limit
import time
FPS = 20
frame_time = 1.0 / FPS
last_time = time.time()



with mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
) as hands:
    left_click_buffer = deque(maxlen=7)
    left_clicked = False
    scroll_last_y = None
    paused = False
    pause_buffer = deque(maxlen=10)
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # FPS limiting
            now = time.time()
            elapsed = now - last_time
            if elapsed < frame_time:
                time.sleep(frame_time - elapsed)
            last_time = time.time()

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)
            num_hands = len(results.multi_hand_landmarks) if results.multi_hand_landmarks else 0


            # --- Two hands: just print message, do not pause ---
            if num_hands == 2:
                print("[virtual-mouse] Dos manos detectadas (sin acción)")
                continue

            if num_hands == 1:
                hand_landmarks = results.multi_hand_landmarks[0]
                # Landmarks
                index_tip = hand_landmarks.landmark[8]
                thumb_tip = hand_landmarks.landmark[4]
                middle_tip = hand_landmarks.landmark[12]
                ring_tip = hand_landmarks.landmark[16]
                pinky_tip = hand_landmarks.landmark[20]

                # Articulaciones intermedias
                index_mcp = hand_landmarks.landmark[5]
                middle_mcp = hand_landmarks.landmark[9]
                ring_mcp = hand_landmarks.landmark[13]
                pinky_mcp = hand_landmarks.landmark[17]

                # Detección de dedos levantados
                def is_up(tip, mcp):
                    return tip.y < mcp.y
                fingers_up = [
                    is_up(index_tip, index_mcp),   # índice
                    is_up(middle_tip, middle_mcp), # corazón
                    is_up(ring_tip, ring_mcp),     # anular
                    is_up(pinky_tip, pinky_mcp)    # meñique
                ]
                num_fingers_up = sum(fingers_up)

                # --- Virtual frame mapping ---
                x = index_tip.x
                y = index_tip.y
                FRAME_RATIO = 0.6
                x_min = (1.0 - FRAME_RATIO) / 2
                x_max = 1.0 - x_min
                y_min = (1.0 - FRAME_RATIO) / 2
                y_max = 1.0 - y_min
                x_clamped = min(max(x, x_min), x_max)
                y_clamped = min(max(y, y_min), y_max)
                x_norm = (x_clamped - x_min) / (x_max - x_min)
                y_norm = (y_clamped - y_min) / (y_max - y_min)
                target_x = int(x_norm * screen_w)
                target_y = int(y_norm * screen_h)

                # --- Acciones ---
                # 1. Mover ratón solo si SOLO el índice está levantado
                if fingers_up == [True, False, False, False]:
                    curr_x, curr_y = pyautogui.position()
                    dx = target_x - curr_x
                    dy = target_y - curr_y
                    dist = math.hypot(dx, dy)
                    if dist > 1:
                        fraction = min(0.35, max(0.08, dist / 200.0))
                        next_x = int(curr_x + dx * fraction)
                        next_y = int(curr_y + dy * fraction)
                        pyautogui.moveTo(next_x, next_y, duration=0)

                # 2. Indice y corazón levantados y separados: pausar movimiento
                elif fingers_up == [True, True, False, False]:
                    # Medir distancia entre puntas de índice y corazón
                    sep = distance(index_tip, middle_tip)
                    if sep > 0.08:
                        paused = True
                        print("[virtual-mouse] Pausado por gesto de paz (índice y corazón separados)")
                        continue
                    # Si están juntos, clic izquierdo
                    elif sep <= 0.08:
                        left_click_buffer.append(True)
                        if sum(left_click_buffer) >= 3 and not left_clicked:
                            pyautogui.click()
                            left_clicked = True
                        else:
                            left_clicked = False
                else:
                    left_click_buffer.append(False)
                    left_clicked = False

                # 3. 4 dedos levantados (sin pulgar): scroll
                if fingers_up == [True, True, True, True]:
                    if scroll_last_y is not None:
                        scroll_delta = y_norm - scroll_last_y
                        if abs(scroll_delta) > 0.01:
                            pyautogui.scroll(int(-scroll_delta * 300))
                    scroll_last_y = y_norm
                else:
                    scroll_last_y = None

            # Optional: show preview window for debug
            # cv2.imshow('Virtual Mouse', frame)
            # if cv2.waitKey(1) & 0xFF == 27:
            #     break
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"[virtual-mouse] error: {e}", file=sys.stderr)
    finally:
        cap.release()
        cv2.destroyAllWindows()
