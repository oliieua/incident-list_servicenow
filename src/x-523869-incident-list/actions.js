import { createHttpEffect } from "@servicenow/ui-effect-http";
import { actionTypes } from "@servicenow/ui-core";

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export const actionHandlers = {
    [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
        const { dispatch } = coeffects;

        dispatch("FETCH_INCIDENT_LIST", {
            sysparm_display_value: "true"
        });
    },
    "NOW_DROPDOWN_PANEL#ITEM_CLICKED": (coeffects) => {
        const { action, updateState, dispatch } = coeffects;
        const { id } = action.payload.item;
        const componentId = action.meta.path.find(id => id.length >= 32);
        if (id === "more_info") {
            const { incedentsForModal } = coeffects.state;
            const incidentToShow = incedentsForModal.find(incident => incident.sys_id === componentId);
            updateState({ incidentToShow, isIncidentModal: true });
        } else if (id === "delete") {
            dispatch("DELETE_INCIDENT_ITEM", { sys_id: componentId });
        }
    },
    "FETCH_INCIDENT_LIST": createHttpEffect("api/now/table/incident", {
        method: "GET",
        queryParams: ["sysparm_display_value"],
        successActionType: "FETCH_INCIDENT_LIST_SUCCESS"
    }),
    "FETCH_INCIDENT_LIST_SUCCESS": (coeffects) => {
        const incidents = [];
        const incedentsForModal = [];
        const { action, updateState } = coeffects;
        const { result } = action.payload;
        result.forEach(incident => {
            incedentsForModal.push(
                {
                    number: incident.number,
                    state: incident.state,
                    short_description: incident.short_description,
                    assignment_group: incident.assignment_group.display_value ? incident.assignment_group.display_value : "None",
                    assigned_to: incident.assigned_to.display_value ? incident.assigned_to.display_value : "None",
                    sys_updated_on: incident.sys_updated_on,
                    sys_id: incident.sys_id
                }
            );
            incidents.push(
                {
                    tagline: {
                        icon: "tree-view-long-outline", label: "Incident"
                    },
                    actions: [
                        {id: "more_info", label: "Open Record"},
                        {id: "delete", label: "Delete"}
                    ],
                    heading: {
                        label: incident.short_description
                    },
                    content: [
                        {label: "Number", value: {type: "string", value: incident.number}},
                        {label: "State", value: {type: "string", value: incident.state}},
                        {label: "Assignment Group", value: {type: "string", value:
                            incident.assignment_group.display_value ? incident.assignment_group.display_value : "None"
                        }},
                        {label: "Assigned To", value: {type: "string", value:
                            incident.assigned_to.display_value ? incident.assigned_to.display_value : "None"
                        }}
                    ],
                    footerContent: {
                        label: "Updated",
                        value: incident.sys_updated_on
                    },
                    sys_id: incident.sys_id
                }
            )
        });
        updateState({ incidents, incedentsForModal });
    },
    "DELETE_INCIDENT_ITEM": createHttpEffect(`api/now/table/incident/:sys_id`, {
        method: "DELETE",
        pathParams: ['sys_id'],
        successActionType: "FETCH_INCIDENT_LIST"
    }),
    "NOW_MODAL#OPENED_SET": (coeffects) => {
        const { updateState} = coeffects;
        updateState({isIncidentModal: false});
    },
    "NOW_MODAL#FOOTER_ACTION_CLICKED": (coeffects) => {
        const { state, updateState, dispatch } = coeffects;
        const { incidentToShow } = state;
        dispatch("DELETE_INCIDENT_ITEM", { sys_id: incidentToShow.sys_id });
        updateState({isIncidentModal: false});
    }
}