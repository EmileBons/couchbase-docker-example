function (doc, oldDoc) {

    function validateNotEmpty(key, value) {
        if (!value) {
            throw({forbidden: key + " is not provided"});
        }
    }

    function validateType() {
        if (doc) {
            validateNotEmpty("type", doc.type);
        }
    }

    if (!doc._deleted) {
        validateType();
    }
}
