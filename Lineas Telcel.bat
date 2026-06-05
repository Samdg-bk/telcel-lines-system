@echo off

echo Iniciando backend...

cd /d C:\Users\alexy\OneDrive\Escritorio\telcel-lines-system
start cmd /k "npm run start:dev"

timeout /t 5

echo Iniciando frontend...

cd /d C:\Users\alexy\OneDrive\Escritorio\telcel-lines-frontend
start cmd /k "npm run dev"

timeout /t 5

start http://localhost:4000/