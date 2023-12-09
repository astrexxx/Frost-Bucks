const { model, Schema } = require('mongoose');
module.exports = model(
  'server',
  new Schema({
    serverId: { type: String, required: true },
    snowballsDropped: { type: Number, default: 0 }
  })
);