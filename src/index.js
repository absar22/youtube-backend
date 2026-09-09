// import dotenv from "dotenv";
// dotenv.config({
//     path: "./.env"
// })
import "dotenv/config";
import connectDB from "./db/db.js";
import { app } from "./app.js";



connectDB()
.then(() => {
    // app.on("error", (err) => {
    //     console.error("Server error:", err);
    // });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.error("Database connection failed |||  ", err);
})


