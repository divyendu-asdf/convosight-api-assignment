import { expect } from 'chai';
import supertest from 'supertest';

const request = supertest('https://thinking-tester-contact-list.herokuapp.com/');
let TOKEN;
describe('Users', () => {

    let randomNumber = Math.floor(Math.random() * 9999);
    let emailId = `convosight.assignment${randomNumber}@gmail.com`;
    let firstName = `Convosight${randomNumber}`;
    let lastName = `Assignment${randomNumber}`;
    let contactId;

    it('POST /users and get access token.', () => { 
        return request
            .post('users').send({"firstName":firstName, "lastName":lastName, "email":emailId, "password":"convosight"})
            .then((res) => {
                TOKEN = res.body.token;
                expect(res.body).to.not.be.empty;
            });
    });

    it('GET /users with invalid token, negative case.', () => {
        return request
            .get('users/me').set({"Authorization": `Bearer ${TOKEN}Invalid`})
            .then(res => {
                expect(res.statusCode).to.be.eq(401);
            });
    });

    it('GET /users/me get authenticated user data.', () => {
        return request
            .get('users/me').set({"Authorization": `Bearer ${TOKEN}`})
            .then(res => {
                expect(res.body.firstName).to.be.eq(firstName);
                expect(res.body.lastName).to.be.eq(lastName);
                expect(res.body.email).to.be.eq(emailId);
            });

    });

    let data;

    it('POST /contacts Add contacts to user.', () => {
        let randomNumber = Math.floor(Math.random() * 9999);
        let birthDate = `${Math.floor(Math.random() * 50) + 1950}-${('0' + Math.floor(Math.random() * 12)).slice(-2)}-${('0' + Math.floor(Math.random() * 28)).slice(-2)}`;
        let emailId = `convosight.assignment${randomNumber}@gmail.com`;

        data = {
            firstName: `Convosight${randomNumber}`,
            lastName: `LastName${randomNumber}`,
            birthdate: birthDate,
            email: emailId,
            phone: `${Math.floor(Math.random() * 99999999)}`,
            street1: `Street 1 ${randomNumber}`,
            street2: `Street 2 ${randomNumber}`,
            city: `City ${randomNumber}`,
            stateProvince: `State ${randomNumber}`,
            postalCode: Math.floor(Math.random() * 999999),
            country: 'INDIA'
        };

        console.log(data);
        return request
            .post('contacts').set({"Authorization": `Bearer ${TOKEN}`}).send(data)
            .then(res => {
                contactId = res.body._id;
                console.log(res.body);

                expect(res.body.firstName).to.be.eq(data.firstName);
                expect(res.body.lastName).to.be.eq(data.lastName);
                expect(res.body.email).to.be.eq(data.email);
                expect(res.body.phone).to.be.eq(data.phone);
                expect(res.body.birthdate).to.be.eq(data.birthdate); 
                expect(res.body.country).to.be.eq(data.country);
                expect(res.body.street1).to.be.eq(data.street1);
                expect(res.body.street2).to.be.eq(data.street2);
                expect(res.body.stateProvince).to.be.eq(data.stateProvince);                
            });
    });

    it('UPDATE /contacts/{contactId} Update added contact.', () => {
        data.country = 'UKRAINE';
        return request
            .put(`contacts/${contactId}`).set({"Authorization": `Bearer ${TOKEN}`}).send(data)
            .then(res => {
                console.log('UPDATE Response after');
                console.log(res.body);
                expect(res.body.country).to.be.eq(data.country);
            });
    })

    it('DELETE /contacts/{contactId} Delete added contact.', () => {
        return request
            .delete(`contacts/${contactId}`).set({"Authorization": `Bearer ${TOKEN}`})
            .then(res => {
                console.log('Contact deleted');
            });
    });

    it('GET /contacts/{contactId} Fetch for deleted contact.', () => {
        return request
            .get(`contacts/${contactId}`).set({"Authorization": `Bearer ${TOKEN}`})
            .then(res => {
                expect(res.statusCode).to.be.eq(404);
            });
    });
});
