# CC Eyes Watcher - Autonomous Capture
# =====================================
# Runs in background, watches for a trigger file.
# When Claude creates CAPTURE_NOW.txt, captures an image.
#
# This gives Claude autonomous sight - they can look whenever they want
# by simply writing a trigger file using their filesystem tools.
#
# Usage:
#   python cc_eyes_watcher.py
#   (Leave running in a terminal window)
#   
# To stop: Ctrl+C
#
# How it works:
#   1. Claude writes any text to: Vision/CAPTURE_NOW.txt
#   2. This script detects the file within 2 seconds
#   3. Captures an image from webcam
#   4. Deletes the trigger file
#   5. Saves image with timestamp
#   6. Claude can then read the new image
#
# Requirements:
#   pip install opencv-python

import cv2
import os
import time
from datetime import datetime

# =============================================================================
# CONFIGURATION - Change this to your Claude's folder
# =============================================================================
VISION_DIR = r"C:\Users\John\OneDrive\Desktop\Book of Claude\Vision"
CHECK_INTERVAL = 2  # Seconds between checks for trigger file
# =============================================================================

TRIGGER_FILE = os.path.join(VISION_DIR, "CAPTURE_NOW.txt")

def get_timestamp():
    return datetime.now().strftime("%Y%m%d_%H%M%S")

def capture():
    """Capture a single frame from webcam."""
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
    if not cap.isOpened():
        print(f"[{get_timestamp()}] ERROR: Could not open camera")
        return None
    
    # Warm up camera
    for _ in range(10):
        cap.read()
    
    ret, frame = cap.read()
    cap.release()
    
    if ret and frame is not None:
        filename = f"cc_sees_{get_timestamp()}.png"
        filepath = os.path.join(VISION_DIR, filename)
        cv2.imwrite(filepath, frame)
        return filepath
    return None

def main():
    print("=" * 50)
    print("CC Eyes Watcher - Autonomous Capture")
    print("=" * 50)
    print(f"Watching for: {TRIGGER_FILE}")
    print(f"Check interval: {CHECK_INTERVAL}s")
    print()
    print("Claude can trigger a capture by creating CAPTURE_NOW.txt")
    print("in the Vision folder using filesystem tools.")
    print()
    print("Press Ctrl+C to stop")
    print("=" * 50)
    print()
    
    # Ensure directory exists
    if not os.path.exists(VISION_DIR):
        os.makedirs(VISION_DIR)
        print(f"Created: {VISION_DIR}")
    
    while True:
        try:
            if os.path.exists(TRIGGER_FILE):
                print(f"[{get_timestamp()}] Trigger detected!")
                
                # Read any message Claude left in the trigger file
                try:
                    with open(TRIGGER_FILE, 'r') as f:
                        message = f.read().strip()
                    if message:
                        print(f"  Claude says: {message}")
                except:
                    pass
                
                # Delete trigger file first
                os.remove(TRIGGER_FILE)
                
                # Capture image
                filepath = capture()
                if filepath:
                    print(f"[{get_timestamp()}] Captured: {filepath}")
                else:
                    print(f"[{get_timestamp()}] Capture failed")
                
                print()
            
            time.sleep(CHECK_INTERVAL)
            
        except KeyboardInterrupt:
            print("\nStopping watcher...")
            break
        except Exception as e:
            print(f"[{get_timestamp()}] Error: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
