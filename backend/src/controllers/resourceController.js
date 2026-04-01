import Resource from "../models/Resource.js";

export async function listResources(req, res, next){
  try{
    const items = await Resource.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(items);
  }catch(err){ next(err); }
}

export async function createResource(req, res, next){
  try{
    const { name, type, location } = req.body;
    const item = await Resource.create({ name, type, location, createdBy: req.user._id });
    res.status(201).json(item);
  }catch(err){ next(err); }
}
