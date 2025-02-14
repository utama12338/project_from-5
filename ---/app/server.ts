import express from "express";
import cors from "cors";
import router from "./routes/formeRoutes";
import optionRoutes from "./routes/optionselect";
import corsOptions from "./middleware/cors"; // ตรวจสอบให้แน่ใจว่าไฟล์นี้มีอยู่จริง

const app = express(); 

app.use(cors(corsOptions)); 
app.use(express.json());

app.use("/from", router);
app.use("/option", optionRoutes);

const port = process.env.PORT || 4000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
