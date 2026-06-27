const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
          required: true 
        },

    title: { type: String,
         required: true
         },

    message: { type: String,
         required: true 
        },

    currentAge: { type: Number,
         required: true
         },

    currentMood: { type: String, 
        required: true
     },
    currentGoal: String,
    currentHobby: String,
    currentSong: String,
    currentShow: String,
    whatWillChange: String,
    whatSkillsWillYouLearn: String,
    whatAreYouWorriedAbout: String,

    unlockDate: { type: Date,
         required: true 
        },

    isLocked: { type: Boolean, 
        default: true
     },

    isPublic: { type: Boolean,
         default: false 
        },
     emailSent: {
        type: Boolean,
        default: false 
     },
    
    photo: String,
}, 

{ timestamps: true });

const Capsule = mongoose.model('Capsule', capsuleSchema);

module.exports = Capsule;