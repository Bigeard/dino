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

    const Game = mongoose.model("game", schema);
    return Game;
};