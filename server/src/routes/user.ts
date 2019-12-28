import { UserService } from '@services';
import { Request, Response, Router } from 'express';
import * as shortid from 'shortid';
import { checkJwt } from '../middlewares/checkJwt';

export class UserRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public async getList(req: Request, res: Response, next) {
        try {
            var params = req.query;
            const data = await UserService.getList();
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public async deleteItem(req: Request, res: Response, next) {
        try {
            const id = req.params["id"];
            await UserService.delete(parseInt(id));
            res.status(200).send(null);
        } catch (err) {
            next(err);
        }
    }

    public async updateItem(req: Request, res: Response, next) {
        try {

            const values = req.body;
            const data = await UserService.save(values);
            res.status(200).send(null);
        } catch (err) {
            next(err);
        }
    }

    public async createItem(req: Request, res: Response, next) {
        try {
            var values = req.body;
            // values.id = shortid.generate();
            const data = await UserService.save(values);
            res.status(200).send(values.id);
        } catch (err) {
            next(err);
        }
    }

    async init() {
        this.router.get('/list', this.getList.bind(this));
        this.router.delete('/:id', [checkJwt], this.deleteItem.bind(this));
        this.router.patch('/', [checkJwt], this.updateItem.bind(this));
        this.router.post('/', [checkJwt], this.createItem.bind(this));
    }
}