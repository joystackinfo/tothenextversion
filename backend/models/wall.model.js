const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema({
    capsule: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Capsule', 
        required: true 
    },

    user: { type: mongoose.Schema.Types.ObjectId,
         ref: 'User', 
         required: true },

    isAnonymous: { type: Boolean,
         default: false
         },
         
    likes: { type: Number, 
        default: 0
     },
}, { timestamps: true }); // sharedAt is covered by createdAt here

const Wall = mongoose.model('Wall', wallSchema);

module.exports = Wall;