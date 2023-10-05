import APIService from "./APIService";

const weightOptionList = async () => {
    const response = await APIService.get("/weight/get");
    return response;
}

const goodsTypeOptionList = async () => {
    const response = await APIService.get("/goodsType/get");
    return response;
}

export default {
    weightOptionList,
    goodsTypeOptionList,
}