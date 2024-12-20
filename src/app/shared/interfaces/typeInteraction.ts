import {TypeInteractionState} from "./typeInteractionState";

export interface TypeInteraction {
    id: number;
    from_type_id: number;
    to_type_id: number;
    type_interaction_state_id: number;
    state?: TypeInteractionState;
}
