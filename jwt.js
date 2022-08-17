const jwt = require('jsonwebtoken')
const Users = require('./models/user')

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESSTOKENSECRET || "secret", { expiresIn: '60m', });
  const refreshToken = jwt.sign(payload, process.env.ACCESSTOKENSECRET || "secret", { expiresIn: '60m' });

  return { accessToken, refreshToken };
}

const verifyToken = (token) => new Promise((resolve, reject) => {
    var { response, error } = jwt.verify(token, process.env.ACCESSTOKENSECRET || "secret");
    if (error) reject(false);
    if (response) resolve(true);

});

const tokenVerify = async (req, res, next) => {
    let refreshToken, accessToken;
    const getValue = (value, key) => value !== undefined ? value.replace(key, "") : null;
    try {
        const list = req.headers.cookie.split('; ').filter(x => x.includes("Token"));
        accessToken = getValue(list.filter(x => x.includes('access'))[0], 'accessToken=')
        refreshToken = getValue(list.filter(x => x.includes('refresh'))[0], 'refreshToken=')

        if (!accessToken) throw new Error();
        const userData = await jwt.verify(accessToken, process.env.ACCESSTOKENSECRET || "secret");
        if(!userData) throw new Error()
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'unauthorized' }).end();
    }
}

// const refresh = async (refreshTokenCookie, req, res) => {
//     try {
//         let userData = await jwt.verify(refreshTokenCookie, process.env.ACCESSTOKENSECRET || "secret")
//         let { accessToken, refreshToken } = await generateTokens(userData);
        
//         res.status(200).json({
//             userData: userData,
//             accessToken: accessToken,
//             refreshToken: refreshToken
//         }).end();
//     } catch (error) {
//         console.log("TokenRefreshError: ", error);
//         res.status(401).json({ message: 'Invalid Token' })
//     }
// }

module.exports = { generateTokens, tokenVerify }