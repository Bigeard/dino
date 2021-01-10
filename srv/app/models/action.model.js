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

    const Action = mongoose.model("action", schema);
    return Action;
};