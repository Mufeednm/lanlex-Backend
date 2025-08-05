import { Router } from "express";
import { login, resendotp, signin, verifyotp } from "../Controller/Auth/login.js";
import { allLanguages } from "../Controller/Home/language.js";
import authenticate from "../middleware/authenticate.js";
import { userKid_Registration, userkid_list } from "../Controller/Home/userKid.js";
import { uploadUserKidProfile } from "../../config/multerConfig.js";
import { primaryCategory, secondaryCategory } from "../Controller/Category/category.js";
import { knowledgeZip, quizZip, storyZip } from "../Controller/thirdStage.js";


const router =Router()







router.post('/api/login',login); 
router.post('/api/signin',signin); 
router.post('/api/verifyotp', verifyotp);
router.post('/api/resendotp', resendotp);

router.get('/api/languagelist', allLanguages); 



router.post('/api/userkid',authenticate, uploadUserKidProfile.single('image') ,userKid_Registration); 
router.get('/api/userkid-list',authenticate ,userkid_list); 


// finding what Category
router.get('/api/primary/:id' ,primaryCategory); 
 


// finding secondry  Category  from first 
router.get('/api/secondary/:id' ,secondaryCategory); 

router.post('/api/quiz-zip',quizZip); 
router.post('/api/story-zip',storyZip); 
router.post('/api/knowledge-zip',knowledgeZip); 

export default router  