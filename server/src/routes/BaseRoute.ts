import { BaseActions } from '@services';
import { Request, Response, Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';

export class BaseRouter<T> {
    router: Router;
    entityName: string;
    service: BaseActions<T>;

    constructor(service: BaseActions<T>) {
        this.service = service;
        this.router = Router();
        this.init();
    }

    public async getList(req: Request, res: Response, next) {
        try {
            var params = req.query;
            const data = await this.service.getList();
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public async getItem(req: Request, res: Response, next) {
        try {
            const id = req.params["id"];
            const data = await this.service.getById(parseInt(id));
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public async deleteItem(req: Request, res: Response, next) {
        try {
            const id = req.params["id"];
            const data = await this.service.delete(parseInt(id));
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public async updateItem(req: Request, res: Response, next) {
        try {
            const values = req.body;
            const data = await this.service.save(values);
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public async createItem(req: Request, res: Response, next) {
        try {
            var values = req.body;
            const data = await this.service.save(values);
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    async init() {
        this.router.get('/', this.getList.bind(this));
        this.router.get('/:id', this.getItem.bind(this));
        this.router.delete('/:id', [checkJwt], this.deleteItem.bind(this));
        this.router.patch('/', [checkJwt], this.updateItem.bind(this));
        this.router.post('/', [checkJwt], this.createItem.bind(this));
    }
}