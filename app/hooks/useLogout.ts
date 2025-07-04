import { useFileUpload } from '../Contexts/UploadContext';
import { useForm } from '../Contexts/FormContext';
import { useClerk } from '@clerk/nextjs';

export const useLogout = () => {
  const { clearContext: clearUploadContext } = useFileUpload();
  const { resetForm } = useForm();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      // Clear all contexts
      clearUploadContext();
      resetForm();
      
      // Sign out from Clerk
      await signOut();
      
      // Force a hard refresh to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { handleLogout };
}; 