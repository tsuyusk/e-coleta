import express from "express";
import multer from "multer";
import { celebrate, Joi } from "celebrate";

import multerConfig from "./configs/multer";
import ItemsController from "./controllers/itemsController";
import PointsController from "./controllers/pointsController";

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get("/items", itemsController.index);

routes.get("/points", pointsController.index);
routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string()
          .required()
          .regex(/^(\w,){1,5}(\w)$/),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.create
);
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
