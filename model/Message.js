class Message {
    constructor(text, datetime = new Date()) {
        this.datetime = datetime;
        this.text = text;
    }

    getText() {
        return this.text;
    }

    getDatetime() {
        return this.datetime;
    }
}

export default Message;
