const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: "Generate pay slip",
        description: "version 2.0"
    },
    host: "pay-slip.onrender.com",
    basePath: '/',
    schemes:['http','https'],
    consumes:['application/json'],
    produces:['application/json']
}
const outputFile = "./swagger-output.json";
const routes = ["./main.js"];
swaggerAutogen(outputFile, routes, doc);