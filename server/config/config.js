/**
 * ===========================================
 * Puerto
 * ===========================================
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * ===========================================
 * Entorno 
 * ===========================================
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * ===========================================
 * Vencimiento del token
 * ===========================================
 * 60 sec
 * 60 min
 * 24 h
 * 30 d
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/**
 * ===========================================
 * SEED de autenticación
 * ===========================================
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * ===========================================
 * Base de Datos
 * ===========================================
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb+srv://m001-student:m001-mongodb-basics@hinotoracluster-j0ao3.mongodb.net/cafe?retryWrites=true';
    //urlDB = 'mongodb://localhost:27017/dbcafe';

} else {

    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;