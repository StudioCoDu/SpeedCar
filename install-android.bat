@echo off
cd /d "%~dp0"
set "ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if not exist "%ADB%" set "ADB=adb"
"%ADB%" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
pause
