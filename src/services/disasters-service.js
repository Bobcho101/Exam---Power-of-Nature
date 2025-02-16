import Disaster from "../models/DisasterModel.js";

export async function createDisaster(data) {
    return await Disaster.create(data);
}

export async function getDisasters() {
    return await Disaster.find();
}


export async function getOneDisaster(disasterId) {
    return await Disaster.findOne({'_id': disasterId});
}

export async function updateOneDisaster(disasterId, newData) {
    await Disaster.findByIdAndUpdate(disasterId, newData, { runValidators: true });
}

export async function deleteOneDisaster(disasterId){
    await Disaster.findByIdAndDelete(disasterId);
}

export function getType(selectedCategory){
    const typesMap = {
        'Wildfire': 'Wildfire',
        'Flood': 'Flood',
        'Earthquake': 'Earthquake',
        'Hurricane': 'Hurricane',
        'Drought': 'Drought',
        'Tsunami': 'Tsunami',
        'Other': 'Other',
    };

    const types = Object.keys(typesMap).map(value => ({
        value,
        label: typesMap[value],
        selected: value === selectedCategory ? "selected" : "",
    }));
    
    return types;
}


export async function getDisastersFiltered(filter = {}) {
    const query = {};

    if(filter.name){
        query.name = {$regex: filter.name, $options: "i"};
    }

    if(filter.type){
        query.type = filter.type;
    }


    try {
        const result = await Disaster.find(query);   
        return result;
    } catch (err) {
        console.log(err.message);
    }
}