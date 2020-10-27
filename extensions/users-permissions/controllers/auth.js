'use strict';

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require('crypto');
const _ = require('lodash');
const grant = require('grant-koa');
const { sanitizeEntity, getAbsoluteServerUrl } = require('strapi-utils');
const jwt = require('jsonwebtoken');
const addDays = require('date-fns/addDays')

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  async callback(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        );
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.provide',
            message: 'Please provide your password.',
          })
        );
      }

      const query = { provider };

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi.query('user', 'users-permissions').findOne(query);

      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        );
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.local',
            message:
              'This user never set a local password, please login with the provider used during account creation.',
          })
        );
      }

      const validPassword = strapi.plugins['users-permissions'].services.user.validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        );
      } else {

        ctx.cookies.set(
          'jrt',
          jwt.sign({userId: user.id},  process.env.JWT_REFRESH_TOKEN_SECRET),
          {
            // path: process.env.COOKIE_PATH || '/auth/refresh-token',
            domain: process.env.DOMAIN || 'localhost',
            expires: addDays(new Date(), 7)
          }
        );

        ctx.send({
          jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
        });
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        );
      }

      // Connect the user with the third-party provider.
      let thirdPartyUser, thirdPartyError;
      try {
        [thirdPartyUser, thirdPartyError] = await strapi.plugins['users-permissions'].services.providers.connect(
          provider,
          ctx.query
        );
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error);
      }

      if (!thirdPartyUser) {
        return ctx.badRequest(null, thirdPartyError === 'array' ? thirdPartyError[0] : thirdPartyError);
      }

      ctx.cookies.set(
        'jrt',
        jwt.sign({userId: user.id},  process.env.JWT_REFRESH_TOKEN_SECRET),
        {
          // path : process.env.COOKIE_PATH || '/auth/refresh-token',
          domain: process.env.DOMAIN || 'localhost',
          expires: addDays(new Date(), 7)
        }
      );

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: thirdPartyUser.id,
        }),
        user: sanitizeEntity(thirdPartyUser.toJSON ? thirdPartyUser.toJSON() : thirdPartyUser, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    }
  },


  async refreshToken(ctx) {
    const refreshToken = ctx.cookies.get('jrt');

    let refreshTokePayload = null;
    try {
      refreshTokePayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    } catch {
      return ctx.send({ok: false, user: null})
    }

    console.log('token', refreshTokePayload.userId);

    const user = await strapi.query('user', 'users-permissions').findOne({_id: refreshTokePayload.userId});

    console.log('user', user._id);

    if(!user) {
      return ctx.send({ok: false, user: null});
    }

    ctx.cookies.set(
      'jrt',
      jwt.sign({userId: user.id}, process.env.JWT_REFRESH_TOKEN_SECRET),
      {
        // path: process.env.COOKIE_PATH || '/auth/refresh-token',
        domain: process.env.DOMAIN || 'localhost',
        expires: addDays(new Date(), 7)
      }
    );

    ctx.send({
      ok: true,
      user: {
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({id: user.id,}),
        id: user._id,
        name: user.username,
        email: user.email,
      }
    });
  },

  async logout(ctx) {
    ctx.cookies.set('jrt', '', {
      domain: process.env.DOMAIN || 'localhost',
      // path: process.env.COOKIE_PATH || '/auth/refresh-token',
    });
    ctx.send(true);
  },
};
