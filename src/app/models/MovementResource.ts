import { StopResource } from "./StopResource";

export interface MovementResource {
    movement_count: number;
    movement_id: string;
    order_numbers: string;
    pickup_location: string;
    pickup_city_name: string;
    pickup_state: string;
    delivery_location: string;
    delivery_city_name: string;
    delivery_state: string;
    unansweredQuestions: number;
    openStops: number;
    stops:StopResource[];
}