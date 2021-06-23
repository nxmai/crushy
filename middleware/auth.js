const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        console.log('auth token', token);
        console.log('a', token.split(' ')[1]);

        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({msg: "Invalid Authentication"})
            console.log('auth, ', user);
            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth