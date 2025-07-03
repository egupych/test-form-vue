import { ref, onUnmounted } from 'vue';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile, // Оставляем для возможных будущих обновлений профиля
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../firebase';
import defaultAvatar from '@/assets/images/app/avatar.svg';

const user = ref(null);
const authError = ref(null);

const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // При входе по ссылке может не быть displayName. Установим email в качестве имени, если его нет.
    const displayName = firebaseUser.displayName || firebaseUser.email;
    
    // Если у нового пользователя нет фото, устанавливаем аватарку по умолчанию
    if (firebaseUser.photoURL === null) {
      updateProfile(firebaseUser, { photoURL: defaultAvatar });
    }

    user.value = {
      uid: firebaseUser.uid,
      displayName: displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || defaultAvatar,
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

const sendSignInLink = async (email) => {
    authError.value = null;
    const actionCodeSettings = {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        return true; 
    } catch (error) {
        console.error("Ошибка отправки ссылки:", error.code);
        switch (error.code) {
            case 'auth/invalid-email':
                authError.value = 'Некорректный email адрес.';
                break;
            default:
                authError.value = 'Не удалось отправить ссылку. Попробуйте позже.';
        }
        return false;
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
  return { 
    user, 
    authError, 
    signInWithGoogle, 
    signOut, 
    sendSignInLink,
    isSignInWithEmailLink,
    signInWithEmailLink
  };
}