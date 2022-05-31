@echo off
cd /D "%~dp0"
cd ..

RMDIR /S /Q node_modules
DEL /Q package-lock.json

RMDIR /S /Q client\node_modules
DEL /Q client\package-lock.json

call npm i
cd client
call npm i
cd ..

call npm i --save-dev cross-env @types/bson
call npm i -G nodemon typescript
