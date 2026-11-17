// Firebase wiring for sign-in and the feedback log. The config below is public by design;
// access is enforced by database.rules.json.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase, ref, push, set, update, remove, onValue, query, orderByChild, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const app = initializeApp({
  apiKey: 'AIzaSyBAWrFjfqFym2vRIQgToz4T1cg0_lX5U1Q',
  authDomain: 'ojasa-mirai-llp.firebaseapp.com',
  projectId: 'ojasa-mirai-llp',
  appId: '1:189941266299:web:3b8dfc0fcac6eb98d6efde',
  databaseURL: 'https://ojasa-mirai-llp-feedback.asia-southeast1.firebasedatabase.app'
});
const auth = getAuth(app);
const db = getDatabase(app);
// Feedback is segregated per application: /apps/<app name>/walkthroughFeedback.
// The name comes from the app's app.json (feedbackApp) via setAppName.
let appName = 'EVERP';
export const setAppName = (name) => { appName = name; };
const PATH_OF = () => `apps/${appName}/walkthroughFeedback`;

export const ADMIN_EMAIL = 'roopesht@gmail.com';

export const watchUser = (cb) => onAuthStateChanged(auth, cb);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutUser = () => signOut(auth);
export const isAdmin = (user) => user?.email === ADMIN_EMAIL && user.emailVerified;

export async function addFeedback(user, fb) {
  const node = push(ref(db, PATH_OF()));
  await set(node, {
    ...fb,
    uid: user.uid,
    authorName: user.displayName ?? '',
    authorEmail: user.email ?? '',
    status: 'open',
    createdAt: serverTimestamp()
  });
}

export const editFeedback = (id, fields) => update(ref(db, `${PATH_OF()}/${id}`), { ...fields, updatedAt: serverTimestamp() });
export const setStatus = (id, status) => update(ref(db, `${PATH_OF()}/${id}`), { status, updatedAt: serverTimestamp() });
export const deleteFeedback = (id) => remove(ref(db, `${PATH_OF()}/${id}`));

// cb receives [{ id, ...entry }], newest first. Returns the unsubscribe function.
export function watchFeedback(cb, onError) {
  return onValue(
    query(ref(db, PATH_OF()), orderByChild('createdAt')),
    (snap) => {
      const list = [];
      snap.forEach((c) => void list.push({ id: c.key, ...c.val() }));
      cb(list.reverse());
    },
    onError
  );
}
