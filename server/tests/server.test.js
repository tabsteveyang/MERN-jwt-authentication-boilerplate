const expect = require('expect');
const request = require('supertest');
const app = require('../server').app;
const { User } = require('../mongodb/db');

let adminInfo;
let userInfo;
beforeEach('insert user & admin with a token', (done) => {
    const admin = new User({
        "pic" : "",
        "tokens" : [],
        "email" : "testadmin@mail.com",
        "password" : "mypassword",
        "name" : "testadmin",
        "settings" : [ 
            {
                "language" : "EN",
            }
        ],
        "privilige" : [ 
            {
                "isActivate" : true,
                "setting" : true,
                "create" : true,
                "isAdmin" : true,
            }
        ],
    });
    const user = new User({
        "pic" : "",
        "tokens" : [],
        "email" : "testuser@mail.com",
        "password" : "mypassword",
        "name" : "testuser",
        "settings" : [ 
            {
                "language" : "EN",
            }
        ],
        "privilige" : [ 
            {
                "isActivate" : true,
                "setting" : true,
                "create" : true,
                "isAdmin" : false,
            }
        ],
    });

    //create test-admin:
    admin.save().then((userData) => {
        userData.generateAuthToken().then((token) => {
            userData.token = [token];
            adminInfo = userData;
    //create test-user:
            user.save().then((userData) => {
                userToken = userData.generateAuthToken().then((token) => {
                    userData.token = [token];
                    userInfo = userData;
                    done();  
                });
            });
        });
    });
});
afterEach('clean up the data', (done) => {
    User.remove().exec();
    done();
});

describe('POST /user/check_token', () => {
    it('should return success if token is valid', (done) => {
        request(app)
           .post('/user/check_token')
           .set('x-auth', adminInfo.token[0])
           .expect(200)
           .expect('success')
           .end(done);
    });
    it('should return invalid if token is invalid', (done) => {
        request(app)
           .post('/user/check_token')
           .set('x-auth', '123')
           .expect(403)
           .expect('invalid')
           .end(done);
    });
});
describe('POST /user/login', () => {
    it('should return user data if the account and password is correct', (done) => {
        request(app)
            .post('/user/login')
            .send({email: userInfo.email, password: 'mypassword'})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(userInfo.email);
            })
            .expect((res) => {
                expect(res.header).toHaveProperty('x-auth');
            })
            .end(done);
    });
    it('should return invalid if the account and password is not correct', (done) => {
        request(app)
            .post('/user/login')
            .send({email: userInfo.email, password: 'notmypassword'})
            .expect(400)
            .expect('invalid')
            .end(done);
    });
});
describe('POST /user/logout', () => {
    it('should logout remove the token if the token in the header is valid', (done) => {
        request(app)
            .post('/user/logout')
            .set({'x-auth': userInfo.token[0]})
            .expect(200)
            .expect('success')
            .expect(() => {
                User.findByCredentials(userInfo.email, 'mypassword').then((userData) => {
                    expect(userData.tokens.length).toBe(0);
                });
            })
            .end(done)
    });
    it('should not remove the token if the token in the header is invalid', (done) => {
        request(app)
            .post('/user/logout')
            .set({'x-auth': adminInfo.token[0]+'ohno'})
            .expect(403)
            .expect('invalid')
            .expect(() => {
                User.findByCredentials(adminInfo.email, 'mypassword').then((userData) => {
                    expect(userData.tokens.length).toBe(1);
                });
            })
            .end(done)
    });
});
describe('POST /admin/create_user', () => {
    const data = {
        email: 'user001@mail.com',
        password: 'mypassword',
        name: 'user001',
        settings: { language: 'EN' },
        privilige: { isActivate: true, setting: true, create: true, isAdmin: true },
        error: '' 
    }
    it('should success if the user is an admin', (done) => {
        request(app)
            .post('/admin/create_user')
            .set({'x-auth': adminInfo.token[0]})
            .send(data)
            .expect(200)
            .end(done);
    });
    it('should fail if the form is not valid', (done) => {
        let invalid_data = data;
        invalid_data.email = 'user001@';
        request(app)
            .post('/admin/create_user')
            .set({'x-auth': adminInfo.token[0]})
            .send(invalid_data)
            .expect(200)
            .expect('invalid')
            .end(done);
    });
    it('should fail if the user is not an admin', (done) => {
        request(app)
            .post('/admin/create_user')
            .set({'x-auth': userInfo.token[0]})
            .send()
            .expect(403)
            .expect('invalid')
            .end(done);
    });
});
