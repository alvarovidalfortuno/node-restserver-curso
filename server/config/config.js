/**
 * ===========================================
 * Puerto
 * ===========================================
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * ===========================================
 * Entorno Desarrollo
 * ===========================================
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/**
 * ===========================================
 * Base de Datos
 * ===========================================
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/dbcafe';

} else {

    urlDB = 'mongodb+srv://m001-student:m001-mongodb-basics@hinotoracluster-j0ao3.mongodb.net/cafe?retryWrites=true';
}

process.env.URLDB = urlDB;