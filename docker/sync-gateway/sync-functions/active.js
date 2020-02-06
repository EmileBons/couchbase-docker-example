function (doc, oldDoc) {

    function validateType() {
        if (doc) {
            validateNotEmpty("type", doc.type);
        }
    }

    if (!doc._deleted) {
        validateType();
    }
}
