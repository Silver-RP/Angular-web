import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import exphbs, { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin/routes';
import appRoutes from './routes/app/routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import  CheckRole  from './middlewares/checkRole';
import AuthMiddleware from './middlewares/AuthMiddleware';

dotenv.config();

const app: Express = express();

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  app.use(cookieParser());

  app.use('/app/assets/images',  express.static(path.join(__dirname, 'public/app/assets/images')));

const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.use('/admin', express.static(path.join(publicPath, 'admin')));
app.use('/app', express.static(path.join(publicPath, 'app/assets')));

app.use((req, res, next) => {
    res.locals.userLogged = req.session.user || null;
    next();
});

// Define your routes
app.use('/admin', CheckRole(['admin']),  adminRoutes);
app.use('/', appRoutes);

export default app;
