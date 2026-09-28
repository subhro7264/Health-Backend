const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAgenda, postAgenda, deleteAgenda ,toggleAgenda} = require('../controllers/agendaController');


router.get("/getAgenda", protect, getAgenda);
router.post("/postAgenda", protect, postAgenda);
router.delete("/deleteAgenda/:id", protect, deleteAgenda);
router.put("/toggleAgenda/:id", protect, toggleAgenda);

module.exports = router;

