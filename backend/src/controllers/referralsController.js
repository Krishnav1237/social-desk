const { query } = require('../db');

async function getInfo(request, reply) {
  const userId = request.currentUser.id;

  try {
    const result = await query(
      `SELECT code, used_count, total_rewards_earned
       FROM referrals
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Referral code not found',
      });
    }

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Fetch Failed',
      message: 'Failed to fetch referral information',
    });
  }
}

async function redeem(request, reply) {
  const { code } = request.body;
  const userId = request.currentUser.id;

  try {
    // Check if user already has a referrer
    const existingReferral = await query(
      'SELECT referred_by FROM referrals WHERE user_id = $1 AND referred_by IS NOT NULL',
      [userId]
    );

    if (existingReferral.rows.length > 0) {
      return reply.code(400).send({
        error: 'Already Referred',
        message: 'You have already used a referral code',
      });
    }

    // Find referral code
    const referralResult = await query(
      'SELECT user_id FROM referrals WHERE code = $1 AND is_active = true',
      [code]
    );

    if (referralResult.rows.length === 0) {
      return reply.code(404).send({
        error: 'Invalid Code',
        message: 'Referral code not found or inactive',
      });
    }

    const referrerId = referralResult.rows[0].user_id;

    if (referrerId === userId) {
      return reply.code(400).send({
        error: 'Invalid Operation',
        message: 'You cannot use your own referral code',
      });
    }

    const rewardCredits = parseInt(process.env.REFERRAL_REWARD_CREDITS) || 50;

    // Apply referral in transaction
    await query('BEGIN');

    // Update referral record
    await query(
      'UPDATE referrals SET referred_by = $1 WHERE user_id = $2',
      [referrerId, userId]
    );

    // Increment referrer's count and rewards
    await query(
      `UPDATE referrals
       SET used_count = used_count + 1, total_rewards_earned = total_rewards_earned + $1
       WHERE user_id = $2`,
      [rewardCredits, referrerId]
    );

    // Give credits to both users
    await query('UPDATE users SET credits = credits + $1 WHERE id = $2', [rewardCredits, userId]);
    await query('UPDATE users SET credits = credits + $1 WHERE id = $2', [rewardCredits, referrerId]);

    await query('COMMIT');

    return {
      message: 'Referral code applied successfully',
      credits_earned: rewardCredits,
    };
  } catch (error) {
    await query('ROLLBACK');
    request.log.error(error);
    return reply.code(500).send({
      error: 'Redemption Failed',
      message: 'Failed to redeem referral code',
    });
  }
}

module.exports = {
  getInfo,
  redeem,
};
