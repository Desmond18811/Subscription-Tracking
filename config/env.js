 import {config} from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARJECT_API_KEY,
    ARJECT_ENVIRONMENT,
    QSTASH_URL,
    QSTASH_TOKEN,
    SERVER_URL, EMAIL_PASSWORD
} = process.env
