import {Router } from 'express'
import { searchQueryInQuadrant } from '../controllers/searchController.js';

const searchRouter  = Router();


searchRouter.post('/search', searchQueryInQuadrant)


export default searchRouter;
