import { User } from '@models';
import { UserService } from '@services';
import * as bcrypt from "bcryptjs";
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from "jsonwebtoken";
import config from '../config';
import { checkJwt } from '../middlewares/checkJwt';

export class AuthRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            let { username, password, anonymousId } = req.body;
            if (!(username && password)) {
                res.status(400).send();
            }

            let user: User;
            try {
                user = await UserService.getUser(username);
            } catch (error) {
                res.status(401).send();
            }
            if (!user) {
                throw "user not found!";
            }
            var checkPassword = await UserService.checkIfUnencryptedPasswordIsValid(user.Password, password);
            if (!checkPassword) {
                // if (!AuthService.checkIfUnencryptedPasswordIsValid(user.password, password)) {
                res.status(401).send();
                return;
            }

            const token = jwt.sign(
                { userId: user.Id, username: user.Username },
                config.jwtSecret,
                { expiresIn: "20000 days" }
            );
            if (anonymousId) {
                try {
                    const anonymousUser = await UserService.getUser(anonymousId);
                } catch{ }
            }
            res.send({ username, token, userId: user.Id, type: user.Type, name: user.Name, email: user.Email });
        } catch (err) {
            next(err);
        }
    }

    public async facebook(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, name, email, anonymousId } = req.body;
            if (!(id)) {
                res.status(400).send();
            }

            let user: User;
            try {
                user = await UserService.getUser(id);
            } catch (error) {
                res.status(401).send();
            }
            if (!user) {
                user = new User();
                user.Name = name;
                user.Email = email;
                user.Username = id;
                user.Type = "Facebook";
                user = await UserService.save(user);
            }

            const token = jwt.sign(
                { userId: user.Id, username: user.Username },
                config.jwtSecret,
                { expiresIn: "20000 days" }
            );
            if (anonymousId) {
                try {
                    const anonymousUser = await UserService.getUser(anonymousId);
                    
                } catch{ }
            }
            res.send({ id, token, userId: user.Id, type: user.Type, name: user.Name, email: user.Email });
        } catch (err) {
            next(err);
        }
    }

    public async anonymous(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, name } = req.body;
            if (!(id)) {
                res.status(400).send();
            }

            let user: User;
            try {
                user = await UserService.getUser(id);
            } catch (error) {
                res.status(401).send();
            }
            if (!user) {
                user = new User();
                user.Name = name;
                user.Username = id;
                user.Type = "Anonymous";
                user = await UserService.save(user);
            }

            const token = jwt.sign(
                { userId: user.Id, username: user.Username },
                config.jwtSecret,
                { expiresIn: "20000 days" }
            );

            res.send({ id, token, userId: user.Id, type: user.Type, name: user.Name, email: user.Email });
        } catch (err) {
            next(err);
        }
    }

    public async google(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, name, email, anonymousId } = req.body;
            if (!(id)) {
                res.status(400).send();
            }

            let user: User;
            try {
                user = await UserService.getUser(id);
            } catch (error) {
                res.status(401).send();
            }
            if (!user) {
                user = new User();
                user.Name = name;
                user.Email = email;
                user.Username = id;
                user.Type = "Google";
                user = await UserService.save(user);
            }

            const token = jwt.sign(
                { userId: user.Id, username: user.Username },
                config.jwtSecret,
                { expiresIn: "20000 days" }
            );
            if (anonymousId) {
                try {
                    const anonymousUser = await UserService.getUser(anonymousId);
                    
                } catch{ }
            }
            res.send({ id, token, userId: user.Id, type: user.Type, name: user.Name, email: user.Email });
        } catch (err) {
            next(err);
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.jwtPayload.userId;

            const { oldPassword, newPassword } = req.body;
            if (!(oldPassword && newPassword)) {
                res.status(400).send();
            }

            let user: User;
            try {
                user = await UserService.getItem(id);
            } catch (id) {
                res.status(401).send();
            }

            var checkPassword = await UserService.checkIfUnencryptedPasswordIsValid(user.Password, oldPassword);
            if (!checkPassword) {
                res.status(401).send();
                return;
            }

            user.Password = newPassword;
            // const errors = await validate(user);
            // if (errors.length > 0) {
            //     res.status(400).send(errors);
            //     return;
            // }
            //Hash the new password and save
            user.Password = await bcrypt.hashSync(user.Password, 8);
            UserService.save(user);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    public async createItem(req: Request, res: Response, next: NextFunction) {
        try {
            var values = req.body;
            // values.id = shortid.generate();
            values.Password = await bcrypt.hashSync(values.Password, 8);
            await UserService.save(values);
            res.status(200).send(values.id);
        } catch (err) {
            next(err);
        }
    }

    public async check(req: Request, res: Response, next: NextFunction) {
        const token = <string>req.headers["auth"];

        try {
            const jwtPayload = <any>jwt.verify(token, config.jwtSecret);
            res.status(200).send(true);
        } catch (error) {
            res.status(200).send(false);
        }
    }

    public async pushToken(req: Request, res: Response, next: NextFunction) {
        try {

            const values = req.body;
            var payload = res.locals.jwtPayload;
            const data = await UserService.setToken(payload.userId, values.device, values.expo);
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }


    async init() {
        
        this.router.post('/pushtoken', [checkJwt], this.pushToken.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/facebook', this.facebook.bind(this));
        this.router.post('/google', this.google.bind(this));
        this.router.post('/anonymous', this.anonymous.bind(this));
        this.router.post('/create', this.createItem.bind(this));
        this.router.post('/check', this.check.bind(this));
        this.router.post('/change-password', [checkJwt], this.changePassword.bind(this));
    }
}