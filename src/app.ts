import * as dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import ApiRoutes from "./routes/api.routes";

export default class App {
    private app: Application;
    private PORT: any;

    constructor() {
        this.app = express();
        this.initEnv();
        this.settings();
        this.routes();
    }

    private initEnv() {
        dotenv.config();
        this.PORT = process.env.PORT;
    }

    private settings() {
        this.app.set("port", this.PORT || 3000);
        this.app.use(express.json());
        this.app.use(cors());
    }

    private routes() {
        this.app.use("/api", ApiRoutes);
    }

    async listen() {
        const PORT: number | String = this.app.get("port");

        await this.app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    }

    getExpressInstance(): Application {
        return this.app;
    }
}