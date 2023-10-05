import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: true
    },
    {
        name: 'Jayesh sevatkar',
        email: 'jayesh@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false
    },
    {
        name: 'Sanket',
        email: 'sanket@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false
    },
]

export default users;