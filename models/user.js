const { model, Schema } = require('mongoose');
module.exports = model(
  'user',
  new Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    snowballs: { type: Number, default: 0 },
    snowman: { 
      height: { type: Number, default: 0 },
      nickname: String
    },
    snowballsThrown: { type: Number, default: 0 },
    snowballsLanded: { type: Number, default: 0 },
    inventory: {
      multiThrow: Date,
      snowShield: Date,
      snowMagnet: Date,
      tag: { type: Boolean, default: false }
    },
    snowWall: {
      level: { type: Number, default: 0 },
      health: Number
    }
  })
);