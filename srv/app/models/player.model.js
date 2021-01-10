module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            objects: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'item'
            }],
            status: {
                type: Boolean,
                required: true
            }
        }
    );

    const Player = mongoose.model("player", schema);
    return Player;
};