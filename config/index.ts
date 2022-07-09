import { IHeader } from '../model/index.ts';

export const PROXY = 'https://salty-oasis-33931.herokuapp.com/';

export const FILE_NAME = 'Healthcare Reporting'

export const CSV_HEADER: IHeader[] = [
  { label: "Plan Number", key: "plan_number" },
  { label: "reporting_entity_name", key: "reporting_entity_name" },
  { label: "reporting_entity_type", key: "reporting_entity_type" },
  { label: "plan_name", key: "plan_name" },
  { label: "plan_id_type", key: "plan_id_type" },
  { label: "plan_id", key: "plan_id" },
  { label: "plan_market_type", key: "plan_market_type" },
  { label: "net_description_1", key: "net_description_1" },
  { label: "net_location_1", key: "net_location_1" },
  { label: "net_description_2", key: "net_description_2" },
  { label: "net_location_2", key: "net_location_2" },
  { label: "allowed_location", key: "allowed_location" },
];