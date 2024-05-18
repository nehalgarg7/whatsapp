import { Router } from "express";
import { addAudioMessage,
        addImageMessage,
        addMessage,
        getInitialContactsWithMessages,
        getMessages } from "../controllers/MessageController.js";
import multer from "multer";
//import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

const uploadImage= multer({ dest: "uploads/images"});
const uploadAudio= multer({ dest: "uploads/recordings"});

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to",getMessages);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);


router.post("/add-image-message",uploadImage.single("image"),addImageMessage);
// router.post("/add-image-message",upload.fields([
//         {
//                 name: "image",
//                 maxCount: 1
//         }
// ]),addImageMessage);
// one possible error could be image -> message.


router.post("/add-audio-message",uploadAudio.single("audio"),addAudioMessage);

export default router;