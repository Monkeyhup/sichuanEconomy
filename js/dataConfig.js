function dataConfig() {
	this.flag = "";
	this.setFlag = setFlag;
	this.getFlag = getFlag;
	this.json = [];
	this.setJson = setJson;
	this.getJson = getJson;
	this.iden = [];
	this.setIden = setIden;
	this.getIden = getIden;
	this.pop = [];
	this.setPop = setPop;
	this.getPop = getPop;
	this.data = [];
	this.setData = setData;
	this.getData = getData;
};

function setFlag(flag) {
	this.flag = flag;
}

function getFlag() {
	return this.flag;
}

function setJson(json) {
	this.json = json;
}

function getJson() {
	return this.json;
}

function setIden(iden) {
	this.iden = iden;
}

function getIden() {
	return this.iden;
}


function setPop(pop) {
	this.pop = pop;
}

function getPop() {
	return this.pop;
}

function setData(data) {
	this.data = data;
}

function getData() {
	return this.data;
}