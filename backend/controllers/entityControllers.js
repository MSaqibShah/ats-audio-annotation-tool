const EntityModel = require("../models/Entity");

const entityControllers = {
  getSingleEntity: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const entity = await EntityModel.findById(req.params.id);
      if (!entity) {
        return res
          .status(404)
          .json({ message: "entity not found", id: req.params.id });
      }
      res.status(200).json({ message: "success", entity: entity });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllEntities: async (req, res) => {
    try {
      const entities = await EntityModel.find();
      res.status(200).json({ message: "success", entities: entities });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateSingleEntity: async (req, res) => {
    id = req.params.id;
    if (id.length != 24) {
      return res.status(400).json({ message: "invalid id" });
    }

    try {
      const entity = await EntityModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!entity) {
        return res
          .status(404)
          .json({ message: "entity not found", id: req.params.id });
      }
      res.status(200).json(entity);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Entity already exists" });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteSingleEntity: async (req, res) => {
    try {
      const entity = await EntityModel.findByIdAndDelete(req.params.id);
      if (!entity) {
        return res
          .status(404)
          .json({ message: "entity not found", id: req.params.id });
      }
      res.status(200).json({ message: "Entity deleted", entity: entity });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  createEntity: async (req, res) => {
    try {
      const entity = await EntityModel.create(req.body);
      res.status(201).json({ message: "Entity created", entity: entity });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({ message: "Entity already exists" });
      }
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = entityControllers;
