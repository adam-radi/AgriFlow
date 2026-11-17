@echo off
title AgriFlow - API Backend
cd /d "C:\Users\nn\OneDrive\Desktop\AgriFlow\agriflow-api"
echo Demarrage de l'API AgriFlow sur http://localhost:8000 ...
php artisan serve --host=127.0.0.1 --port=8000
pause
