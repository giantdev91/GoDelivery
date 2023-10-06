import APIService from "./APIService";

const cashReasonList = async () => {
    const response = await APIService.get("/cashReason/get");
    return response;
}

export default {
    cashReasonList
}