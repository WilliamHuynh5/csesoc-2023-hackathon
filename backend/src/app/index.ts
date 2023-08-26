import express, { json, Request, Response } from 'express';
import { DEBUG } from '../../shared/constants';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from './errorHandler';
import { login, logout, profile, register } from '../controllers/auth';
import { itineraryGenerate, addItineraryReview, itineraryView, viewItineraryReviews, uploadItineraryPhoto, viewItineraryPhotos, viewLocationItinerarys } from '../controllers/itinerary';
import authorisation from './authorisation';
import { getData, getDataAsJson } from './data';
import expressAsyncHandler from 'express-async-handler';

export const app = express();
app.use(json());
app.use(cors());
DEBUG && app.use(morgan('dev'));

// ========================================================================= //
// Public routes
// ========================================================================= //

app.get('/', (req: Request, res: Response) => {
  res.json(`Welcome to our Hackathon Project! Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`);
});

app.get('/export/data.json', (req: Request, res: Response) => {
  const data = getDataAsJson();
  console.log(data);
  console.log(getData());
  res.json(data);
});

app.post('/register', (req: Request, res: Response) => {
  res.json(register(req.body.email, req.body.password));
});

app.post('/login', (req: Request, res: Response) => {
  res.json(login(req.body.email, req.body.password));
});

// ========================================================================= //
// Protected routes
// ========================================================================= //

app.use(authorisation());

app.get('/profile', (req: Request, res: Response) => {
  res.json(profile(res.locals.user, req.query.userId as string));
});

app.post('/logout', (req: Request, res: Response) => {
  res.json(logout(res.locals.sessionId));
});

app.post('/itinerary/generate', expressAsyncHandler(async (req: Request, res: Response) => {
  res.json(await itineraryGenerate(res.locals.user, req.body.plan));
}));

app.get('/itinerary/:id', (req: Request, res: Response) => {
  res.json(itineraryView(res.locals.user, req.params.id));
});

app.get('/itinerary/view/location/itineraries', (req: Request, res: Response) => {
  res.json(viewLocationItinerarys(res.locals.user, req.query.dest as string));
});

app.post('/itinerary/:id/review', (req: Request, res: Response) => {
  res.json(addItineraryReview(res.locals.user, req.params.id, req.body.rating, req.body.comment));
});

app.get('/itinerary/:id/reviews', (req: Request, res: Response) => {
  res.json(viewItineraryReviews(res.locals.user, req.params.id));
});

app.post('/itinerary/:id/photo', (req: Request, res: Response) => {
  res.json(uploadItineraryPhoto(res.locals.user, req.params.id, req.body.url, req.body.caption));
});

app.get('/itinerary/:id/photos', (req: Request, res: Response) => {
  res.json(viewItineraryPhotos(res.locals.user, req.params.id));
});

app.use(errorHandler());
