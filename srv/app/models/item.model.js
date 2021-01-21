module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: {
                type: String,
                required: true
            }
        }
    );

    const Item = mongoose.model("item", schema);
    return Item;
};