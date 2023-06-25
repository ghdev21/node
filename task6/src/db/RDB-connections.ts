import {Pool} from 'pg'

const config =  {
    user: 'node_gmp',
    password: 'password123',
    host: 'postgres'
};
export const pool = new Pool(config);
export const connectToDB = async () => {
    try {
        await pool.connect();
    } catch (e) {
        console.error(e)
        throw new Error('could not connect to the db')
    }
}

