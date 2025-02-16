import { Router } from "express";
import { createDisaster, deleteOneDisaster, getDisasters, getDisastersFiltered, getOneDisaster, getType, updateOneDisaster } from "../services/disasters-service.js";
import { isUser } from "../middlewares/auth-middleware.js";
const disastersController = Router();

disastersController.get('/search', async (req, res) => {
    const query = req.query;

    try{
        const disasters = await getDisastersFiltered(query);
        return res.render('search', { disasters, name: query.name});
    } catch(err){
        console.log(err.message);
    }
    
});

disastersController.get('/interest/:disasterId', isUser, async (req, res) => {
    const disasterId = req.params.disasterId;
    try{
        const disaster = await getOneDisaster(disasterId);
        if(disaster.owner.toString() === req.user.id){
            return res.redirect('/404');
        }
        if(disaster.interestedList.includes(req.user.id)){
            return res.redirect('/404');
        }
        disaster.interestedList.push(req.user.id);
        await disaster.save();
        

        return res.redirect(`/disasters/${disasterId}/details`);
    } catch(err){
        console.log(err.message);
    }
});

disastersController.get('/disasters/:disasterId/delete', isUser, async (req, res) => {
    const disasterId = req.params.disasterId;
    try{
        const disaster = await getOneDisaster(disasterId);
        if(disaster.owner.toString() !== req.user.id){
            return res.redirect('/404');
        }
        await deleteOneDisaster(disasterId);
        return res.redirect('/disasters'); 
    } catch(err){
        console.log(err.message);
    }
});

disastersController.get('/disasters/:disasterId/edit', isUser, async (req, res) => {
    const disasterId = req.params.disasterId;
    try{
        const disaster = await getOneDisaster(disasterId);
        if(disaster.owner.toString() !== req.user.id){
            return res.redirect('/404');
        }
        const types = getType(disaster.type);
        return res.render('edit', { disaster, types });
    } catch(err){
        console.log(err.message);
    }
});

disastersController.post('/disasters/:disasterId/edit', isUser, async (req, res) => {
    const disasterId = req.params.disasterId;
    const data = req.body;
    try{
        const disaster = await getOneDisaster(disasterId);   
        if(disaster.owner.toString() !== req.user.id){
            return res.redirect('/404');
        }
        await updateOneDisaster(disasterId, data);
        return res.redirect(`/disasters/${disasterId}/details`)
    } catch(err){
        console.log(err.message);
        const types = getType(data.type);
        return res.render('edit', { error: err.message, data, types })
    }
});

disastersController.get('/disasters/:disasterId/details', async (req, res) => {
    const disasterId = req.params.disasterId;
    
    try{
        const disaster = await getOneDisaster(disasterId);
        let isOwner;
        let interested;
        if(!req.user){
            isOwner = false;
        } else{
            if(req.user.id === disaster.owner.toString()){
                isOwner = true;
            } else{
                isOwner = false;
            }

            if(disaster.interestedList.includes(req.user.id)){
                interested = true;
            } else{
                interested = false;
            }
        }
        return res.render('details', { disaster, isOwner, interested })
    } catch(err){
        console.log(err.message);
    }
});

disastersController.get('/disasters', async (req, res) => {
    try{
        const disasters = await getDisasters();
        return res.render('catalog', { disasters })
    } catch(err){
        console.log(err.message);
    }
});


disastersController.get('/create', isUser, (req, res) => {
    return res.render('create');
});

disastersController.post('/create', isUser, async (req, res) => {
    const data = req.body;
    try{
        data.owner = req.user.id;
        await createDisaster(data);
        return res.redirect('/disasters');
    } catch(err){
        console.log(err.message);
        const types = getType(data.type);
        return res.render('create', { error: err.message, data, types });
    }
});

export default disastersController;