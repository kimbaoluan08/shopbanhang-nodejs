const HomeRouter = require('./home');
const ProductRouter = require('./product');
const AdminRouter = require('./admin');
const CategoryRouter = require('./category');
const BrandRouter = require('./brand');
const UserRouter = require('./user');

function route(app) {
    app.use('/admin/product', ProductRouter);
    app.use('/admin/brand', BrandRouter);
    app.use('/admin/category', CategoryRouter);
    app.use('/admin', AdminRouter);
    app.use('/user', UserRouter);
    app.use('/', HomeRouter);
    
    app.use((req, res, next) => {
        res.status(404).send('Not Found');
    });
}

module.exports = route;