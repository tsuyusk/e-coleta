import express from "express";

import ItemsController from "./controllers/itemsController";
import PointsController from "./controllers/pointsController";

const routes = express.Router();

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get("/items", itemsController.index);

routes.get("/points", pointsController.index);
routes.post("/points", pointsController.create);
routes.get("/points/:id", pointsController.show);

/**
 * Padrão de controllers
 * Index => listar
 * Show => Mostrar um único index
 * (Create) / store => criar
 * Update => dar update
 * (Delete) / destroy => dar delete
 */

export default routes;

/** Alguns patterns
 * Service pattern
 * Data mapper
 */
