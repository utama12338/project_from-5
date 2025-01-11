import express from "express"
import {  createforme,updateforme_draft,getformedraft,getformesoftdelete_Count,getformedraft_Count,cancelSoftDelete,deleteforme,createpublish , getforme , getSystemById,createDraft, softdeleteforme, updateforme } from "../controllers/formeController"
const router = express.Router()
import cors from 'cors'; // นำเข้า cors
router.use(cors()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้


router.post("/createforme", createforme)
router.post("/createDraft",createDraft)
router.post("/createpublish/:id", createpublish)



router.get("/getforme", getforme)
router.get("/getformedraft", getformedraft)
router.get("/getSystemById/:id", getSystemById)
router.get("/getformedraft_Count", getformedraft_Count)
router.get("/getformesoftdelete_Count", getformesoftdelete_Count)

router.delete('/softdeleteforme/:id',softdeleteforme)
router.delete('/deleteforme/:id',deleteforme)

router.put('/cancelSoftDelete/:id', cancelSoftDelete)
router.put('/updateforme/:id', updateforme)
router.put('/updateforme_draft/:id', updateforme_draft)


export default router