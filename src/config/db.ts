import mongoose from "mongoose";
import colors from "colors";
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL as string)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        console.log(colors.red.bold('Error al conectar a MongoDB'))
        exit(1)
    }
}  