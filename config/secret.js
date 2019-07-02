module.exports = {
    database: process.env.DATABASE_URL || "mongodb://localhost/HMS" ,
    port: process.env.PORT|| 3031
}