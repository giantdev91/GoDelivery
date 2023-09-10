const formatedDate = (clientCreatedAt) => {
    const year = clientCreatedAt.getFullYear();
    const month = clientCreatedAt.getMonth() + 1; // Month is zero-based, so add 1
    const day = clientCreatedAt.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    return formattedDate;
};

export { formatedDate };
