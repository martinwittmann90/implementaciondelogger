/* -------------IMPORTS-------------*/
import MongoStore from 'connect-mongo';
import express from 'express'
import exphbs from "express-handlebars";
import session from 'express-session';
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import viewsRouter from "./routes/view.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import chatRouter from "./routes/chat.routes.js"
import sessionsRouter from "./routes/sessions.routes.js";
import mockRouter from './routes/mock.routes.js';
import messageandmailRouter from './routes/messageandmail.routes.js'
import websockets from "./config/sockets.config.js";
import { connectMongo } from "./config/configMongoDB.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initPassport from "./config/passport.config.js";
import "./config/passport.config.js";
import { __dirname } from "./configPath.js";
import config from "./config/envConfig.js";
import errorHandler from "./middleware/error.js";
import { logger } from './utils/logger.js'


/*-------CONFIG BASICAS Y CONEXION A BD-------*/
const app = express();
const port = config.port;

/*-------SETTING MIDDLEWARES-------*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/*-------SETTING HANDLEBARS-------*/
app.engine ('handlebars', exphbs.engine());
app.set('views',__dirname + "/views");
app.set("view engine", "handlebars");

/*-------SERVIDORES-------*/
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);
const server = httpServer.listen(port, () =>{
  // Conexión a DB Atlas.
  connectMongo()
    .then(() => {
      logger.info('☁ Connected to MongoDB');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB:', error);
      throw 'Cannot connect to the database';
    });
    logger.info(`📢 Server listening on port: ${port}`);
});
server.on("error", (error) => console.log(error));

/*-------SESSION-------------*/
app.use(cookieParser("mySecret"));

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const DB_NAME = process.env.DB_NAME;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(
  session({
    store: MongoStore.create({  
       mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@projectmartinwittmann.l8a7l5b.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, 
       mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
       ttl: 60 * 10 
      }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized:true
})
);
/*-------PASSPORT-------------*/
initPassport();
app.use(passport.initialize());
app.use(passport.session());

/*-------PLANTILLAS-------*/
app.use('/', viewsRouter); 
app.use('/realtimeproducts', viewsRouter); 
app.use('/products', viewsRouter);
app.use("/chat", chatRouter);
app.use('/carts', cartsRouter);
app.use("/auth/profile", sessionsRouter);
app.use("/", messageandmailRouter);
app.use('/', mockRouter);
/*-------END POINTS-------*/
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.get('/*', async (req, res) => {
  res.render("notfound");
})
/*-------Error handler-------*/
app.use(errorHandler);

