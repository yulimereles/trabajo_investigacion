const { Router } = require("express");

const {
  indexView, 
  createView, 
  index,
  show,
  update,
  store,
  destroy,
} = require("../controllers/galeria.controllers");

const router = Router();

//Vistas
router.get("/", indexView);
router.get("/crear", createView);

// API CRUD
router.get("/api", index);
router.get("/api/:id/show", show);
router.post("/api", store);
router.put("/api/:id/update", update);
router.delete("/api/:id/destroy", destroy);

module.exports = router;