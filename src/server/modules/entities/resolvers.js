/*eslint-disable no-unused-vars*/
// import withAuth from 'graphql-auth';
import { pick } from 'lodash';
import FieldError from '../../../common/FieldError';
import { withAuth } from '../../../common/authValidation';

const mergeLoaders = res => {
  let ret = [];
  for (let r of res) {
    if (r === null || r.length == 0 || (r.length === 1 && r[0].id === null)) {
      continue;
    }
    return ret.concat(r);
  }
  return ret;
};

export default pubsub => ({
  Query: {
    orgs: (obj, args, context) => {
      return context.Org.list(args);
    },
    org: (obj, { id }, context) => {
      return context.Org.get(id);
    },

    groups: (obj, args, context) => {
      return context.Group.list(args);
    },
    group: (obj, { id }, context) => {
      return context.Group.get(id);
    },

    users: withAuth(['user:view:all'], (obj, args, context) => {
      return context.User.list(args);
    }),
    user: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:view'] : ['user:view:self'];
      },
      (obj, args, context) => {
        let { id } = args;
        return context.User.get(id);
      }
    ),
    currentUser: (obj, args, context) => {
      if (context.user) {
        return context.User.get(context.user.id);
      } else {
        return null;
      }
    },

    serviceaccounts: (obj, args, context) => {
      return context.ServiceAccount.list(args);
    },
    serviceaccount: (obj, { id }, context) => {
      return context.ServiceAccount.get(id);
    }
  },

  Org: {
    profile(obj) {
      return obj;
    },
    groups(obj, args, context) {
      return context.loaders.getGroupsForOrgId.load(obj.id);
    },
    users(obj, args, context) {
      return Promise.all([
        context.loaders.getUsersForOrgId.load(obj.id),
        context.loaders.getUsersForOrgIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    },
    serviceaccounts(obj, args, context) {
      return Promise.all([
        context.loaders.getServiceAccountsForOrgId.load(obj.id),
        context.loaders.getServiceAccountsForOrgIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    }
  },

  OrgProfile: {
    domain(obj) {
      return obj.domain;
    },
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Group: {
    profile(obj) {
      return obj;
    },
    orgs(obj, args, context) {
      return context.loaders.getOrgsForGroupId.load(obj.id);
    },
    users(obj, args, context) {
      return context.loaders.getUsersForGroupId.load(obj.id);
    },
    serviceaccounts(obj, args, context) {
      return context.loaders.getServiceAccountsForGroupId.load(obj.id);
    }
  },

  GroupProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  User: {
    profile(obj) {
      return obj;
    },
    auth(obj) {
      return obj;
    },
    orgs(obj, args, context) {
      return Promise.all([
        context.loaders.getOrgsForUserId.load(obj.id),
        context.loaders.getOrgsForUserIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    },
    groups(obj, args, context) {
      return context.loaders.getGroupsForUserId.load(obj.id);
    }
  },

  UserProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    firstName(obj) {
      return obj.firstName;
    },
    middleName(obj) {
      return obj.middleName;
    },
    lastName(obj) {
      return obj.lastName;
    },
    title(obj) {
      return obj.title;
    },
    suffix(obj) {
      return obj.suffix;
    },
    language(obj) {
      return obj.language;
    },
    locale(obj) {
      return obj.locale;
    },
    emails(obj) {
      return obj.emails;
    }
  },

  ServiceAccount: {
    profile(obj) {
      return obj;
    },
    auth(obj) {
      return obj;
    },
    orgs(obj, args, context) {
      return Promise.all([
        context.loaders.getOrgsForServiceAccountId.load(obj.id),
        context.loaders.getOrgsForServiceAccountIdViaGroups.load(obj.id)
      ]).then(mergeLoaders);
    },
    groups(obj, args, context) {
      return context.loaders.getGroupsForServiceAccountId.load(obj.id);
    }
  },

  ServiceAccountProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    }
  },

  Mutation: {
    addOrg: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    },
    editOrg: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteOrg: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let org;

        return { org };
      } catch (e) {
        return { errors: e };
      }
    },

    addGroup: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    },
    editGroup: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteGroup: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let group;

        return { group };
      } catch (e) {
        return { errors: e };
      }
    },

    addUser: async (obj, args, context) => {
      try {
        const e = new FieldError();
        let user;

        return { user, errors: null };
      } catch (e) {
        return { user: null, errors: e };
      }
    },
    editUser: withAuth(
      (obj, args, context) => {
        let s = context.user.id !== args.input.id ? ['user:update'] : ['user:update:self'];
        console.log('editUser', context.user.id, context.auth.scope, s, args);
        return s;
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          if (input.email) {
            console.log('updating user email');
            const emailExists = await context.User.getUserByEmail(input.email);
            if (emailExists && emailExists.id !== input.id) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            await context.User.update(input.id, { email: input.email });
          }

          if (input.profile) {
            console.log('updating user profile', input.profile);
            await context.User.updateProfile(input.id, input.profile);
          }

          const user = await context.User.get(input.id);
          console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    ),
    deleteUser: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:delete'] : ['user:delete:self'];
      },
      async (obj, { id }, context) => {
        try {
          const e = new FieldError();

          const user = await context.User.get(id);
          if (!user) {
            e.setError('delete', 'User does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.User.delete(id);
          if (isDeleted) {
            return { user, errors: null };
          } else {
            e.setError('delete', 'Could not delete user. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    ),

    addServiceAccount: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    },
    editServiceAccount: async (obj, { input }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    },
    deleteServiceAccount: async (obj, { id }, context) => {
      try {
        const e = new FieldError();
        let serviceaccount;

        return { serviceaccount };
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {}
});