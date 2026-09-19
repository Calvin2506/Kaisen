import db from "./firebase";

export const usersCollection = db.collection("users");
export const subscriptionsCollection = db.collection("subscriptions");

export async function findUserByEmail(email) {
  const snapshot = await usersCollection.where("email", "==", email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function createUser(data) {
  const docRef = await usersCollection.add({
    ...data,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...data };
}

export async function getUserById(id) {
  const doc = await usersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getSubscriptionsByUserId(userId) {
  const snapshot = await subscriptionsCollection
    .where("userId", "==", userId)
    .orderBy("nextPayDate", "asc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createSubscription(data) {
  const docRef = await subscriptionsCollection.add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: docRef.id, ...data };
}

export async function updateSubscription(id, userId, data) {
  const docRef = subscriptionsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().userId !== userId) return null;
  await docRef.update({ ...data, updatedAt: new Date() });
  return { id, ...data };
}

export async function deleteSubscription(id, userId) {
  const docRef = subscriptionsCollection.doc(id);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().userId !== userId) return false;
  await docRef.delete();
  return true;
}

export default {
  user: {
    findUnique: async ({ where }) => {
      if (where.email) return findUserByEmail(where.email);
      if (where.id) return getUserById(where.id);
      return null;
    },
    create: async ({ data }) => createUser(data),
  },
  subscription: {
    findMany: async ({ where, orderBy }) => {
      if (where.userId) return getSubscriptionsByUserId(where.userId);
      return [];
    },
    create: async ({ data }) => createSubscription(data),
    updateMany: async ({ where, data }) => {
      if (where.id && where.userId) {
        const result = await updateSubscription(where.id, where.userId, data);
        return result ? { count: 1 } : { count: 0 };
      }
      return { count: 0 };
    },
    deleteMany: async ({ where }) => {
      if (where.id && where.userId) {
        const result = await deleteSubscription(where.id, where.userId);
        return { count: result ? 1 : 0 };
      }
      return { count: 0 };
    },
  },
};