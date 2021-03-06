[![CircleCI](https://circleci.com/gh/aconfee/payr-api.svg?style=svg)](https://circleci.com/gh/aconfee/payr-api)

# Payr
###### payr.us-west-2.elasticbeanstalk.com/graphiql

### Description
API is independent of front end. Using GraphQL and Apollo to expose to consuming clients for maximum flexibility and reduced dependencies. 

### Setup

Assuming you're starting from scratch, here's how to set everything up for development. 
1. Clone and download this repo. 
2. Run `npm install` to download dependencies.
3. Happy developing! 

### Stack
* Node / Express (generated from Express generator https://expressjs.com/en/starter/generator.html)
* Sequelize ORM
* Typescript

### Environment and Workflow
* `npm start` to start running on port 8080.
* `npm test` to run all unit tests.
* `npm run build` compiles and builds
* `npm start-prod` runs from the build folder.
* .vscode/launch.json included with VS Code defaults.### Git branching

### Git branching

* Checkout `develop` branch. 
* Branch your feature off of develop. 
* After feature is tested locally, create a pull request. 
* Pull request must be approved and have all CI checks passing before it can merge. (This is enforced automatically.)
* Merge feature to develp when conditions met.
* Develop will be merged to master (which is live) when develop's build and deploy status is good (enforced), and the develop environment, dev.tinycrit.com, is manually tested. 
* Merging with dev and master will automatically deploy to each respective environment. 

### Build

Currently, no building is necessary. 

### Deploy

Simply push to, or merge a commit to the master branch. 

This repo is being watched by CircleCI https://circleci.com/gh/aconfee/payr-api. It will be deployed to the tinycrit-prod Elastic Beanstalk environment and live on api.tinycrit.com. 

### Architecture
* Served on Elastic Beanstalk
* This repo is the API only. No view is served from here.  