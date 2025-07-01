import { ref, onUnmounted } from 'vue';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Импортируем auth из нашего файла

const user = ref(null);

const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    user.value = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    };
  } else {
    user.value = null;
  }
});

onUnmounted(() => {
  unsubscribe();
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Ошибка аутентификации Google:", error);
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Ошибка выхода:", error);
  }
};

export function useAuth() {
  return { user, signInWithGoogle, signOut };
}