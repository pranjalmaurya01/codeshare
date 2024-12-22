import { FileFireBaseI } from '@/app/share/components/editorSideMenu';
import { addDoc, collection, getFirestore } from 'firebase/firestore/lite';
import getFirebaseApp from './config';

const app = getFirebaseApp();
const db = getFirestore(app);

export async function createNewFile(file: FileFireBaseI) {
  try {
    const filesCol = collection(db, 'files', 'projectId', file.project_id);
    const docRef = await addDoc(filesCol, file);
    console.log('File created with ID:', docRef.id);
    return docRef.id; // Return the new document ID
  } catch (error) {
    console.error('Error creating new file:', error);
    throw new Error('Unable to create new file.');
  }
}
