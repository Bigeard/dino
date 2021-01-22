module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            map: [Object],
            actions: [Object],
            players: [Object],
            status: {
                type: String,
                required: true
            },
        },
        { timestamps: true }
    );

    const Game = mongoose.model("game", schema);
    return Game;
};