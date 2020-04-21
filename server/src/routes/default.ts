import { Router, Request, Response } from 'express';
import { BaseRouter } from './BaseRoute';
import { BaseActions, Services } from '@services';
import { Default } from '@models';


export class DefaultRouter extends BaseRouter<Default> {
    router: Router

    constructor() {
        super(Services.Default);
    }
}