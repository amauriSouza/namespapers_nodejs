const restify = require('restify');
// package definir errors
const errs = require('restify-errors');

// create server restify
const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

//package para manipulacao sql
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'db'
    }
});

// plugins para receber dados de uma requisicao
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//start o serviço
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

// rotas rest

// ponto de entrada
server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
}));

// read chamada de leitura
server.get('/read', function (req, res, next) {
    knex('rest').then((dados) => {
        res.send(dados);
    }, next);
    return next();
});

//create new data
server.post('/create', function (req, res, next) {
    knex('rest')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);
        }, next);
});

// show de item especifico
server.get('/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError("Nada foi encontrado!"))
            res.send(dados);
        }, next);
});

// update data
server.put('/update/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError("Nada foi encontrado!"))
            res.send("dados atualizados");
        }, next);
});

// delete
server.del('/delete/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError("Nada foi encontrado!"))
            res.send("exclusao feita com sucesso");
        }, next);
});

