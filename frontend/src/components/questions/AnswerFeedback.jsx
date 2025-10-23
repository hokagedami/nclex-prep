function AnswerFeedback({ feedback, onNext }) {
  return (
    <div className={`card ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="text-center mb-4 sm:mb-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4 ${
          feedback.isCorrect ? 'bg-success' : 'bg-error'
        }`}>
          {feedback.isCorrect ? (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${
          feedback.isCorrect ? 'text-success' : 'text-error'
        }`}>
          {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>

        {feedback.pointsEarned > 0 && (
          <p className="text-base sm:text-lg">
            You earned <span className="font-bold">{feedback.pointsEarned} points</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="font-bold mb-2 text-sm sm:text-base">Explanation:</h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{feedback.explanation}</p>

        {!feedback.isCorrect && (
          <div className="mt-3 sm:mt-4">
            <p className="font-medium text-xs sm:text-sm text-gray-600">
              Correct answer(s): {feedback.correctAnswers.join(', ').toUpperCase()}
            </p>
          </div>
        )}
      </div>

      <button onClick={onNext} className="btn-primary w-full text-sm sm:text-base py-3 sm:py-2">
        Next Question
      </button>
    </div>
  );
}

export default AnswerFeedback;
