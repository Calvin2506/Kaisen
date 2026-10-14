import { getDatabase } from "./firebase";

const usersCollection = () => getDatabase().collection("users");
const subscriptionsCollection = () => getDatabase().collection("subscriptions");
const paymentsCollection = () => getDatabase().collection("payments");

export async function findUserByEmail(email) {
  const snapshot = await usersCollection().where("email", "==", email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function createUser(data) {
  const docRef = await usersCollection().add({
    ...data,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...data };
}

export async function getUserById(id) {
  const doc = await usersCollection().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getSubscriptionsByUserId(userId) {
  const snapshot = await subscriptionsCollection()
    .where("userId", "==", userId)
    .orderBy("nextPayDate", "asc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getSubscriptionById(id, userId) {
  const doc = await subscriptionsCollection().doc(id).get();
  if (!doc.exists || doc.data().userId !== userId) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createSubscription(data) {
  const docRef = await subscriptionsCollection().add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: docRef.id, ...data };
}

export async function createSubscriptions(items) {
  const db = getDatabase();
  const batch = db.batch();
  const createdAt = new Date();
  const created = items.map((data) => {
    const ref = subscriptionsCollection().doc();
    batch.set(ref, { ...data, createdAt, updatedAt: createdAt });
    return { id: ref.id, ...data };
  });
  await batch.commit();
  return created;
}

export async function updateSubscription(id, userId, data) {
  const docRef = subscriptionsCollection().doc(id);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().userId !== userId) return null;
  await docRef.update({ ...data, updatedAt: new Date() });
  return { id, ...data };
}

export async function deleteSubscription(id, userId) {
  const docRef = subscriptionsCollection().doc(id);
  const doc = await docRef.get();
  if (!doc.exists || doc.data().userId !== userId) return false;
  await docRef.delete();
  return true;
}

export async function getPaymentsByUserId(userId) {
  const snapshot = await paymentsCollection().where("userId", "==", userId).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((first, second) => {
      const firstDate = first.paidAt?.toDate?.() || new Date(first.paidAt);
      const secondDate = second.paidAt?.toDate?.() || new Date(second.paidAt);
      return secondDate - firstDate;
    });
}

export async function recordSubscriptionPayment(subscriptionId, userId, nextPayDate) {
  const db = getDatabase();
  const subscriptionRef = subscriptionsCollection().doc(subscriptionId);
  const paymentRef = paymentsCollection().doc();

  return db.runTransaction(async (transaction) => {
    const subscriptionDoc = await transaction.get(subscriptionRef);
    if (!subscriptionDoc.exists || subscriptionDoc.data().userId !== userId) return null;

    const subscription = subscriptionDoc.data();
    const paidAt = new Date();
    const payment = {
      userId,
      subscriptionId,
      subscriptionName: subscription.name,
      amount: Number(subscription.amount),
      currency: subscription.currency || "INR",
      billingCycle: subscription.billingCycle,
      paidAt,
    };

    transaction.set(paymentRef, payment);
    transaction.update(subscriptionRef, { nextPayDate, lastPaidAt: paidAt, updatedAt: paidAt });
    return { id: paymentRef.id, ...payment, nextPayDate };
  });
}

const dbAdapter = {
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

export default dbAdapter;
