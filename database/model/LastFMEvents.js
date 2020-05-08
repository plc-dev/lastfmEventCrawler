module.exports = mongoose => {
    const LastFMEvents = new mongoose.Schema({
      eventId: {
          type: String,
          required: true,
          unique: true
      },
      eventTitle: {
        type: String
      },
      eventDescription: {
        type: String,
        required: true
      },
      entities: {
        type: Array,
        required: true
      }
    });
    return mongoose.model("LastFMEvents", LastFMEvents);
  };
  