const {Router} = require("express");
const { AdminAuth, UserAuth} = require("../middleware/auth.middleware");
const {addSweet,getSweets,searchSweets,updateSweet,deleteSweet,purchaseSweet,restockSweet } = require("../controller/sweet.controller");
const upload = require("../middleware/upload.middleware");

const router = Router();

router.post("/",AdminAuth,upload.single("file"),addSweet);
router.get("/",UserAuth,getSweets);
router.post("/search",UserAuth,searchSweets);
router.put("/:id",AdminAuth,upload.single("file"),updateSweet);
router.delete("/:id",AdminAuth,deleteSweet);
router.post("/:id/purchase",UserAuth,purchaseSweet);
router.post("/:id/restock",AdminAuth,restockSweet);

module.exports = router