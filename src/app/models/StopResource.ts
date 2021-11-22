export class StopResource {
    stop_id: string = "";
    order_id:string = "";
    stop_type: string;
    stop_location_name: string;
    stop_city_name: string;
    city_id:string;
    stop_state: string;
    stop_movement_sequence: string;
    sched_arrive_early_date: string;
    sched_arrive_early_time: string;
    sched_arrive_late_date: string;
    sched_arrive_late_time: string;
    actual_arrival_date: string;
    actual_arrival_time: string;
    actual_departure_date: string;
    actual_departure_time: string;
}