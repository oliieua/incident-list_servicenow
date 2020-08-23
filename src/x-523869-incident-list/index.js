import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import { actionHandlers } from "./actions";
import "@servicenow/now-template-card";
import "@servicenow/now-modal";

const changeSearchVal = (e, dispatch) => {
	dispatch("UPDATE_SEARCH_VALUE", {inpValue: e.target.value.toLowerCase().trim()});
};

const changeStateSearch = (e, dispatch) => {
	dispatch("CHANGE_STATE_SELECT", {stateSearch: e.target.value});
};

const view = (state, {dispatch}) => {
	const { incidents, isIncidentModal, incidentToShow, foundIncidents, isSearch } = state;
	const renderIncidents = (!!foundIncidents.length || isSearch) ? foundIncidents : incidents;
	return (
		<div className="incident-list">
			<h2 className="incident-list_header">Incidents</h2>
			{renderIncidents && <div className="search-area">
				<input
					oninput={(e) => changeSearchVal(e, dispatch)}
					placeholder="Search by description"
					onkeyup={(e) => {
						if(e.keyCode === 13) {
							dispatch("FIND_INCIDENTS");
						}
					}}
				/>
				<button onclick={() => dispatch("FIND_INCIDENTS")}>Search</button>
				{state.inpValue && <div className="search-area-select">
					<label>State: </label>
					<select name="state" onchange={(e) => changeStateSearch(e, dispatch)}>
						<option value="all">All</option>
						<option value="new">New</option>
						<option value="in progress">In progress</option>
						<option value="on hold">On Hold</option>
						<option value="resolved">Resolved</option>
						<option value="closed">Closed</option>
						<option value="canceled">Canceled</option>
					</select>
				</div>}
			</div>}
			{renderIncidents && renderIncidents.map(incident => (
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
		isIncidentModal: false,
		inpValue: "",
		foundIncidents: [],
		isSearch: false,
		stateSearch: "all"
	},
	view,
	styles
});
