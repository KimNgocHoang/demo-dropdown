export interface Group {
    id: number;
    name: string;
  }
  
  export interface Drug {
    id: number;
    name: string;
  }
  
  export interface GroupDrugMapping {
    id: number;
    groupId: number;
    drugIds: number[];
  }
  