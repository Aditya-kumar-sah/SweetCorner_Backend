const {Router} = require("express");
const { AdminAuth, UserAuth} = require("../middleware/auth.middleware");
const {addSweet,getSweets,searchSweets,updateSweet,deleteSweet,purchaseSweet,restockSweet } = require("../controller/sweet.controller")

const router = Router();

router.post("/",AdminAuth,addSweet);
router.get("/",UserAuth,getSweets);
router.get("/search",UserAuth,searchSweets);
router.put("/:id",AdminAuth,updateSweet);
router.delete("/:id",AdminAuth,deleteSweet);
router.post("/:id/purchase",UserAuth,purchaseSweet);
router.post("/:id/restock",AdminAuth,restockSweet);

module.exports = router