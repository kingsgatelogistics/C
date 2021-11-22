import { FieldResource } from "./FieldResource";
import { StopResource } from "./StopResource";

export interface QuestionResource {
    trackingKey:string;
    recordId:string;
    questionId: number;
    movementId:string;
    stop_id:string;
    stop:StopResource;
    question_name: string;
    question_text: string;
    question_numberOfFields: number;
    need_stops_for_movement: boolean;
    proceed_field1iFbitEQ:boolean;
    iFnotproceed_terminatewhich:string; 
    dateTimeAnswered:boolean;

    fields: FieldResource[];
}