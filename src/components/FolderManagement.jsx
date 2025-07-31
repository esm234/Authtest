import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  FileText,
  Plus,
  FolderOpen,
  Archive,
  Sparkle, // For extra sparkle effect
  LayoutGrid // New icon for folder management
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';
import FolderView from './FolderView';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delayChildren: 0.2, 
      staggerChildren: 0.1 
    } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  hover: { scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.3)' },
  selected: { scale: 1.02, boxShadow: '0px 10px 40px rgba(0,0,0,0.4)', transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const FolderManagement = ({ onBack }) => {
  const { folders, addFolder, deleteFolder } = useFolderStore();
  const { initializeExam } = useExamStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المجلد؟')) {
      deleteFolder(folderId);
    }
  };

  const handleViewFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleBackToFolders = () => {
    setSelectedFolderId(null);
  };

  const handleStartTest = (questions) => {
    if (!questions || questions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار');
      return;
    }

    console.log('Starting folder test with questions:', questions.length);
    console.log('First question sample:', questions[0]);

    try {
      initializeExam({
        examMode: 'folder',
        timerMode: 'none',
        timerDuration: 0,
        shuffleQuestions: false,
        shuffleChoices: false,
        questionTypeFilter: 'folder',
        selectedQuestionType: null,
        rcQuestionOrder: 'sequential',
        folderQuestions: questions
      });
      
      setSelectedFolderId(null);
      onBack();
    } catch (error) {
      console.error('Error starting folder test:', error);
      alert('حدث خطأ أثناء بدء الاختبار: ' + error.message);
    }
  };

  if (selectedFolderId) {
    return (
      <FolderView
        folderId={selectedFolderId}
        onBack={handleBackToFolders}
        onStartTest={handleStartTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950 text-white font-cairo" dir="rtl">
      {/* Animated Background Elements - More vibrant and dynamic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-700/30 to-purple-700/30 rounded-full blur-3xl animate-blob-1"></div>
        <div className="absolute bottom-20 left-10 w-100 h-100 bg-gradient-to-r from-emerald-700/25 to-cyan-700/25 rounded-full blur-3xl animate-blob-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-700/20 to-rose-700/20 rounded-full blur-3xl animate-blob-3"></div>
        {/* Subtle particle effect overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h3v3H0V0zm3 3h3v3H3V3z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '6px 6px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-gray-700/50 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Title and Back Button */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 w-full sm:w-auto"
              >
                <motion.button
                  variant="outline"
                  onClick={onBack}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/80 border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm sm:text-base relative overflow-hidden group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  <span className="hidden sm:inline">العودة للرئيسية</span>
                  <span className="sm:hidden">رجوع</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                </motion.button>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg flex items-center gap-2">
                  <LayoutGrid className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400 animate-spin-slow" /> {/* New icon */}
                  مجلداتي
                </h1>
              </motion.div>
              
              {/* Add Folder Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <motion.button 
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto relative overflow-hidden group"
                  >
                    <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-6 transition-transform duration-300" />
                    <span className="hidden sm:inline">إضافة مجلد جديد</span>
                    <span className="sm:hidden">مجلد جديد</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white rounded-xl shadow-2xl max-w-[90vw] sm:max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">إضافة مجلد جديد</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <Input
                      placeholder="اسم المجلد"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3 text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                    />
                    <div className="flex gap-3 justify-end">
                      <motion.button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="px-4 sm:px-5 py-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 relative overflow-hidden group"
                      >
                        إلغاء
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                      </motion.button>
                      <motion.button
                        onClick={handleAddFolder}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md relative overflow-hidden group"
                      >
                        إضافة
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                      </motion.button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Folders Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                <span className="font-bold text-blue-300">{folders.length}</span> مجلد
              </p>
              <div className="h-1.5 flex-1 mx-4 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: folders.length > 0 ? `${Math.min((folders.length / 10) * 100, 100)}%` : '0%' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode='wait'>
            {folders.length === 0 ? (
              <motion.div 
                key="no-folders"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="text-center py-16 sm:py-20 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-2xl shadow-xl backdrop-blur-sm"
              >
                <motion.div variants={itemVariants} className="max-w-md mx-auto">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse-slow"></div>
                    </div>
                    <Archive className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-500 relative z-10 animate-bounce-slow" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4">لا توجد مجلدات بعد</h3>
                  <p className="text-gray-400 text-base sm:text-lg mb-8 px-4">
                    ابدأ بإنشاء مجلدك الأول لتنظيم الأسئلة المفضلة لديك
                  </p>
                  <motion.button
                    onClick={() => setIsDialogOpen(true)}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg relative overflow-hidden group"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    إنشاء أول مجلد
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="folders-list"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-xl sm:rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm cursor-pointer"
                    onClick={() => handleViewFolder(folder.id)} // Make the whole card clickable
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300">
                          <FolderOpen className="w-6 h-6 text-blue-400 group-hover:animate-pulse-fast" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white truncate flex-1">
                          {folder.name}
                        </h3>
                      </div>
                      <motion.button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDeleteFolder(folder.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg p-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <FileText className="w-4 h-4 text-blue-300" />
                      <span className="text-sm">
                        <span className="font-semibold text-blue-300">{folder.questionIds.length}</span> سؤال
                      </span>
                    </div>
                    
                    <motion.button
                      variant="outline"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-blue-500/50 text-blue-300 rounded-lg font-medium hover:bg-blue-900/30 hover:text-blue-200 hover:border-blue-400 transition-all duration-300 relative overflow-hidden group"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleViewFolder(folder.id);
                      }}
                    >
                      عرض الأسئلة
                      <ArrowLeft className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></span>
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FolderManagement;
