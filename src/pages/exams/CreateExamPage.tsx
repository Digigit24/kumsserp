import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Printer, Save } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'long_answer' | 'true_false';
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export const CreateExamPage: React.FC = () => {
  const [examDetails, setExamDetails] = useState({
    examName: '',
    subject: '',
    maxMarks: '',
    allowedTime: '',
    printCount: '1',
    instructions: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'multiple_choice',
    questionText: '',
    marks: 1,
    options: ['', '', '', ''],
  });

  const addQuestion = () => {
    if (!currentQuestion.questionText) {
      alert('Please enter question text');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type || 'multiple_choice',
      questionText: currentQuestion.questionText,
      marks: currentQuestion.marks || 1,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setQuestions([...questions, newQuestion]);

    // Reset current question
    setCurrentQuestion({
      type: 'multiple_choice',
      questionText: '',
      marks: 1,
      options: ['', '', '', ''],
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', { examDetails, questions });
    alert('Exam saved as draft!');
  };

  const handleSubmitToPrint = () => {
    if (!examDetails.examName || !examDetails.subject || !examDetails.maxMarks) {
      alert('Please fill in all exam details');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    console.log('Submitting to print store...', { examDetails, questions });
    alert(`Exam submitted to store for printing!\nPrint Count: ${examDetails.printCount} copies`);
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Examination Test</h1>
        <p className="text-muted-foreground mt-2">
          Create a new test with questions and forward to store for printing
        </p>
      </div>

      {/* Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Name *</label>
              <input
                type="text"
                placeholder="e.g., Mid-term Mathematics Exam"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.examName}
                onChange={(e) => setExamDetails({ ...examDetails, examName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.subject}
                onChange={(e) => setExamDetails({ ...examDetails, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="english">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Marks *</label>
              <input
                type="number"
                placeholder="100"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.maxMarks}
                onChange={(e) => setExamDetails({ ...examDetails, maxMarks: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Current total from questions: {totalMarks} marks
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Allowed Time (minutes) *</label>
              <input
                type="number"
                placeholder="180"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.allowedTime}
                onChange={(e) => setExamDetails({ ...examDetails, allowedTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Print Count *</label>
              <input
                type="number"
                placeholder="1"
                min="1"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.printCount}
                onChange={(e) => setExamDetails({ ...examDetails, printCount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Number of copies to print</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">General Instructions</label>
              <textarea
                rows={3}
                placeholder="Enter general instructions for students"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={examDetails.instructions}
                onChange={(e) => setExamDetails({ ...examDetails, instructions: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Question */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question Type</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    type: e.target.value as Question['type']
                  })}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="long_answer">Long Answer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Marks</label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    marks: parseInt(e.target.value) || 1
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Text</label>
              <textarea
                rows={3}
                placeholder="Enter your question here"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  questionText: e.target.value
                })}
              />
            </div>

            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 bg-muted rounded">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(currentQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                    />
                  </div>
                ))}
                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Correct Answer (Optional)</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={currentQuestion.correctAnswer || ''}
                    onChange={(e) => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: e.target.value
                    })}
                  >
                    <option value="">Select correct answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Correct Answer (Optional)</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={currentQuestion.correctAnswer || ''}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    correctAnswer: e.target.value
                  })}
                >
                  <option value="">Select correct answer</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            )}

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question to Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">Q{index + 1}.</span>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {question.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          {question.marks} marks
                        </span>
                      </div>
                      <p className="text-sm mt-2">{question.questionText}</p>

                      {question.options && question.options.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((opt, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              {String.fromCharCode(65 + idx)}. {opt || '(empty)'}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.correctAnswer && (
                        <p className="text-xs text-green-600 mt-2">
                          Correct Answer: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4 bg-background p-4 border rounded-lg shadow-lg">
        <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={handleSubmitToPrint} className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          Submit to Store for Printing ({examDetails.printCount} copies)
        </Button>
      </div>
    </div>
  );
};
