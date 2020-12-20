module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            code: {
                type: String,
                required: true
            },
            map: [Object],
            actions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'action'
            }],
            players: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'player'
            }],
            status: Boolean
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Game = mongoose.model("game", schema);
    return Game;
};