import { Router } from "express";
const homeController = Router();

homeController.get('/', (req, res) => {
    return res.render('home');
});

export default homeController;