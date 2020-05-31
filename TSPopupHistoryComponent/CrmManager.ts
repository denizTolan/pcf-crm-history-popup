import {ActionContract,ActionResponse,AuditDetailModel} from './ActionContract';

export class CrmManager {
    private Xrm: any;

    private _actionContract:ActionContract;
    private _isConnectedCrm: boolean;
    private _historyArray:AuditDetailModel[]=[];

    constructor(attributeName : string){
        debugger;
        this._isConnectedCrm = this.Xrm !== undefined ?? true;
        
        this._actionContract = new ActionContract();
        this._actionContract.AttributeLogicalName = attributeName;
        this._actionContract.EntityLogicalName = this._isConnectedCrm? this.Xrm.Page.data.entity.getEntityName():"account";
        this._actionContract.EntityId = this._isConnectedCrm? this.Xrm.Page.data.entity.getId().replace("{","").replace("}","") : null;
    }

    public RetrieveHistory(successFunction:any) : void
	{
        if(this._historyArray.length > 0) {
            successFunction(this._historyArray);

            return;
        }
        if(!this._isConnectedCrm){
            this.AddHistoryRecord("055xxxx5","2020-05-20","Deniz T.");
            this.AddHistoryRecord("055xxxx4","2020-05-19","Deniz T.");
            this.AddHistoryRecord("055xxxx3","2020-05-18","Deniz T.");
            
            successFunction(this._historyArray);
            return;
        }
		this._actionContract.getMetadata = function() {
			return {
				boundParameter: null,
				parameterTypes: {
					"EntityLogicalName": {
						"typeName": "Edm.String",
						"structuralProperty": 1
					},
					"EntityId": {
						"typeName": "Edm.String",
						"structuralProperty": 1
					},
					"AttributeLogicalName": {
						"typeName": "Edm.String",
						"structuralProperty": 1
					}
				},
				operationType: 0,
				operationName: "vnb_RetrieveAttributeHistory"
			};
		};

		const self = this;
		this.Xrm.WebApi.online.execute(this._actionContract).then(
			function (result) {
				if (result.ok) {
                    self.FetchStream(self, result.body);
                    successFunction(self._historyArray);
				}
			},
			function (error) {
				self.Xrm.Utility.alertDialog(error.message, function(){});
			}
		);
    }
    
    private FetchStream(caller : CrmManager, stream : ReadableStream) : void {
		const reader = stream.getReader();
		let text : string;
		text = "";
		reader.read().then(function processText({ done, value }) : void {  
			
			if(done)
			{
				let content: ActionResponse = JSON.parse(text);
				let historyDetails: AuditDetailModel[] = JSON.parse(content.History);
				for (let historyDetail of historyDetails) {
					caller.AddHistoryRecord(historyDetail.Value,historyDetail.ModifiedOn,historyDetail.User);
				}
				return;
			}
			
			if(value)
				text += new TextDecoder("utf-8").decode(value);
				reader.read().then(processText);
		});
    }
    
    private AddHistoryRecord(value:string,modifiedOn:string,user:string)
	{
        let detail = new AuditDetailModel();
        detail.Value = value;
        detail.ModifiedOn = modifiedOn;
        detail.User = user;
        
		this._historyArray.push(detail);
	}
}