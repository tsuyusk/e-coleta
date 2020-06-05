import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  async index(req: Request, res: Response) {
    try {
      const { city, uf, items } = req.query;

      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      const points = await knex("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");

      const serializedPoints = points.map((point) => ({
        ...point,
        image_url: `http://192.168.0.10:3333/uploads/${point.image}`,
      }));

      return res.json(points);
    } catch (error) {
      console.log(error);
    }
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex("points").where("id", id).first();
    if (!point) {
      return res.status(400).json({ message: "Point not found" });
    }
    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.10:3333/${point.image}`,
    };
    return res.json({ point: serializedPoint });
  }
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      } = req.body;

      const point = {
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      const trx = await knex.transaction();

      const insertedIds = await trx("points").insert(point);

      const point_id = insertedIds[0];

      const pointItems = items
        .split(",")
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => ({
          item_id,
          point_id,
        }));

      await trx("point_items").insert(pointItems);

      await trx.commit();

      return res.json({
        id: point_id,
        ...point,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default PointsController;
