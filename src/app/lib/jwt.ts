import jwt from 'jsonwebtoken'


export function createAccessToken(payload: object): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.PRIVATE_KEY || 'secret',
            { expiresIn: "1d" },
            (err, token) => {
                if (err) reject(err)
                if (token) resolve(token)
            }
        )
    })

}