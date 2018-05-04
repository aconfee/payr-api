import chai from 'chai';
import DummyService, { IDummyService } from './dummy.service';
import Dummy from './models/dummy.model';
import SequelizeMock from 'sequelize-mock';
const dbMock = new SequelizeMock();
const assert = chai.assert;

describe('Dummy service', () => {

    const MockDummyDao = dbMock.define('dummy');

    describe('Dummy message', () => {
        it('Can get the message.', (done) => {

            MockDummyDao.$queueResult(MockDummyDao.build({
                id: 1,
                message: 'Test message.'
            }));

            const service = new DummyService(MockDummyDao);
            const id = 1;
            service.findDummySql(id).then((result: Dummy) => {
                assert.isNotNull(result);
                assert.isNotNull(result.message);
                assert.equal(result.message, 'Test message.');

                MockDummyDao.$clearQueue();

                done();
            });

        });

        // TODO: Need to return a null (not mock object) to be consistent with sqlize and test properly. 
        it.skip('Can fail.', (done) => {

            // MockDummyDao.$useHandler((query) => {
            //     if(query === 'findById') {
            //         return null;
            //     };
            // });

            // const service = new DummyService(MockDummyDao);
            // const id = 2;
            // service.findDummySql(id).then((result: Dummy) => {
            //     assert.isNull(result);

            //     MockDummyDao.$clearQueue();
            //     done();
            // });

        });
    });
    
});