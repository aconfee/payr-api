import chai from 'chai';
import DummyHandler from './dummy.handler';
import sinon from 'sinon';
import { IDummyService } from '../../services/dummy.service';
import Dummy from '../../services/models/dummy.model';
import MockExpressRequest from 'mock-express-request';
const assert = chai.assert;

class MockDummyService implements IDummyService {
    findDummySql = null;
};

describe('Dummy controller', () => {

    describe('GET /dummy', () => {
        it('Can be a dummy.', (done) => {

            const stub = sinon.stub().returns(new Dummy('Test message!!'));
            const service = new MockDummyService();
            service.findDummySql = stub;
            const handler = new DummyHandler(service);

            const request = new MockExpressRequest({
                method: 'GET',
                url: '/dummy'
            });

            const result = handler.getDummy(request, (err, res) => {
                assert.isNull(err);
                assert.isNotNull(res);
                assert.isNotNull(res.json);
                assert.equal(res.status, 200);
                assert.equal(res.json.message, 'Test message!!');

                done();
            });
        });

        it('Can fail.', (done) => {

            const stub = sinon.stub().returns(null);
            const service = new MockDummyService();
            service.findDummySql = stub;
            const handler = new DummyHandler(service);

            const request = new MockExpressRequest({
                method: 'GET',
                url: '/dummy'
            });

            const result = handler.getDummy(request, (err, res) => {
                assert.isNotNull(err);
                assert.equal(err.message, 'Dummy not found.');
                assert.isNotNull(res);
                assert.isUndefined(res.json);
                assert.isNotNull(res.status);
                assert.equal(res.status, 404);

                done();
            });
        });
    });

});