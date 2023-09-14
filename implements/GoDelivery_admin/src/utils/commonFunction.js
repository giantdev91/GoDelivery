const formatedDate = (clientCreatedAt) => {
    const year = clientCreatedAt.getFullYear();
    const month = clientCreatedAt.getMonth() + 1; // Month is zero-based, so add 1
    const day = clientCreatedAt.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    return formattedDate;
};
const formatDateAndTime = (date) => {
    const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    return date.toLocaleString("en-US", options);
};

const dateTimeFormat = (date) => {
    // Get the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    // Get the time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Create the formatted string
    const formattedString = `${year}-${month}-${day} ${hours}:${minutes}`;

    console.log(formattedString);
    return formattedString;
};

const calendarLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const strFormatedDate = (date) => {
    const day = date.getDate();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${month} ${year}`;
};

const getDaySuffix = (day) => {
    if (day >= 10) {
        return "th";
    }
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export {
    formatedDate,
    formatDateAndTime,
    calendarLabels,
    strFormatedDate,
    dateTimeFormat,
};
