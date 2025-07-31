import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFolderStore = create(
  persist(
    (set, get) => ({
      folders: [],
      
      addFolder: (name) => {
        const newFolder = {
          id: Date.now().toString(),
          name,
          questionIds: [],
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          folders: [...state.folders, newFolder]
        }));
        
        console.log('Added new folder:', newFolder);
        return newFolder; // Return the created folder
      },
      
      deleteFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.filter(folder => folder.id !== folderId)
        }));
        console.log('Deleted folder:', folderId);
      },
      
      addQuestionToFolder: (folderId, questionId) => {
        if (!questionId) {
          console.warn('Cannot add question to folder: questionId is empty');
          return;
        }
        
        set((state) => ({
          folders: state.folders.map(folder => {
            if (folder.id === folderId) {
              // Check if question is already in folder
              if (folder.questionIds.includes(questionId)) {
                console.log('Question already in folder:', questionId);
                return folder;
              }
              
              console.log('Adding question to folder:', questionId, 'to folder:', folderId);
              return {
                ...folder,
                questionIds: [...folder.questionIds, questionId]
              };
            }
            return folder;
          })
        }));
      },
      
      removeQuestionFromFolder: (folderId, questionId) => {
        set((state) => ({
          folders: state.folders.map(folder => {
            if (folder.id === folderId) {
              console.log('Removing question from folder:', questionId, 'from folder:', folderId);
              return {
                ...folder,
                questionIds: folder.questionIds.filter(id => id !== questionId)
              };
            }
            return folder;
          })
        }));
      },
      
      updateFolderName: (folderId, newName) => {
        set((state) => ({
          folders: state.folders.map(folder => 
            folder.id === folderId 
              ? { ...folder, name: newName }
              : folder
          )
        }));
      },
      
      clearAllFolders: () => {
        set({ folders: [] });
      }
    }),
    {
      name: 'folder-storage',
      version: 1,
    }
  )
);
