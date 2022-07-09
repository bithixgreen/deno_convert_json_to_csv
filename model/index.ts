type TValue = string | number;

export interface IObj {
  [key: string]: TValue;
}

export interface IHeader {
  key: string;
  label: string;
}

export interface IPlan {
  plan_name: string;
  plan_id_type: string;
  plan_id: string;
  plan_market_type: string;
}

export interface INetwork {
  description: string;
  location: string;
}

export interface IReportTemp {
  reporting_plans: IPlan[];
  in_network_files: INetwork[];
  allowed_amount_file: INetwork;
}

export interface IDoc {
  reporting_entity_name: string;
  reporting_entity_type: string;
  reporting_structure: IReportTemp[];
}
