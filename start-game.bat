@echo off
cd /d "%~dp0"
start "Ofek Race Server - keep open" cmd /k node server.js
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:4173"
