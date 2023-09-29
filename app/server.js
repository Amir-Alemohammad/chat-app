const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const ExpressEjsLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const { AllRoutes } = require("./router/router");
const { ErrorController } = require("./controllers/errorHandler.controller");

dotenv.config();

module.exports = class Application{
    #app = express()
    #PORT;
    constructor(port){
        this.#PORT = port
        this.configApplication()
        this.initTemplateEngin()
        this.createRoutes()
        this.handleErrors()
    }
    configApplication(){
        this.#app.use(express.static(path.join(process.cwd(),"public")))
        this.#app.use(express.urlencoded({extended:false}))
        this.#app.use(express.json())
        this.#app.listen(this.#PORT,() => console.log(`Server Running on Port ${this.#PORT}`));
    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }
    initTemplateEngin(){
        this.#app.use(ExpressEjsLayouts);
        this.#app.set("view engin","ejs");
        this.#app.set("views","resource/views");
        this.#app.set("layout","./layouts/mainLayout.ejs");
        this.#app.set("layout extractStyles",true);
        this.#app.set("layout extractScripts",true);
    }
    handleErrors(){
        this.#app.use(ErrorController.get404)
    }
}