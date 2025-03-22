export interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  walletBalance?: number;
  emailVerified?: boolean;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'currentUser',
    name: email.split('@')[0],
    email: email,
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    walletBalance: 100,
    emailVerified: true
  };
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'currentUser',
    name: name,
    email: email,
    profilePic: undefined,
    walletBalance: 50,
    emailVerified: true
  };
};

export const logoutUser = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const verifyEmail = async (email: string, code: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const checkAuthStatus = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return false;
};
