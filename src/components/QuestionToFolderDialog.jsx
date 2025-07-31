import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, Folder, Plus, Check, Sparkle } from 'lucide-react'; // Added Sparkle
import { useFolderStore } from '../store/folderStore';
import { motion } from 'framer-motion'; // Import Framer Motion

// Framer Motion Variants for buttons
const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const QuestionToFolderDialog = ({ isOpen, onClose, questionId, questionText }) => {
  const { folders, addFolder, addQuestionToFolder } = useFolderStore();
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const handleAddToFolder = () => {
    if (selectedFolderId && questionId) {
      console.log('Adding question to folder:', questionId, selectedFolderId);
      addQuestionToFolder(selectedFolderId, questionId);
      onClose();
      setSelectedFolderId('');
    }
  };

  const handleCreateNewFolder = () => {
    if (newFolderName.trim() && questionId) {
      console.log('Creating new folder and adding question:', newFolderName, questionId);
      const newFolder = addFolder(newFolderName.trim());
      // Add question to the newly created folder
      // Using setTimeout to ensure folder is added to store before adding question
      setTimeout(() => {
        addQuestionToFolder(newFolder.id, questionId);
      }, 100); 
      setNewFolderName('');
      setShowNewFolderInput(false);
      onClose();
    }
  };

  const resetDialog = () => {
    setSelectedFolderId('');
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-gray-950 to-slate-950 border-gray-700 text-white rounded-xl shadow-2xl max-w-md font-cairo" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
            <Folder className="w-6 h-6 text-blue-400 animate-pulse-slow" />
            إضافة السؤال إلى مجلد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Question Preview */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-inner">
            <p className="text-base text-gray-300 line-clamp-2 font-medium">
              {questionText || 'السؤال المحدد'}
            </p>
            {process.env.NODE_ENV === 'development' && questionId && (
              <p className="text-xs text-gray-500 mt-2">ID: {questionId}</p>
            )}
          </div>

          {!showNewFolderInput ? (
            <>
              {/* Existing Folders Selection */}
              {folders.length > 0 ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    اختر مجلد موجود:
                  </label>
                  <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3 text-lg">
                      <SelectValue placeholder="اختر مجلد..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white rounded-lg shadow-lg">
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id} className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer py-2">
                          <div className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{folder.name}</span>
                            <span className="text-sm text-gray-400">
                              ({folder.questionIds?.length || 0} سؤال)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-800/30 border border-gray-700 rounded-lg shadow-inner">
                  <Folder className="w-14 h-14 mx-auto mb-3 text-gray-500 animate-bounce-slow" />
                  <p className="text-gray-400 text-base">لا توجد مجلدات حالياً.</p>
                </div>
              )}

              {/* Create New Folder Button */}
              <motion.button
                variant="outline"
                onClick={() => setShowNewFolderInput(true)}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full flex items-center gap-2 px-4 py-3 border-blue-500 text-blue-300 rounded-lg font-semibold hover:bg-blue-900/30 hover:text-blue-200 transition-all duration-300 shadow-md relative overflow-hidden group"
              >
                <FolderPlus className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
                إنشاء مجلد جديد
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
              </motion.button>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  variant="outline"
                  onClick={handleClose}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 relative overflow-hidden group"
                >
                  إلغاء
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
                <motion.button
                  onClick={handleAddToFolder}
                  disabled={!selectedFolderId || !questionId}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-md relative overflow-hidden group"
                >
                  <Check className="w-5 h-5 ml-2 group-hover:animate-scale-in" />
                  إضافة
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
              </div>
            </>
          ) : (
            <>
              {/* New Folder Creation */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
                  اسم المجلد الجديد:
                </label>
                <Input
                  placeholder="أدخل اسم المجلد"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewFolder()}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  variant="outline"
                  onClick={() => setShowNewFolderInput(false)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 relative overflow-hidden group"
                >
                  رجوع
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
                <motion.button
                  onClick={handleCreateNewFolder}
                  disabled={!newFolderName.trim() || !questionId}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 shadow-md relative overflow-hidden group"
                >
                  <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform duration-300" />
                  إنشاء وإضافة
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionToFolderDialog;
