import subprocess
import os
import sys

def run_backend():
    backend_path = os.path.join("front", "backend")
    subprocess.Popen(["uvicorn", "main:app", "--reload"], cwd=backend_path, shell=sys.platform.startswith('win'))

def run_frontend():
    frontend_path = os.path.join("front", "react-frontend")
    subprocess.Popen(["npm", "start"], cwd=frontend_path, shell=sys.platform.startswith('win'))

if name == "main":
    print("Starting servers...")
    run_backend()
    run_frontend()
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("\nServers stopped.")
