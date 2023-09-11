import React from "react";

const StatusBadge = ({ statusLabel, statusClass }) => {
    return (
        <div className={`status-badge ${statusClass}`}>
            <p>{statusLabel}</p>
        </div>
    );
};

export default StatusBadge;
