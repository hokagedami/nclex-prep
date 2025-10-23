function QuestionCard({ question, selectedAnswers, onAnswerSelect, onSubmit, submitting }) {
  const handleAnswerClick = (answerId) => {
    if (question.type === 'SINGLE') {
      onAnswerSelect([answerId]);
    } else {
      if (selectedAnswers.includes(answerId)) {
        onAnswerSelect(selectedAnswers.filter(id => id !== answerId));
      } else {
        onAnswerSelect([...selectedAnswers, answerId]);
      }
    }
  };

  return (
    <div className="card">
      <div className="mb-4 sm:mb-6">
        <span className="inline-block px-3 py-1 bg-primary text-white text-xs sm:text-sm rounded-full mb-3 sm:mb-4">
          {question.category}
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-medium mb-2 leading-relaxed">{question.content}</h2>
        <p className="text-xs sm:text-sm text-gray-600">
          {question.type === 'SINGLE'
            ? 'Select one answer'
            : 'Select all that apply'}
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {question.allAnswers.map((answer) => {
          const isSelected = selectedAnswers.includes(answer.id);

          return (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 text-sm sm:text-base leading-relaxed">{answer.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6">
        <button
          onClick={onSubmit}
          disabled={selectedAnswers.length === 0 || submitting}
          className="btn-primary w-full text-sm sm:text-base py-3 sm:py-2"
        >
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
