module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      map: [Object],
      actions: [Object],
      players: [Object],
      owner: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      closeDialogWin: {
        type: Boolean,
      },
    },
    { timestamps: true }
  );

  const Game = mongoose.model("game", schema);
  return Game;
};
