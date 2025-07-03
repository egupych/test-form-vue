import { ref, onUnmounted } from 'vue';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile // <-- ДОБАВЛЕНО
} from 'firebase/auth';
import { auth } from '../firebase'; // Импортируем auth из нашего файла
import defaultAvatar from '@/assets/images/app/avatar.svg'; // <-- ДОБАВЛЕНО

const user = ref(null);
const authError = ref(null);

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
  authError.value = null;
});

onUnmounted(() => {
  unsubscribe();
});

const signInWithGoogle = async () => {
  authError.value = null;
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Ошибка аутентификации Google:", error);
    authError.value = "Не удалось войти с помощью Google. Попробуйте снова.";
  }
};

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ РЕГИСТРАЦИИ ---
const signUpWithEmail = async (email, password, displayName) => {
  authError.value = null;
  try {
    // 1. Создаем пользователя
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Обновляем его профиль, добавляя имя и аватарку
    await updateProfile(userCredential.user, {
      displayName: displayName,
      photoURL: defaultAvatar 
    });

    // 3. Обновляем локальное состояние пользователя, чтобы изменения сразу отразились
    user.value = {
        ...user.value,
        displayName: displayName,
        photoURL: defaultAvatar,
    };

  } catch (error) {
    console.error("Ошибка регистрации:", error.code);
    switch (error.code) {
      case 'auth/email-already-in-use':
        authError.value = 'Этот email уже зарегистрирован.';
        break;
      case 'auth/weak-password':
        authError.value = 'Пароль слишком слабый. Он должен содержать не менее 6 символов.';
        break;
      case 'auth/invalid-email':
        authError.value = 'Некорректный email адрес.';
        break;
      default:
        authError.value = 'Произошла ошибка при регистрации.';
    }
  }
};

const signInWithEmail = async (email, password) => {
  authError.value = null;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Ошибка входа:", error.code);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        authError.value = 'Неправильный email или пароль.';
        break;
      case 'auth/invalid-email':
        authError.value = 'Некорректный email адрес.';
        break;
      default:
        authError.value = 'Произошла ошибка при входе.';
    }
  }
};


const signOut = async () => {
  authError.value = null;
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Ошибка выхода:", error);
    authError.value = "Произошла ошибка при выходе.";
  }
};

export function useAuth() {
  return { user, authError, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail };
}