import { IDummyService } from "../../services/dummy.service";
import Dummy from '../../services/models/dummy.model';
import _ from 'lodash';

const dummyResolver = (service: IDummyService): any => {

    return {
        Query: {
            dummy(): Dummy {
                const id = 1;
                const dummy = service.findDummySql(id);
                
                if(_.isUndefined(dummy) || _.isNull(dummy)) 
                    throw Error(`Dummy with id ${id} could not be found.`);

                return dummy;
            }
        }
    };

}

export default dummyResolver;