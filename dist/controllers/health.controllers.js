import { StatusCodes } from "http-status-codes";
import db from "../config/db/knex.js";
export const healthCheck = async (req, res) => {
    try {
        await db.raw('SELECT 1');
        res.json({
            message: '🧙‍♂️ The API lives! Magic is stable and spells are compiling.',
            StatusCodes: StatusCodes.OK,
            status: 'success',
            data: {
                database: 'connected'
            }
        });
    }
    catch (error) {
        res.json({
            message: '🧙‍♂️ The API lives! Magic is stable and spells are compiling.',
            StatusCodes: StatusCodes.SERVICE_UNAVAILABLE,
            status: 'success',
            data: {
                database: 'not connected'
            }
        });
    }
};
