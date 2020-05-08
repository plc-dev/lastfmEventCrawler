module.exports = mongoose => {
    const LastFMEvents = new mongoose.Schema({
      id: {
          type: String,
          required: true,
          unique: true
      },
      description: {
        type: String
      },
      date: {
        type: Object
      },
      location: {
        type: Object
      },
      link: {
        type: String
      },
      lineup: {
        type: Array
      }
    });
    return mongoose.model("LastFMEvents", LastFMEvents);
  };
  