import analogyData from '../data/analogy.json';
import completionData from '../data/completion.json';
import errorData from '../data/error.json';
import rcBank4Data from '../data/rcbank4.json';
import rcBank5Data from '../data/rcbank5.json';
import oddData from '../data/odd.json';

// Simple hash function for creating unique IDs
const createSimpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Normalize question data structure and assign a truly unique ID
const normalizeQuestion = (question, type, sourceIndex, sourceFile = '') => {
  // Create a truly unique identifier that includes all unique aspects
  const uniqueContent = {
    question: question.question || '',
    choices: Array.isArray(question.choices) ? question.choices : [],
    answer: question.answer,
    passage: question.passage || null,
    question_number: question.question_number || sourceIndex + 1,
    source: sourceFile,
    type: type
  };
  
  const contentString = JSON.stringify(uniqueContent);
  const contentHash = createSimpleHash(contentString);
  
  // Create unique ID with more specificity
  const uniqueId = `${type}-${sourceFile}-${sourceIndex}-${contentHash}`;

  return {
    id: uniqueId,
    question_number: question.question_number || sourceIndex + 1,
    question: question.question || '',
    type: type,
    choices: Array.isArray(question.choices) ? [...question.choices] : [],
    answer: question.answer,
    passage: question.passage || null,
    category: question.category || type,
    exam: question.exam || '',
    passage_id: question.passage ? createSimpleHash(question.passage) : null
  };
};

// Shuffle array function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Load and process all question data once when the module is loaded
const initialQuestionPools = (() => {
  const pools = {
    analogy: [],
    completion: [],
    error: [],
    rc: [],
    odd: []
  };
  
  try {
    if (analogyData && Array.isArray(analogyData)) {
      analogyData.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.analogy.push(normalizeQuestion(q, 'analogy', index, 'analogy'));
        }
      });
    }
    
    if (completionData && Array.isArray(completionData)) {
      completionData.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.completion.push(normalizeQuestion(q, 'completion', index, 'completion'));
        }
      });
    }
    
    if (errorData && Array.isArray(errorData)) {
      errorData.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.error.push(normalizeQuestion(q, 'error', index, 'error'));
        }
      });
    }
    
    if (rcBank4Data && Array.isArray(rcBank4Data)) {
      rcBank4Data.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.rc.push(normalizeQuestion(q, 'rc', index, 'rcbank4'));
        }
      });
    }
    
    if (rcBank5Data && Array.isArray(rcBank5Data)) {
      rcBank5Data.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.rc.push(normalizeQuestion(q, 'rc', index, 'rcbank5'));
        }
      });
    }
    
    if (oddData && Array.isArray(oddData)) {
      oddData.forEach((q, index) => {
        if (q && (q.question || q.choices)) {
          pools.odd.push(normalizeQuestion(q, 'odd', index, 'odd'));
        }
      });
    }
    
    console.log('Question pools loaded:', {
      analogy: pools.analogy.length,
      completion: pools.completion.length,
      error: pools.error.length,
      rc: pools.rc.length,
      odd: pools.odd.length
    });
    
  } catch (error) {
    console.error('Error loading question data:', error);
  }
  
  return pools;
})();

// Function to get all questions for use in folder management
export const getAllQuestions = () => {
  const allQuestions = [];
  Object.values(initialQuestionPools).forEach(pool => {
    allQuestions.push(...pool);
  });
  return allQuestions;
};

// Group RC questions by passage for sequential ordering and limit per passage
export const groupRCQuestionsByPassage = (rcQuestions, maxQuestionsPerPassage) => {
  const passageGroups = new Map();
  
  rcQuestions.forEach(question => {
    const passageKey = question.passage_id || question.passage || 'no-passage';
    if (!passageGroups.has(passageKey)) {
      passageGroups.set(passageKey, []);
    }
    passageGroups.get(passageKey).push(question);
  });
  
  const finalPassageGroups = [];
  passageGroups.forEach((questions, passageKey) => {
    // Sort questions within each passage by their original question number
    questions.sort((a, b) => (a.question_number || 0) - (b.question_number || 0));
    // Take only the first maxQuestionsPerPassage questions from each passage
    finalPassageGroups.push(questions.slice(0, maxQuestionsPerPassage));
  });
  
  return finalPassageGroups;
};

// Helper function to ensure answer is in correct format
const normalizeAnswer = (question) => {
  const processedQuestion = { ...question };
  
  // Ensure answer is converted to index if it's stored as text
  if (typeof processedQuestion.answer === 'string' && processedQuestion.choices && processedQuestion.choices.length > 0) {
    const answerIndex = processedQuestion.choices.findIndex(choice => choice === processedQuestion.answer);
    processedQuestion.answer = answerIndex >= 0 ? answerIndex : 0;
  }
  
  // Ensure answer is a number
  if (typeof processedQuestion.answer !== 'number') {
    processedQuestion.answer = 0;
  }
  
  return processedQuestion;
};

// Generate exam with exactly 65 questions (5 sections × 13 questions each)
export const generateExam = (config = {}) => {
  console.log('generateExam called with config:', config);
  
  const {
    shuffleQuestions = false,
    shuffleChoices = false,
    examMode = 'sectioned',
    rcQuestionOrder = 'sequential',
    questionTypeFilter = 'all',
    selectedQuestionType = null,
    folderQuestions = null
  } = config;

  let examQuestions = [];
  const usedQuestionIds = new Set();

  // Folder mode - use provided folder questions
  if (folderQuestions && Array.isArray(folderQuestions) && folderQuestions.length > 0) {
    console.log(`Generating folder exam with ${folderQuestions.length} questions`);
    
    folderQuestions.forEach((q, index) => {
      const processedQuestion = normalizeAnswer({
        ...q,
        question_number: index + 1,
        section: 1,
        original_type: q.type
      });

      // Shuffle choices if requested
      if (shuffleChoices && processedQuestion.choices && processedQuestion.choices.length > 0) {
        const originalChoices = [...processedQuestion.choices];
        const originalAnswer = processedQuestion.answer;
        let originalCorrectChoice;
        
        if (typeof originalAnswer === 'number' && originalAnswer < originalChoices.length) {
          originalCorrectChoice = originalChoices[originalAnswer];
        } else {
          originalCorrectChoice = originalAnswer;
        }
        
        const shuffledChoices = shuffleArray(originalChoices);
        const newAnswerIndex = shuffledChoices.findIndex(choice => choice === originalCorrectChoice);
        
        processedQuestion.choices = shuffledChoices;
        processedQuestion.answer = newAnswerIndex >= 0 ? newAnswerIndex : 0;
      }

      examQuestions.push(processedQuestion);
    });

    return {
      questions: examQuestions,
      totalQuestions: examQuestions.length,
      totalSections: 1,
      questionsPerSection: examQuestions.length,
      structure: { folder: examQuestions.length }
    };
  }

  // Determine if this is single section mode
  const isSingleMode = examMode === 'single' || questionTypeFilter === 'specific';
  const singleSectionType = selectedQuestionType;

  console.log('Mode detection:', { isSingleMode, singleSectionType, examMode, questionTypeFilter });

  // Single section mode - only questions from one type
  if (isSingleMode && singleSectionType) {
    console.log(`Generating single section exam for type: ${singleSectionType}`);
    
    let pool = [...(initialQuestionPools[singleSectionType] || [])];
    
    if (pool.length === 0) {
      console.warn(`No questions available for single section type: ${singleSectionType}`);
      return {
        questions: [],
        totalQuestions: 0,
        totalSections: 1,
        questionsPerSection: 0,
        structure: { [singleSectionType]: 0 }
      };
    }

    let selectedQuestions = [];

    if (singleSectionType === 'rc') {
      // For RC questions, handle random vs sequential ordering
      if (rcQuestionOrder === 'random') {
        // Shuffle all RC questions randomly
        pool = shuffleArray(pool);
        selectedQuestions = pool.slice(0, 65);
      } else {
        // Group by passage and ensure sequential order within each passage
        // But shuffle the passages themselves to get variety
        const groupedRC = groupRCQuestionsByPassage(pool, 4);
        const shuffledPassages = shuffleArray(groupedRC);
        
        let flattenedQuestions = [];
        shuffledPassages.forEach(passageGroup => {
          flattenedQuestions.push(...passageGroup);
        });
        selectedQuestions = flattenedQuestions.slice(0, 65);
      }
    } else {
      // For other question types, shuffle to get variety
      pool = shuffleArray(pool);
      selectedQuestions = pool.slice(0, 65);
    }

    // If we don't have enough questions, repeat them
    if (selectedQuestions.length < 65 && selectedQuestions.length > 0) {
      const remainingSlots = 65 - selectedQuestions.length;
      for (let i = 0; i < remainingSlots; i++) {
        const sourceQuestion = selectedQuestions[i % selectedQuestions.length];
        selectedQuestions.push({
          ...sourceQuestion,
          id: `${sourceQuestion.id}-repeat-${i}`,
          question_number: selectedQuestions.length + 1
        });
      }
    }

    // Process questions for single mode
    selectedQuestions.forEach((q, index) => {
      const processedQuestion = normalizeAnswer({
        ...q,
        question_number: index + 1,
        section: 1,
        original_type: q.type
      });

      // Shuffle choices if requested
      if (shuffleChoices && processedQuestion.choices && processedQuestion.choices.length > 0) {
        const originalChoices = [...processedQuestion.choices];
        const originalAnswer = processedQuestion.answer;
        let originalCorrectChoice;
        
        if (typeof originalAnswer === 'number' && originalAnswer < originalChoices.length) {
          originalCorrectChoice = originalChoices[originalAnswer];
        } else {
          originalCorrectChoice = originalAnswer;
        }
        
        const shuffledChoices = shuffleArray(originalChoices);
        const newAnswerIndex = shuffledChoices.findIndex(choice => choice === originalCorrectChoice);
        
        processedQuestion.choices = shuffledChoices;
        processedQuestion.answer = newAnswerIndex >= 0 ? newAnswerIndex : 0;
      }

      examQuestions.push(processedQuestion);
    });

    console.log(`Generated ${examQuestions.length} questions for single section type: ${singleSectionType}`);
    
    return {
      questions: examQuestions,
      totalQuestions: 65,
      totalSections: 1,
      questionsPerSection: 65,
      structure: { [singleSectionType]: 65 }
    };
  }

  // Multi-section mode - balanced questions across all types
  // Fixed order: analogy, completion, error, rc, odd
  const questionOrder = ['analogy', 'completion', 'error', 'rc', 'odd'];
  
  const sectionStructures = [
    // Section 1
    { analogy: 4, completion: 2, error: 2, rc: 5, odd: 0, rc_max_per_passage: 5 },
    // Section 2
    { analogy: 4, completion: 2, error: 2, rc: 5, odd: 0, rc_max_per_passage: 5 },
    // Section 3 (Special)
    { analogy: 2, completion: 2, error: 2, rc: 5, odd: 2, rc_max_per_passage: 5 },
    // Section 4
    { analogy: 4, completion: 2, error: 2, rc: 5, odd: 0, rc_max_per_passage: 5 },
    // Section 5
    { analogy: 4, completion: 2, error: 2, rc: 5, odd: 0, rc_max_per_passage: 5 }
  ];

  // Create pools for each question type
  const questionPools = {
    analogy: [...initialQuestionPools.analogy],
    completion: [...initialQuestionPools.completion],
    error: [...initialQuestionPools.error],
    rc: [...initialQuestionPools.rc],
    odd: [...initialQuestionPools.odd]
  };

  // Shuffle pools if requested
  if (shuffleQuestions) {
    Object.keys(questionPools).forEach(type => {
      if (type !== 'rc' || rcQuestionOrder === 'random') {
        questionPools[type] = shuffleArray(questionPools[type]);
      }
    });
  }

  for (let section = 1; section <= 5; section++) {
    let sectionQuestions = [];
    const structure = sectionStructures[section - 1];

    // Add questions in the specified order
    for (const questionType of questionOrder) {
      const count = structure[questionType] || 0;
      if (count === 0) continue;

      let availableQuestions = questionPools[questionType].filter(q => !usedQuestionIds.has(q.id));
      let questionsToAdd = [];

      if (questionType === 'rc') {
        // For RC questions, handle random vs sequential ordering
        if (rcQuestionOrder === 'random') {
          // Shuffle available RC questions and take the required count
          availableQuestions = shuffleArray(availableQuestions);
          questionsToAdd = availableQuestions.slice(0, count);
        } else {
          // Group by passage and maintain sequential order within passages
          // But shuffle the passages themselves to get variety
          const groupedRC = groupRCQuestionsByPassage(availableQuestions, structure.rc_max_per_passage);
          const shuffledPassages = shuffleArray(groupedRC);
          
          for (const passageGroup of shuffledPassages) {
            if (questionsToAdd.length + passageGroup.length <= count) {
              questionsToAdd.push(...passageGroup);
            } else {
              const remaining = count - questionsToAdd.length;
              questionsToAdd.push(...passageGroup.slice(0, remaining));
              break;
            }
          }
        }
      } else {
        questionsToAdd = availableQuestions.slice(0, count);
      }

      // Mark questions as used
      questionsToAdd.forEach(q => usedQuestionIds.add(q.id));

      // Process questions
      questionsToAdd.forEach(q => {
        const processedQuestion = normalizeAnswer({
          ...q,
          section: section,
          original_type: q.type
        });

        // Shuffle choices if requested
        if (shuffleChoices && processedQuestion.choices && processedQuestion.choices.length > 0) {
          const originalChoices = [...processedQuestion.choices];
          const originalAnswer = processedQuestion.answer;
          let originalCorrectChoice;
          
          if (typeof originalAnswer === 'number' && originalAnswer < originalChoices.length) {
            originalCorrectChoice = originalChoices[originalAnswer];
          } else {
            originalCorrectChoice = originalAnswer;
          }
          
          const shuffledChoices = shuffleArray(originalChoices);
          const newAnswerIndex = shuffledChoices.findIndex(choice => choice === originalCorrectChoice);
          
          processedQuestion.choices = shuffledChoices;
          processedQuestion.answer = newAnswerIndex >= 0 ? newAnswerIndex : 0;
        }

        sectionQuestions.push(processedQuestion);
      });
    }

    examQuestions.push(...sectionQuestions);
  }

  // Re-number questions sequentially
  examQuestions.forEach((q, index) => {
    q.question_number = index + 1;
  });

  console.log(`Generated ${examQuestions.length} questions across ${5} sections`);

  return {
    questions: examQuestions,
    totalQuestions: 65,
    totalSections: 5,
    questionsPerSection: 13,
    structure: {
      analogy: 18,
      completion: 10,
      error: 10,
      rc: 25,
      odd: 2
    }
  };
};

export default {
  generateExam,
  groupRCQuestionsByPassage,
  shuffleArray,
  getAllQuestions
};
