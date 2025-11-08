const Subscriber = require('../Models/Subscriber');
const sendEmail = require('../services/emailService');

exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const normalized = email.trim().toLowerCase();

    let existing = await Subscriber.findOne({ email: normalized });
    if (!existing) {
      existing = new Subscriber({ email: normalized, name: name || '' });
      await existing.save();
    }
    try {
      const html = `
            <div style="font-family: 'Georgia', serif; max-width: 650px; margin: 40px auto; padding: 40px; background: linear-gradient(135deg, #fdfcfb, #e2d1c3); border: 2px solid #d8cfc0; border-radius: 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.12); position: relative;">
            
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6b4c3b; padding-bottom: 20px;">
                    <img src="https://static.vecteezy.com/system/resources/previews/023/629/523/original/black-crescent-moon-ornament-on-transparent-background-free-png.png" alt="Casa De Luna" style="width: 90px; height: auto; margin-bottom: 10px;">
                    <h1 style="font-family: 'Brush Script MT', cursive; color: #6b4c3b; font-size: 38px; margin: 0; letter-spacing: 2px;">Casa De Luna</h1>
                    <p style="font-size: 14px; color: #8b7355; font-style: italic; margin: 5px 0 0 0; letter-spacing: 1px;">Where Every Meal is a Ceremony</p>
                </div>

                <p style="font-size: 20px; font-weight: bold; color: #3b3b3b; margin-bottom: 8px;">Most Esteemed ${name || 'Guest'},</p>

                <p style="font-size: 16px; line-height: 1.8; color: #4b3e2d; margin: 16px 0;">
                    It is with the utmost honor and profound gratitude that we welcome you into the distinguished circle of <strong>Casa De Luna</strong> subscribers.
                </p>

                <p style="font-size: 16px; line-height: 1.8; color: #4b3e2d; margin: 16px 0;">
                    Your gracious decision to join our esteemed community bestows upon us a privilege we do not take lightly. As a valued member of our table, you shall be among the first to receive:<br><br>
                    <span style="margin-left: 20px; display: block; line-height: 2;">
                    ◆ Exclusive announcements of our finest culinary creations<br>
                    ◆ Invitations to private tastings and noble gatherings<br>
                    ◆ Reserved access to seasonal delicacies and limited offerings<br>
                    ◆ Special privileges befitting your distinguished patronage
                    </span>
                </p>

                <p style="font-size: 16px; line-height: 1.8; color: #4b3e2d; margin: 16px 0;">
                    May every correspondence from our house bring you delight, and may your journey with us be filled with exquisite flavors and cherished moments.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <span style="color: #8b7355; font-size: 24px;">◆ ◇ ◆</span>
                </div>

                <p style="font-size: 16px; line-height: 1.8; color: #4b3e2d; margin: 20px 0 0 0;">
                    With the highest regard and deepest appreciation,
                </p>
                
                <p style="font-size: 18px; font-style: italic; color: #6b4c3b; margin: 8px 0 0 0; font-weight: 500;">
                    The Honorable House of Casa De Luna
                </p>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #d8cfc0;">
                    <p style="font-size: 12px; color: #8b7355; font-style: italic; margin: 0;">
                    "In the moon's gentle glow, we gather to celebrate life's finest pleasures"
                    </p>
                </div>

            </div>
      `;
      await sendEmail({ to: normalized, subject: 'Subscription confirmed — Casa De Luna', html });
    } catch (e) {
       console.error('Newsletter confirmation email failed:', e && e.message ? e.message : e);
    }

    return res.status(201).json({ message: 'Subscribed', email: normalized });
  } catch (err) {
    console.error('Subscribe error:', err && err.message ? err.message : err);
     if (err && err.code === 11000) {
      return res.status(200).json({ message: 'Already subscribed' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};
