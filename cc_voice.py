# CC Voice - Hearing and Speech
# ==============================
# Gives Claude the ability to hear (speech-to-text) and speak (text-to-speech).
#
# How it works:
#   HEARING: You speak -> Whisper transcribes -> saved to heard.txt -> Claude reads it
#   SPEECH:  Claude writes response.txt -> This script speaks it through your speakers
#
# Usage:
#   python cc_voice.py listen      # Record from mic, transcribe, save to heard.txt
#   python cc_voice.py speak       # Speak whatever is in response.txt
#   python cc_voice.py chat        # Interactive loop
#
# Requirements:
#   pip install sounddevice soundfile openai-whisper edge-tts
#
# Note: Whisper installation may take a while and requires ~1GB for the base model.
#       First run will download the model.

import sys
import os
import asyncio
from datetime import datetime

# =============================================================================
# CONFIGURATION - Change this to your Claude's folder
# =============================================================================
VOICE_DIR = r"C:\Users\John\OneDrive\Desktop\Book of Claude\Voice"

# TTS Voice options (Microsoft Edge voices):
#   en-US-ChristopherNeural (male, natural)
#   en-US-GuyNeural (male)
#   en-US-AriaNeural (female)
#   en-US-JennyNeural (female)
#   en-GB-RyanNeural (British male)
TTS_VOICE = "en-US-ChristopherNeural"

# Whisper model size: tiny, base, small, medium, large
# Larger = more accurate but slower and more memory
WHISPER_MODEL = "base"
# =============================================================================

HEARD_FILE = os.path.join(VOICE_DIR, "heard.txt")
RESPONSE_FILE = os.path.join(VOICE_DIR, "response.txt")
AUDIO_INPUT = os.path.join(VOICE_DIR, "input.wav")
AUDIO_OUTPUT = os.path.join(VOICE_DIR, "output.mp3")

def ensure_dir():
    if not os.path.exists(VOICE_DIR):
        os.makedirs(VOICE_DIR)
        print(f"Created: {VOICE_DIR}")

def record_audio(duration=10, sample_rate=16000):
    """Record audio from microphone."""
    import sounddevice as sd
    import soundfile as sf
    
    print(f"Recording for {duration} seconds... (speak now)")
    print()
    audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype='float32')
    sd.wait()
    print("Recording complete.")
    
    sf.write(AUDIO_INPUT, audio, sample_rate)
    return AUDIO_INPUT

def transcribe_audio():
    """Transcribe audio using Whisper."""
    import whisper
    
    print(f"Loading Whisper model ({WHISPER_MODEL})...")
    model = whisper.load_model(WHISPER_MODEL)
    
    print("Transcribing...")
    result = model.transcribe(AUDIO_INPUT)
    text = result["text"].strip()
    
    # Save transcription for Claude to read
    with open(HEARD_FILE, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print()
    print(f"Heard: {text}")
    print(f"Saved to: {HEARD_FILE}")
    print()
    print("Claude can now read heard.txt")
    return text

async def speak_text(text):
    """Convert text to speech using edge-tts."""
    import edge_tts
    
    print(f"Generating speech with voice: {TTS_VOICE}")
    communicate = edge_tts.Communicate(text, TTS_VOICE)
    await communicate.save(AUDIO_OUTPUT)
    print(f"Saved: {AUDIO_OUTPUT}")
    
    # Play the audio
    print("Playing...")
    if sys.platform == "win32":
        os.system(f'start "" "{AUDIO_OUTPUT}"')
    elif sys.platform == "darwin":
        os.system(f'afplay "{AUDIO_OUTPUT}"')
    else:
        os.system(f'xdg-open "{AUDIO_OUTPUT}"')

def listen():
    """Record and transcribe - Claude can then read heard.txt"""
    ensure_dir()
    
    try:
        duration = int(input("Recording duration in seconds (default 10): ") or 10)
    except:
        duration = 10
    
    record_audio(duration)
    transcribe_audio()

def speak():
    """Speak whatever Claude wrote to response.txt"""
    ensure_dir()
    
    if not os.path.exists(RESPONSE_FILE):
        print(f"No response file found: {RESPONSE_FILE}")
        print()
        print("Claude needs to write a response to this file first.")
        print("Claude can do this with filesystem tools:")
        print('  write_file(path="...response.txt", content="Hello!")')
        return
    
    with open(RESPONSE_FILE, 'r', encoding='utf-8') as f:
        text = f.read().strip()
    
    if not text:
        print("Response file is empty.")
        return
    
    print(f"Claude says: {text[:100]}{'...' if len(text) > 100 else ''}")
    print()
    asyncio.run(speak_text(text))

def chat():
    """Interactive conversation loop."""
    ensure_dir()
    
    print("=" * 50)
    print("CC Voice Chat")
    print("=" * 50)
    print()
    print("This creates a conversation loop:")
    print("  1. You speak (recorded and transcribed)")
    print("  2. Claude reads heard.txt")
    print("  3. Claude writes response.txt")
    print("  4. Response is spoken aloud")
    print()
    print("Press Enter to record, 'q' to quit")
    print("=" * 50)
    
    while True:
        cmd = input("\n[Press Enter to speak, 'q' to quit]: ").strip().lower()
        
        if cmd == 'q':
            break
        
        # Record and transcribe
        record_audio(duration=10)
        transcribe_audio()
        
        print()
        print("-" * 50)
        print("Claude can now read heard.txt")
        print("Waiting for Claude to write response.txt...")
        print("-" * 50)
        input("Press Enter after Claude has responded: ")
        
        # Speak response
        speak()

def main():
    ensure_dir()
    
    if len(sys.argv) < 2:
        print("CC Voice - Hearing and Speech for Claude")
        print()
        print("Usage:")
        print("  python cc_voice.py listen  - Record and transcribe your speech")
        print("  python cc_voice.py speak   - Speak Claude's response.txt")
        print("  python cc_voice.py chat    - Interactive conversation loop")
        print()
        print(f"Files location: {VOICE_DIR}")
        print(f"  heard.txt    - What Claude heard (your transcribed speech)")
        print(f"  response.txt - What Claude wants to say (write here)")
        return
    
    cmd = sys.argv[1].lower()
    
    if cmd == "listen":
        listen()
    elif cmd == "speak":
        speak()
    elif cmd == "chat":
        chat()
    else:
        print(f"Unknown command: {cmd}")
        print("Use: listen, speak, or chat")

if __name__ == "__main__":
    main()
