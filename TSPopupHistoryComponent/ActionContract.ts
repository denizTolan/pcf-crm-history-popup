export class ActionResponse
{
	public History : string;
    public ChangesCount : number;
}

export class AuditDetailModel
{
    public ModifiedOn : string;
    public User : string;
    public Value : string;
}

export class ActionContract
{
	public EntityLogicalName : string;
	public EntityId : string;
	public AttributeLogicalName: string;

	public getMetadata() {
		
	} 
}