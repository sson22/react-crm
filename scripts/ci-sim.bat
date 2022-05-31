@echo off
cd /D "%~dp0"
cd ..

call npm run ci-prettier
call npm run ci-lint
call npm run ci-test
