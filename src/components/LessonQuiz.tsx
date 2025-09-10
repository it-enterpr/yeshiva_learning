import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onRetry: () => void;
}

export default function LessonQuiz({ questions, onComplete, onRetry }: LessonQuizProps) {
  const { darkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setShowResults(true);
    
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    onComplete(score);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    onRetry();
  };

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className={`rounded-2xl p-8 border shadow-xl ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {score >= 80 ? (
              <CheckCircle size={40} className="text-white" />
            ) : (
              <XCircle size={40} className="text-white" />
            )}
          </div>

          <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Результат: {score}%
          </h3>

          <p className={`text-lg mb-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Правильных ответов: {correctAnswers} из {questions.length}
          </p>

          <div className="space-y-4 mb-8">
            {questions.map((question, index) => (
              <div key={question.id} className={`p-4 rounded-xl border ${
                selectedAnswers[index] === question.correctAnswer
                  ? darkMode ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-300'
                  : darkMode ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-300'
              }`}>
                <div className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {index + 1}. {question.question}
                </div>
                <div className={`text-sm ${
                  selectedAnswers[index] === question.correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  Ваш ответ: {question.options[selectedAnswers[index]]}
                </div>
                {selectedAnswers[index] !== question.correctAnswer && (
                  <div className="text-sm text-green-600 mt-1">
                    Правильный ответ: {question.options[question.correctAnswer]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            {score < 80 && (
              <button
                onClick={handleRetry}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                <RotateCcw size={20} className="mr-2" />
                Попробовать снова
              </button>
            )}
            
            <button
              onClick={() => window.history.back()}
              className={`px-6 py-3 rounded-xl transition-colors font-medium ${
                darkMode 
                  ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Вернуться к урокам
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`rounded-2xl p-8 border shadow-xl ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Вопрос {currentQuestion + 1} из {questions.length}
          </span>
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-500/10'
                  : darkMode
                    ? 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : darkMode ? 'border-slate-500' : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-xl transition-colors font-medium ${
            currentQuestion === 0
              ? darkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : darkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Назад
        </button>

        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className={`flex items-center px-6 py-3 rounded-xl transition-colors font-medium ${
            selectedAnswers[currentQuestion] === undefined
              ? darkMode ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}