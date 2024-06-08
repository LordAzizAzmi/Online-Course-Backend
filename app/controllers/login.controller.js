const db = require('../models')
const user = db.user
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv');
dotenv.config();

exports.loginUser = async (req, res) => {
    const phoneNumber = req.body.phone;
    try {
        await user.aggregate([
        {
            $match: { phone: phoneNumber }
        },
        {
            $lookup: {
                from: 'packets',
                localField: 'packet',
                foreignField: 'packet_id',
                as: 'packet'
            }
        }])
            .then(user => {
                if (!user[0]) {
                    return res.status(404).send({ message: 'User not found' });
                }

                if (!req.body.password || !user[0].password) {
                    return res.status(400).send({ message: 'Missing user password' });
                }
                
                const passwordIsValid = bcrypt.compareSync(req.body.password, user[0].password);

                if (!passwordIsValid) {
                    return res.status(401).send({ message: 'Invalid Password', accessToken: null });
                }

                const accessToken = generateAccessToken({ id: user[0]._id });

                res.status(200).send({
                    status: 'success',
                    message: 'Login successfully',
                    data: {
                        userId: user[0]._id,
                        username: user[0].username,
                        accessToken,
                        packet: user[0].packet
                    }
                });
            });    
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
};


// exports.loginUser = async (req, res) => {
    
//     await user.findOne({
//         phone: req.body.phone
//     })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).send({ message: 'User not found' })
//             }

//             const passwordIsValid = bcrypt.compareSync(
//                 req.body.password,
//                 user.password
//             )

//             if (!passwordIsValid) {
//                 return res.status(401).send({
//                     message: 'Invalid Password',
//                     accessToken: null
//                 })
//             }

//             res.status(200).send({
//                 status: 'success',
//                 message: 'Login successfully',
//                 data : {
//                     userId: user._id,
//                     username: user.username,
//                     accessToken: generateAccessToken( { id: user._id }),
//                     packet: user.packet
//                 }
//             })
//         })
//         .catch(err => {
//             res.status(500).send({ message: err.message })
//         })
// }

function generateAccessToken(userid) {
    return jwt.sign(userid, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}