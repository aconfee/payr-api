import chai from 'chai';
import sinon from 'sinon';
import dummyResolver from './dummy.resolver';
import { IDummyService } from '../../services/dummy.service';
import Dummy from '../../services/models/dummy.model';
const assert = chai.assert;

class MockDummyService implements IDummyService {
    findDummy = null;
    findDummySql = null;
};

describe('Dummy resolver', () => {

    describe('dummy', () => {
        it('Can get message.', () => {

            const stub = sinon.stub().returns({message: 'Aww yiss'})
            const mockDummyService = new MockDummyService();
            mockDummyService.findDummySql = stub;

            const resolver = dummyResolver(mockDummyService);
            var result: Dummy = resolver.Query.dummy();

            assert.isNotNull(result);
            assert.isNotNull(result.message);
            assert.equal(result.message, 'Aww yiss');
            assert.isTrue(stub.calledOnce);
        });
    });

});