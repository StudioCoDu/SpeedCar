@echo off
cd /d "%~dp0"
call npm run android:sync
cd android
call gradlew.bat assembleDebug
echo.
echo APK ready:
echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk
pause
