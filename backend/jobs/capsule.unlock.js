const cron = require('node-cron');
const Capsule = require('../models/capsule.model');
const User = require('../models/user.model');
const { Resend } = require('resend');


const resend = new Resend(process.env.RESEND_API_KEY);

// runs every day at midnight
cron.schedule('0 0 * * *', async () => {  
    try {
        // find all capsules that are still locked but their unlock date has passed
        const capsulesToUnlock = await Capsule.find({
            isLocked: true,
            unlockDate: { $lte: new Date() },
        });

        for (const capsule of capsulesToUnlock) {
            capsule.isLocked = false;
            await capsule.save();

            const user = await User.findById(capsule.user);
            if (!user) continue; // skip if user was deleted

            await resend.emails.send({
                from: 'To the Next Version <noreply@yourdomain.com>',
                to: user.email,
                subject: 'Your time capsule is ready to open.',
                html: `
                    <p>Hi ${user.name},</p>
                    <p>On ${capsule.createdAt.toDateString()}, you wrote a message to your future self. That moment has arrived.</p>
                    <p>Your capsule, "${capsule.title}", is now unlocked and waiting for you.</p>
                    <a href="${process.env.FRONTEND_URL}/capsules/${capsule._id}">Open my capsule →</a>
                    <p>Take your time. You earned this moment.</p>
                    <p>— To the Next Version</p>
                `,
            });
        }

        console.log(`Unlocked ${capsulesToUnlock.length} capsules`);
    } catch (error) {
        console.error('Cron job error:', error.message);
    }
});