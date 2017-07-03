const electron = require("electron");
const path = require("path");
const fs = require("fs");

//这个类的实现来自于https://medium.com/@ccnokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
class Store {
    //定义构造函数，这个类具有path和data两个域
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath("userData");
        this.path = path.join(userDataPath, opts.configName + ".json");
        // console.log(this.path);
        this.data = parseDataFile(this.path, opts.defaults);
    }

    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

}

//这个函数返回一个JSON格式的字符串
function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch(error) {
        return defaults;
    }
}

//暴露这个类给其它模块使用，而其他的私有函数不会暴露出去
module.exports = Store;