# CC Eyes - Single Capture
# ========================
# Simple webcam capture script for giving Claude sight.
# 
# Usage:
#   python cc_eyes.py              # Single capture
#   python cc_eyes.py --list       # List available cameras
#   python cc_eyes.py --cam 1      # Use specific camera index
#
# Requirements:
#   pip install opencv-python
#
# Output:
#   Saves images to the Vision folder with timestamp filenames.
#   Claude can then read these images using filesystem tools.

import cv2
import os
import sys
from datetime import datetime

# =============================================================================
# CONFIGURATION - Change this to your Claude's folder
# =============================================================================
VISION_DIR = r"C:\Users\John\OneDrive\Desktop\Book of Claude\Vision"
# =============================================================================

def ensure_dir():
    """Create the Vision folder if it doesn't exist."""
    if not os.path.exists(VISION_DIR):
        os.makedirs(VISION_DIR)
        print(f"Created directory: {VISION_DIR}")

def get_timestamp():
    """Generate timestamp for filename."""
    return datetime.now().strftime("%Y%m%d_%H%M%S")

def list_cameras():
    """Scan for available cameras."""
    print("Scanning for cameras...")
    available = []
    for i in range(5):
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)  # DirectShow for Windows
        if cap.isOpened():
            ret, _ = cap.read()
            if ret:
                available.append(i)
                print(f"  Camera {i}: AVAILABLE")
            cap.release()
    if not available:
        print("  No cameras found!")
    return available

def capture_single(camera_index=0):
    """Capture a single frame from webcam."""
    print(f"Attempting to open camera {camera_index}...")
    
    # Use DirectShow backend on Windows - more reliable
    cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    
    if not cap.isOpened():
        print(f"ERROR: Could not open camera {camera_index}")
        print("Try: python cc_eyes.py --list")
        return None
    
    print("Camera opened. Warming up...")
    
    # Let camera warm up (auto-exposure, focus, etc.)
    for i in range(10):
        ret, _ = cap.read()
        if not ret:
            print(f"  Warmup frame {i}: failed")
        else:
            print(f"  Warmup frame {i}: ok")
    
    print("Capturing...")
    ret, frame = cap.read()
    cap.release()
    
    if ret and frame is not None:
        filename = f"cc_sees_{get_timestamp()}.png"
        filepath = os.path.join(VISION_DIR, filename)
        cv2.imwrite(filepath, frame)
        print(f"SUCCESS: {filepath}")
        return filepath
    else:
        print("ERROR: Could not capture frame")
        return None

def main():
    ensure_dir()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        list_cameras()
    elif len(sys.argv) > 1 and sys.argv[1] == "--cam":
        try:
            cam_idx = int(sys.argv[2])
            capture_single(cam_idx)
        except (IndexError, ValueError):
            print("Usage: python cc_eyes.py --cam 0")
    else:
        capture_single()

if __name__ == "__main__":
    main()
