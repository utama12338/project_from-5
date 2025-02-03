import express from "express"
 const app =express()

app.use(express.json())

import router from "./routes/formeRoutes.js"
import optionRoutes from "./routes/optionselect.js"
app.use("/from", router)

app.use("/option", optionRoutes)

const port = process.env.port|| 4000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)

})