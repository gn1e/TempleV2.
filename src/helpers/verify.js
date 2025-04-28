import jwt from "jsonwebtoken";
import User from "../models/user.js";
import functions from "../helpers/functions.js";
import error from "../helpers/error.js";

const verifyToken = async (req, c, next) => {
    const authErr = () => error.createError(
        "errors.com.templev2.common.authorization.authorization_failed",
        `Authorization failed for ${req.originalUrl}`, 
        [req.originalUrl], 1032, undefined, 401, c
    );

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("bearer eg1~")) return authErr();

    const token = authHeader.replace("bearer eg1~", "");

    try {
        const decodedToken = jwt.decode(token);

        if (!global.accessTokens.find(i => i.token === `eg1~${token}`)) throw new Error("Invalid token.");

        if (DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime() <= new Date().getTime()) {
            throw new Error("Expired access token.");
        }

        req.user = await User.findOne({ accountId: decodedToken.sub }).lean();

        if (req.user.banned) return error.createError(
            "errors.com.templev2.account.account_not_active",
            "You have been permanently banned from Jungle.", 
            [], -1, undefined, 400, c
        );

        next();
    } catch {
        const accessIndex = global.accessTokens.findIndex(i => i.token === `eg1~${token}`);
        if (accessIndex !== -1) {
            global.accessTokens.splice(accessIndex, 1);
            functions.UpdateTokens();
        }
        
        return authErr();
    }
};

const verifyClient = async (req, c, next) => {
    const authErr = () => error.createError(
        "errors.com.templev2.common.authorization.authorization_failed",
        `Authorization failed for ${req.originalUrl}`, 
        [req.originalUrl], 1032, undefined, 401, c
    );

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("bearer eg1~")) return authErr();

    const token = authHeader.replace("bearer eg1~", "");

    try {
        const decodedToken = jwt.decode(token);
        const findAccess = global.accessTokens.find(i => i.token === `eg1~${token}`);

        if (!findAccess && !global.clientTokens.find(i => i.token === `eg1~${token}`)) throw new Error("Invalid token.");

        if (DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime() <= new Date().getTime()) {
            throw new Error("Expired access/client token.");
        }

        if (findAccess) {
            req.user = await User.findOne({ accountId: decodedToken.sub }).lean();

            if (req.user.banned) return error.createError(
                "errors.com.templev2.account.account_not_active",
                "You have been permanently banned from Jungle.", 
                [], -1, undefined, 400, c
            );
        }

        next();
    } catch (err) {
        const accessIndex = global.accessTokens.findIndex(i => i.token === `eg1~${token}`);
        if (accessIndex !== -1) global.accessTokens.splice(accessIndex, 1);

        const clientIndex = global.clientTokens.findIndex(i => i.token === `eg1~${token}`);
        if (clientIndex !== -1) global.clientTokens.splice(clientIndex, 1);

        if (accessIndex !== -1 || clientIndex !== -1) functions.UpdateTokens();
        
        return authErr();
    }
};

const DateAddHours = (pdate, number) => {
    const date = new Date(pdate);
    date.setHours(date.getHours() + number);
    return date;
};

export {
    verifyToken,
    verifyClient
};
