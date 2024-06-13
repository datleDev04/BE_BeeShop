
import mongoose from "mongoose";
import environment from "./enviroment.js";

const connectDatabase = () => {
    mongoose
      .connect(environment.db.url)
      .then(() => {
        console.log("DATABASE connect success !!!");
        // console.log(environment.db.url)
      })
      .catch((error) => {
        console.log("DATABASE connect failed !!!",error);
      });
  };

export default connectDatabase;