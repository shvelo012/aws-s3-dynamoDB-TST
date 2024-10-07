export interface IDynamoService {
  createRecord(id: string, name: string, size: number): Promise<void>;
  updateRecord(id: string, size: number): Promise<void>;
  deleteRecord(id: string): Promise<void>;
}
