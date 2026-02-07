import authMiddleware from "../middleware/authMiddleware.js";

router.post("/generate-image", authMiddleware, generateImage);
