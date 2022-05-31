cd $(dirname $0)
cd ..

npm run ci-prettier
npm run ci-lint
npm run ci-test
