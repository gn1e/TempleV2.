import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UpdateTokens = () => {
    fs.writeFileSync("../../tokens/tokens.json", JSON.stringify({
        accessTokens: global.accessTokens || [],
        refreshTokens: global.refreshTokens || [],
        clientTokens: global.clientTokens || []
    }, null, 2));
};


const MakeID = () => {
    return uuidv4();
};


const DecodeBase64 = (str) => {
    return Buffer.from(str, 'base64').toString();
};

export default {
    UpdateTokens,
    MakeID,
    DecodeBase64
};
