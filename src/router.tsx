import { createBrowserRouter, Navigate } from "react-router-dom";

import AdminAddQuestion from "./pages/admin-add-question/AdminAddQuestion";
import AdminAddQuiz from "./pages/admin-add-quiz/AdminAddQuiz";

import AdminEditQuestion from "./pages/admin-edit-question/AdminEditQuestion";
import AdminEditQuiz from "./pages/admin-edit-quiz/AdminEditQuiz";
import AdminDataAddTopic from "./pages/admin-quizzes-add-topic/AdminQuizzesAddTopic";
import AdminDataEditTopic from "./pages/admin-quizzes-edit-topic/AdminQuizzesEditTopic";
import AdminQuizzesQuizzes from "./pages/admin-quizzes-quizzes/AdminQuizzesQuizzes";
import AdminQuizzesSubjects from "./pages/admin-quizzes-subjects/AdminQuizzesSubjects";
import AdminQuizTopics from "./pages/admin-quizzes-topics/AdminQuizzesTopics";
import ContentCreatorSignIn from "./pages/content-creator-sign-in/ContentCreatorSignIn";
import ContentCreatorLayout from "./components/content-creator-layout/ContentCreatorLayout";
import ContentCreatorDashboard from "./pages/content-creator-dashboard/ContentCreatorDashboard";
import CreatorProfile from "./components/content-creator-layout/ccProfile";
import CreatorLogout from "./components/content-creator-layout/ccLogout";
import CCQuizzesSubjects from "./pages/content-creator-quizzes/components/CCQuizzesSubjects";
import CCQuizzesTopics from "./pages/content-creator-quizzes/components/CCQuizzesTopics";
import UnverifiedQuizTable from "./pages/content-creator-quizzes/components/UnverifiedQuizTable";
import ContentQuizTable from "./pages/content-creator-quizzes/components/CCQuizTable";
import ContestQuizzesTopics from "./pages/admin-contests-contests/components/ContestQuizTopics";
import ContestQuizzesQuizzes from "./pages/admin-contests-contests/components/ContestQuizzesQuizzes";
import ContestAddQuiz from "./pages/admin-contests-contests/components/ContestAddQuiz";
import ContestEditQuiz from "./pages/admin-contests-contests/components/ContestEditQuiz";
import ContestAddQuestion from "./pages/admin-contests-contests/components/ContestAddQuestion";
import ContestEditQuestion from "./pages/admin-contests-contests/components/ContestEditQuestion";
import ContestQuizTable from "./pages/content-creator-contest-quizz-add/ContestQuizTable";
import ContestSubjectTable from "./pages/content-creator-contest-quizz-add/ContestSubjectTable";
import AllCreatorUnverified from "./pages/all-creator-unverified-quizzes/AllCreatorUnverified";
import CCEditQuiz from "./pages/all-creator-unverified-quizzes/CCEditQuiz";
import CCAddQuestion from "./pages/all-creator-unverified-quizzes/CCAddQuestion";
import CCEditQuestion from "./pages/all-creator-unverified-quizzes/CCEditQuestion";
import AdminQuestionReports from "./pages/admin-question-reports/AdminQuestionReports";
import DetailQuestionReport from "./pages/admin-question-reports/DetailQuestionReport";
import ContentFlashCards from "./pages/creator-flashcards/CCFlashCardTable";
import ContentFlashCardSubjects from "./pages/creator-flashcards/CCFlashCardSubject";
import AdminAddCards from "./pages/admin-add-flashcard/AdminAddCards";
import AllCreatorUnverifiedFiltered from "./pages/all-creator-unverified-filtered-quizzes/AllCreatorUnverifiedFiltered";

export const router = createBrowserRouter([
  { path: "", element: <ContentCreatorSignIn /> },

  {
    path: "cc",
    element: <ContentCreatorLayout />,
    children: [
      { path: "", element: <Navigate replace to={"/cc/add-question"} /> },
      { path: "profile", element: <CreatorProfile /> },
      { path: "profile/logout", element: <CreatorLogout /> },

      { path: "lists", element: <ContentQuizTable /> },
      { path: "lists/:gradeId", element: <CCQuizzesSubjects /> },
      { path: "lists/:gradeId/:subjectId", element: <CCQuizzesTopics /> },
      {
        path: "lists/:gradeId/:subjectId/:topicId",
        element: <UnverifiedQuizTable />,
      },

      { path: "flashcards", element: <ContentFlashCards /> },
      { path: "flashcards/:gradeId", element: <ContentFlashCardSubjects /> },
      {
        path: "flashcards/:gradeId/:subjectId/add",
        element: <AdminAddCards />,
      },

      { path: "unverified", element: <AllCreatorUnverified /> },
      { path: "unverified-quizzes", element: <AllCreatorUnverifiedFiltered /> },
      { path: "unverified/:topicId/edit/:quizId", element: <CCEditQuiz /> },
      {
        path: "unverified/:topicId/edit/:quizId/add-question",
        element: <CCAddQuestion />,
      },
      {
        path: "unverified/:topicId/edit/:quizId/edit-question/:questionId",
        element: <CCEditQuestion />,
      },

      { path: "reports", element: <AdminQuestionReports /> },
      { path: "reports/:questionId", element: <DetailQuestionReport /> },

      {
        path: "lists/:gradeId/:subject/:topicId/edit/:quizId",
        element: <AdminEditQuiz />,
      },
      {
        path: "lists/:gradeId/:subject/:topicId/edit/:quizId/add-question",
        element: <AdminAddQuestion />,
      },
      {
        path: "lists/:gradeId/:subject/:topicId/edit/:quizId/edit-question/:questionId",
        element: <AdminEditQuestion />,
      },

      { path: "add-question", element: <ContentCreatorDashboard /> },
      {
        path: "add-question/quizzes/:gradeId",
        element: <AdminQuizzesSubjects />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subjectId",
        element: <AdminQuizTopics />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/add",
        element: <AdminDataAddTopic />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/edit/:topicId",
        element: <AdminDataEditTopic />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/:topicId",
        element: <AdminQuizzesQuizzes />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/:topicId/add",
        element: <AdminAddQuiz />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/:topicId/edit/:quizId",
        element: <AdminEditQuiz />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/:topicId/edit/:quizId/add-question",
        element: <AdminAddQuestion />,
      },
      {
        path: "add-question/quizzes/:gradeId/:subject/:topicId/edit/:quizId/edit-question/:questionId",
        element: <AdminEditQuestion />,
      },

      { path: "quizzes", element: <ContestQuizTable /> },
      { path: "quizzes/contests/:gradeId", element: <ContestSubjectTable /> },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add",
        element: <ContestQuizzesTopics />,
      },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add/:topicId",
        element: <ContestQuizzesQuizzes />,
      },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add/:topicId/add",
        element: <ContestAddQuiz />,
      },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add/:topicId/edit/:quizId",
        element: <ContestEditQuiz />,
      },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add/:topicId/edit/:quizId/add-question",
        element: <ContestAddQuestion />,
      },
      {
        path: "quizzes/contests/:gradeId/:subjectId/add/:topicId/edit/:quizId/edit-question/:questionId",
        element: <ContestEditQuestion />,
      },
    ],
  },
]);
