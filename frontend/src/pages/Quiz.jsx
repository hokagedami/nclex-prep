import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import QuestionCard from '../components/questions/QuestionCard';
import AnswerFeedback from '../components/questions/AnswerFeedback';

function Quiz() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      setSelectedAnswers([]);
      const data = await api.get('/questions/next');
      setQuestion(data.question);
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswers.length === 0) return;

    try {
      setSubmitting(true);
      const data = await api.post(`/questions/${question.id}/answer`, {
        selectedAnswers,
        timeSpent: 0
      });
      setFeedback(data);
      // Refresh user data to update points in navbar
      await refreshUser();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading question...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="card text-center">
        <p className="text-xl mb-4">No more questions available</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Practice Session</h1>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary w-full sm:w-auto"
        >
          End Session
        </button>
      </div>

      {!feedback ? (
        <QuestionCard
          question={question}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={setSelectedAnswers}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <AnswerFeedback
          feedback={feedback}
          onNext={loadQuestion}
        />
      )}
    </div>
  );
}

export default Quiz;
