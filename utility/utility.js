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

    // loginAuth = (req,res,next)=> {
    //     if(req.body!==null)
    //     {
    //         if(req.body.email == null || req.body.password == null)
    //         {
    //             res.send({
    //                 status: false,
    //                 message: 'Empty request'
    //             })
    //         }
    //         else if(!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(req.body.email))
    //         {
    //             res.send({
    //                 status: false,
    //                 message: 'Invalid Email Id'
    //             })
    //         }
    //         else if(req.body.password === '' || req.body.password.length < 8)
    //         {
    //             res.send({
    //                 status: false,
    //                 message: 'Invalid Password'
    //             })
    //         }
    //         console.log('\nPassing client request to controller...');
    //         next();
    //     }
    //     else
    //     {
    //         res.send({
    //             status:false,
    //             message:"Authentication error..."
    //         })
    //     }
    // },
    
    checkToken(req,res,next) {
        console.log('51--req body in utility--',req.body);
        console.log('52--req `headers` in utility--',req.headers['token']);
        var token1 = req.headers['token']; 
        // decode token
        if (token1)
        {
            // verifies secret and checks exp
            jwt.verify(token1, 'secretkey', (err, decoded) => 
            {
                if (err) 
                {
                    return res.send({
                        success: false,
                        message: 'Token is not valid'
                    });
                } 
                else 
                {
                    req.decoded = decoded;
                    next();
                }
            });
        } 
        else 
        {
            // if there is no token return an error
            return res.send({
                success: false,
                message: 'No token provided.'
            });
        }
    }



} //module.exports close

