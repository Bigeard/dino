module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            type: Object,
            round: {
                type: Number,
                required: true
            }
        }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Action = mongoose.model("action", schema);
    return Action;
};