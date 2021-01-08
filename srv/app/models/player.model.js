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

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Player = mongoose.model("player", schema);
    return Player;
};