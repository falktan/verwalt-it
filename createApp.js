import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import apiRouter from './api/index.js';
import 'dotenv/config';


const port = process.env.PORT || 3000;

export default function createApp() {
    const app = express();

    // Enforce HTTPS in production, by redirecting HTTP requests to HTTPS
    // This is tailored to how Heroku handles SSL termination
    // See: https://stackoverflow.com/questions/34862065/force-my-heroku-app-to-use-ssl-https
    // See: https://jaketrent.com/post/https-redirect-node-heroku/
    // See: heroku documentation: https://devcenter.heroku.com/articles/http-routing#heroku-headers
    if(process.env.NODE_ENV === 'production') {
        app.use((req, res, next) => {
            if (req.header('x-forwarded-proto') !== 'https') {
                res.redirect(301, `https://${req.header('host')}${req.url}`)
            } else {
                next()
            }
        })
    }
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static('public/hochschule-schmalkalden/fak-elektrotechnik/antrag-ausgabe-bachelorarbeit',
        { extensions: ['html'] }));
    app.use('/api', apiRouter);
    app.set('port', port);

    return app;
}
