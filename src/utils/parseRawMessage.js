function parseRawMessage(rawData) {
    try {
        return JSON.parse(rawData);
    } catch (e) {
        return rawData;
    }
}

export default parseRawMessage;
