@echo off
cd /D "%~dp0"
cd ..

call npm i
cd client
call npm i
cd ..

call npm i --save-dev cross-env @types/bson
call npm i -G nodemon typescript
