import  bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true
    },
    {
        name: 'Mehdi baya',
        email: 'mehdi@example.com',
        password: bcrypt.hashSync('123456',10),
 
    },
    {
        name: 'Amine baya',
        email: 'amine@example.com',
        password: bcrypt.hashSync('123456',10),

       
    }
]

export default users