const jwt = require('jsonwebtoken');
module.exports = {
    GenerateToken(payload)
    {   
        const token =  jwt.sign({payload}, 'secretkey', { expiresIn: '24h' }) // expires in 24 hours
        const obj = {
            success: true,
            message: 'Token Generated Successfully!!',
            token: token
        }
        return obj;
    },
    
    checkToken(req,callback) {
        console.log('51--req body in utility--',req.headers);
        // console.log('52--req `headers` in utility--',req.headers['token']);
        var token1 = req.headers; 
        // decode token
        if (token1)
        {
            // verifies secret and checks exp
            jwt.verify(token1, 'secretkey', (err, decoded) => 
            {
                if (err) 
                {
                    // return res.send({
                    //     success: false,
                    //     message: 'Token is not valid'
                    // });
                    callback('Token is not valid')
                } 
                else 
                {
                    req.decoded = decoded;
                    console.log('decoded token is===',req.decoded); 
                    callback(null,req.decoded);
                }
            });
        } 
        else 
        {
            // if there is no token return an error
            // return res.send({
            //     success: false,
            //     message: 'No token provided.'
            // });
            callback('No token provided.')
        }
    }

} //module.exports close

