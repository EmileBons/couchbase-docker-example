const assert = require('assert');
const generator = require('generate-password');
const request = require('request');
const util = require('util');

const { uniqueNamesGenerator } = require('unique-names-generator');

const role = {
    admin_channels: ['test_channel'],
    name: 'test_role'
};

const user = {
    admin_roles: ['test_role'],
    name: uniqueNamesGenerator({length: 2, separator: '-'}),
    password: generator.generate({length: 32}),
};

after('Delete user and role', function (done) {
    request.delete({url: util.format('http://localhost:4985/active/_user/%s', user.name)}, function (err) {
        if (err) {
            done(err);
        } else {
            const url = util.format('http://localhost:4985/active/_role/%s', role.name);
            request.delete({url: url}, function (err) {
                done(err);
            });
        }
    });
});

before('Create user and role', function (done) {
    request.post({url: 'http://localhost:4985/active/_role/', json: role}, function (error, response, body) {
        if (body && body.error) {
            done(body.error);
        } else {
            const options = {url: 'http://localhost:4985/active/_user/', json: user};
            request.post(options, function (error, response, body) {
                if (body && body.error) {
                    done(body.error);
                } else {
                    done(error);
                }
            });
        }
    });
});

describe('Sync function', function() {

    it('Creating a document should not give an error', function(done) {
        let options = {
            auth: {user: user.name, password: user.password},
            json: {channels: ['test_channel'], type: 'test'},
            url: util.format('http://localhost:4984/active/')
        };
        request.post(options, function (error, _, body) {
            assert.ok('ok' in body && body.ok);
            done();
        });
    });

    it('Creating a document without a type should give an error', function(done) {
        let options = {
            auth: {user: user.name, password: user.password},
            json: {channels: ['test_channel']},
            url: util.format('http://localhost:4984/active/')
        };
        request.post(options, function (error, _, body) {
            assert.ok('error' in body && body.error === 'Forbidden');
            done();
        });
    });

});
