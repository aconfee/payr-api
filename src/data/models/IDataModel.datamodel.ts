import IContract from '../../business/contracts/IContract';

export default interface IDataModel {
    toContract(): IContract;
};