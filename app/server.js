const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const ExpressEjsLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const { AllRoutes } = require("./router/router");
const { ErrorController } = require("./controllers/errorHandler.controller");
const { default: mongoose } = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc")
const http = require("http");
const { initialSocket } = require("./utils/initSocket");
const { socketHandler } = require("./socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { clientHelper } = require("./utils/function");

dotenv.config();

module.exports = class Application{
    #app = express()
    #PORT;
    #DB_URI;
    constructor(PORT,DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI
        this.configApplication()
        this.initClientSession()
        this.configDataBase()
        this.initTemplateEngin()
        this.createRoutes()
        this.handleErrors()
    }
    configApplication(){
        this.#app.use(express.static(path.join(process.cwd(),"public")))
        this.#app.use(express.urlencoded({extended:false}))
        this.#app.use(express.json())
        const server = http.createServer(this.#app)
        server.listen(this.#PORT,() => console.log(`Server Running on Port ${this.#PORT}`))
        const io = initialSocket(server);
        socketHandler(io);
        //Swagger Open Api
        this.#app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerJsDoc({
            swaggerDefinition:{
                openapi : "3.0.1",
                info: {
                    title: "Chat App",
                    version: "2.0.0",
                    description: "Chat App",
                    contact:{
                        name: "Amir-Alemohammad",
                        email: "amirho3inalemohammad@gmail.com",
                    }
                },
                servers:[
                    {
                        url: "http://localhost:3000"
                    },
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    }
                },
                security: [{
                    bearerAuth : []
                }]
            },
            apis: ["./app/router/*/*.js"],
        }),{explorer:true}));
    }
    initClientSession(){
        this.#app.use(cookieParser(process.env.COOKIE_SECRET))
        this.#app.use(session({
            secret: process.env.COOKIE_SECRET,
            resave: true,
            saveUninitialized: true,
            cookie: {
              secure: true
            }
        }));
    }
    async configDataBase(){
        mongoose.set("strictQuery",false);
        try {
            const conn = await mongoose.connect(this.#DB_URI)
            console.log(`mongoDB Connected: http://${conn.connection.host}:${this.#PORT}`)
            process.on("SIGINT",async () => {
                await mongoose.connection.close();
                process.exit(0) //exit with success
            });
        } catch (err) {
            console.log(err)
            process.exit(1) // exit with failure
        }
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
        this.#app.use((req,res,next) => {
            this.#app.locals = clientHelper(req,res,next);
            next();
        })
    }
    handleErrors(){
        this.#app.use(ErrorController.get404)
    }
}