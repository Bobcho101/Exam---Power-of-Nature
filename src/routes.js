import { Router } from "express";
import authController from "./controllers/authController.js";
import homeController from "./controllers/homeController.js";
import disastersController from "./controllers/disastersController.js";

const routes = Router();

routes.use(authController);
routes.use(homeController);
routes.use(disastersController);


routes.get('*', (req, res) => {
    res.render('404')
});

export default routes;