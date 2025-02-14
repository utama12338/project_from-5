import express from "express"
import cors from 'cors'; // นำเข้า cors
import {  
    createfrome,
    getforme,
    getSystemById,
    updateforme,
    deletefrome,
    checkExistingSystem,
    searchSystems
} from "../controllers/formeController"

const router = express.Router()
// const app = express();
// app.use(express.json());


router.post("/createforme",  createfrome)

router.get("/getforme", getforme)
router.get("/getSystemById/:id", getSystemById)

router.delete('/deletefrome/:id',deletefrome)

router.put('/updateforme/:id', updateforme)


//  csv check
router.get('/api/system/check', checkExistingSystem)

//  search
router.get('/search', searchSystems)

export default router