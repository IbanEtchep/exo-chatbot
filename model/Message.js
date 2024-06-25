class Message {
    constructor(text, datetime = new Date()) {
        this.datetime = datetime;
        this.text = text;
    }

    getText() {
        return this.text;
    }

    getFormattedDatetime() {
        return this.datetime.toLocaleString();
    }
}

export default Message;
