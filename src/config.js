import dotenv from "dotenv";
dotenv.config();

const config = {
 // dbName: 'ecommerce',
 // dbUser: 'hectorcoderhouse',
 // dbPassword: '5IRPy6soQ0liBnI2',
 dbUrl : process.env.DB_URL,
 sessionSecret: process.env.SESSION_SECRET,

 clientID: process.env.CLIENT_ID,
 clientSecret: process.env.CLIENT_SECRET,
 callbackUrl: process.env.CALLBACK_URL,
};

console.log(process.env.DB_NAME);

export default config;