import IDataModel from '../../data/models/IDataModel.datamodel';
import IViewModel from '../../graphql/models/IViewModel.viewmodel';

export default interface IContract {
    toDataModel(): IDataModel;
    toViewModel(): IViewModel;
};