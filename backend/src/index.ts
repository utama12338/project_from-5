import express from "express"
 const app =express()

app.use(express.json())

import userRoutes from "./routes/formeRoutes.js"

app.use("/from", userRoutes)

const port = process.env.port|| 4000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)

})