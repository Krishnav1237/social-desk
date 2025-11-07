const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { query, transaction } = require('../db');

const SALT_ROUNDS = 10;

/**
 * Signup - Create new user account
 */
async function signup(request, reply) {
  const { email, username, password } = request.body;

  try {
    // Check if email already exists
    const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return reply.code(400).send({
        error: 'Email Already Exists',
        message: 'An account with this email already exists',
      });
    }

    // Check if username already exists
    const usernameCheck = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return reply.code(400).send({
        error: 'Username Already Exists',
        message: 'This username is already taken',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user and related records in a transaction
    const result = await transaction(async (client) => {
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, username, password_hash, plan, credits)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, username, plan, credits, created_at`,
        [email, username, passwordHash, 'free', 100]
      );

      const user = userResult.rows[0];

      // Create default persona profile
      await client.query(
        `INSERT INTO persona_profiles (user_id, name, tone, is_default)
         VALUES ($1, $2, $3, $4)`,
        [user.id, 'Default', 'casual', true]
      );

      // Create referral code
      const referralCode = `${username.toUpperCase().substring(0, 4)}${nanoid(4)}`;
      await client.query(
        `INSERT INTO referrals (user_id, code)
         VALUES ($1, $2)`,
        [user.id, referralCode]
      );

      // Create streak record
      await client.query(
        `INSERT INTO streaks (user_id)
         VALUES ($1)`,
        [user.id]
      );

      return user;
    });

    // Generate JWT token
    const token = this.jwt.sign({
      id: result.id,
      email: result.email,
      username: result.username,
    });

    // Set cookie
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        plan: result.plan,
        credits: result.credits,
      },
      token,
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to create account',
    });
  }
}

/**
 * Login - Authenticate user
 */
async function login(request, reply) {
  const { email, password } = request.body;

  try {
    // Find user by email
    const result = await query(
      `SELECT id, email, username, password_hash, plan, credits, onboarded
       FROM users
       WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );

    if (result.rows.length === 0) {
      return reply.code(401).send({
        error: 'Invalid Credentials',
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return reply.code(401).send({
        error: 'Invalid Credentials',
        message: 'Invalid email or password',
      });
    }

    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Generate JWT token
    const token = this.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    // Set cookie
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        plan: user.plan,
        credits: user.credits,
        onboarded: user.onboarded,
      },
      token,
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to login',
    });
  }
}

/**
 * Get current user
 */
async function me(request, reply) {
  try {
    const user = request.currentUser;

    // Get additional stats
    const statsResult = await query(
      `SELECT
        (SELECT COUNT(*) FROM posts WHERE user_id = $1) as total_posts,
        (SELECT COUNT(*) FROM accounts WHERE user_id = $1 AND is_active = true) as connected_accounts,
        (SELECT current_streak FROM streaks WHERE user_id = $1) as current_streak,
        (SELECT code FROM referrals WHERE user_id = $1 LIMIT 1) as referral_code
      `,
      [user.id]
    );

    const stats = statsResult.rows[0];

    return {
      ...user,
      stats: {
        total_posts: parseInt(stats.total_posts) || 0,
        connected_accounts: parseInt(stats.connected_accounts) || 0,
        current_streak: stats.current_streak || 0,
        referral_code: stats.referral_code,
      },
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch user data',
    });
  }
}

/**
 * Update profile
 */
async function updateProfile(request, reply) {
  const { username, bio, avatar_url, website } = request.body;
  const userId = request.currentUser.id;

  try {
    // Check if username is taken (if changing)
    if (username && username !== request.currentUser.username) {
      const usernameCheck = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      if (usernameCheck.rows.length > 0) {
        return reply.code(400).send({
          error: 'Username Taken',
          message: 'This username is already taken',
        });
      }
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (username) {
      updates.push(`username = $${paramIndex}`);
      values.push(username);
      paramIndex++;
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex}`);
      values.push(bio);
      paramIndex++;
    }
    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramIndex}`);
      values.push(avatar_url);
      paramIndex++;
    }
    if (website !== undefined) {
      updates.push(`website = $${paramIndex}`);
      values.push(website);
      paramIndex++;
    }

    if (updates.length === 0) {
      return reply.code(400).send({
        error: 'Bad Request',
        message: 'No updates provided',
      });
    }

    values.push(userId);
    const result = await query(
      `UPDATE users
       SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, username, bio, avatar_url, website, plan, credits`,
      values
    );

    return result.rows[0];
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to update profile',
    });
  }
}

/**
 * Logout
 */
async function logout(request, reply) {
  reply.clearCookie('token', {
    path: '/',
  });

  return { message: 'Logged out successfully' };
}

/**
 * Complete onboarding
 */
async function completeOnboarding(request, reply) {
  const userId = request.currentUser.id;

  try {
    await query('UPDATE users SET onboarded = true WHERE id = $1', [userId]);

    return { message: 'Onboarding completed', onboarded: true };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to complete onboarding',
    });
  }
}

module.exports = {
  signup,
  login,
  me,
  updateProfile,
  logout,
  completeOnboarding,
};
