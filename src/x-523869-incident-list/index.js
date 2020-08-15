import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import { actionHandlers } from "./actions";
import "@servicenow/now-template-card";
import "@servicenow/now-modal";

const view = (state,) => {
	const { incidents, isIncidentModal, incidentToShow, inputValue } = state;
	return (
		<div className="incident-list">
			<h2 className="incident-list_header">Incidents</h2>
			{incidents && incidents.map(incident => (
				<now-template-card-assist
					tagline={incident.tagline}
					actions={incident.actions}
					heading={incident.heading}
					content={incident.content}
					footer-content={incident.footerContent}
					className="incident"
					component-id={incident.sys_id}
				/>
			))}
			<now-modal
				footerActions={[{"label":"Delete","variant":"primary-negative"}]}
				size="lg" opened={isIncidentModal}
			>
				{incidentToShow && 
				<div className="modal-window">
					<div className="modal-item">
						<p className="modal-item-title">
							Number
						</p>	
						<span className="modal-item-description">
							{incidentToShow.number}
						</span>
					</div>
					<div className="modal-item">
						<p className="modal-item-title">
							State
						</p>
						<span className="modal-item-description">
							{incidentToShow.state}
						</span>
					</div>
					<div className="modal-item">
						<p className="modal-item-title">
							Updated At
						</p>
						<span className="modal-item-description">
							{incidentToShow.sys_updated_on}
						</span>
					</div>
					<div className="modal-item">
						<p className="modal-item-title">
							Short Description
						</p>
						<span className="modal-item-description">
							{incidentToShow.short_description}
						</span>
					</div>
					<div className="modal-item">
						<p className="modal-item-title">
							Assignment Group
						</p>
						<span className="modal-item-description">
							{incidentToShow.assignment_group}
						</span>
					</div>
					<div className="modal-item">
						<p className="modal-item-title">
							Assigned To
						</p>
						<span className="modal-item-description">
							{incidentToShow.assigned_to}
						</span>
					</div>
				</div>}
			</now-modal>
		</div>
	);
};

createCustomElement('x-523869-incident-list', {
	actionHandlers,
	renderer: {type: snabbdom},
	initialState: {
		isIncidentModal: false
	},
	view,
	styles
});
