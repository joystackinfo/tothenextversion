import cron from 'node-cron'
import Capsule from '../models/capsule.model'
import User from '../models/user.model'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY as string)

// Runs every hour
cron.schedule('0 * * * *', async () => {
  try {
    // Find capsules whose unlock date has passed
    // but whose email hasn't been sent yet
    const capsulesToEmail = await Capsule.find({
      unlockDate: { $lte: new Date() },
      emailSent: false,
    })

    for (const capsule of capsulesToEmail) {
      const user = await User.findById(capsule.user)
      if (!user) continue

      console.log('sending email to', user.email)

      const result = await resend.emails.send({
        from: 'To the Next Version <onboarding@resend.dev>',
        to: user.email,
        subject: 'Your time capsule is ready to open.',
        html: `
          <p>Hi ${user.name || user.username},</p>
          <p>On ${capsule.createdAt.toDateString()}, you wrote a message to your future self. That moment has arrived.</p>
          <p>Your capsule, "<strong>${capsule.title}</strong>", is now ready to open.</p>
          <a href="${process.env.FRONTEND_URL}/capsules/${capsule._id}">
            Open my capsule →
          </a>
          <p>Take your time. You earned this moment.</p>
          <p>— To the Next Version</p>
        `,
      })

      console.log(result)

      // Prevent sending another email
      capsule.emailSent = true
      await capsule.save()
    }

    console.log(`Sent ${capsulesToEmail.length} unlock emails`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Cron job error:', errorMessage)
  }
})