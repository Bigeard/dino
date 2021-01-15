module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            username: {
                type: String,
                required: true
            },
            passId: {
                type: String,
                required: true
            },
            history: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'game'
            }]
        }
    );

    const User = mongoose.model("user", schema);
    return User;
};
