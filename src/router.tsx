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
// import ContentCreatorSignIn from "./pages/content-creator-sign-in/ContentCreatorSignIn";
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
import SignIn from "./pages/content-creator-sign-in/Signin";
import SalesLayout from "./components/sales-layout/SalesLayout";
import TeacherLayout from "./components/teacher-layout/TeacherLayout";
import Signup from "./pages/signup/Signup";
import TeacherProfile from "./pages/teacher-profile/TeacherProfile";
import TeacherReferal from "./pages/teacher-referal-page/TeacherReferal";
import SalesProfile from "./pages/sales-profile/SalesProfile";
import SalesReferal from "./pages/sales-referal-page/SalesReferal";

// contest imports
import AdminContestResultsAddFeedback from "./pages/admin-contest-results-add-feedback/AdminContestResultsAddFeedback";
import AdminContestResultsEditFeedback from "./pages/admin-contest-results-edit-feedback/AdminContestResultsEditFeedback";
import AdminContestResults from "./pages/admin-contest-results/AdminContestResults";
import AdminContestsAdd from "./pages/admin-contests-add/AdminContestsAdd";
import AdminContestsChooseQuiz from "./pages/admin-contests-choose-quiz/AdminContestsChooseQuiz";
import AdminContestsChooseTopic from "./pages/admin-contests-choose-topic/AdminContestsChooseTopic";
import AdminContestsQuiz from "./pages/admin-contests-choose-view-quiz/AdminContestsChooseViewQuiz";
import AdminContestsContests from "./pages/admin-contests-contests/AdminContestsContests";
import AdminContestsResults from "./pages/admin-contests-results/AdminContestsResults";
import AdminContestsSubjects from "./pages/admin-contests-subjects/AdminContestsSubjects";
// import AdminContestsViewQuiz from "./pages/admin-contests-view-contest/AdminContestsViewContest";
import AdminContests from "./pages/admin-contests/AdminContests";
import AdminAddQuestionAI from "./pages/add-quiz-with-ai/AdminAddQuestionAI";
import AdminContestDetail from "./pages/admin-contests-detail/AdminContestDetail";
import AdminEditcontestQuiz from "./pages/admin-contests-detail/components/AdminEditContestQuiz";
import AdminEditContestQuestion from "./pages/admin-contests-detail/components/AdminEditContestQuestion";
import AdminAddContestQuestion from "./pages/admin-contests-detail/components/AdminAddContestQuestion";
import TeacherContests from "./pages/teacher-contests/TeacherContests";
import TeacherContestDetail from "./pages/teacher-contests/TeacherContestDetail";

export const router = createBrowserRouter([
  // { path: "", element: <ContentCreatorSignIn /> },
  { path: "", element: <SignIn /> },
  { path: "signup", element: <Signup /> },

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

      {
        path: "unverified-quizzes/:topicId/edit/:quizId",
        element: <CCEditQuiz />,
      },
      {
        path: "unverified-quizzes/:topicId/edit/:quizId/add-question",
        element: <CCAddQuestion />,
      },
      {
        path: "unverified-quizzes/:topicId/edit/:quizId/edit-question/:questionId",
        element: <CCEditQuestion />,
      },
      // ##############################################
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

  {
    path: "sales",
    element: <SalesLayout />,
    children: [
      { path: "", element: <Navigate replace to={"/sales/referal"} /> },
      { path: "profile", element: <SalesProfile /> },
      { path: "referal", element: <SalesReferal /> },
    ],
  },

  {
    path: "teacher",
    element: <TeacherLayout />,
    children: [
      { path: "", element: <Navigate replace to={"/teacher/referal"} /> },
      { path: "profile", element: <TeacherProfile /> },
      { path: "referal", element: <TeacherReferal /> },
      { path: "contests", element: <AdminContests /> },
      {
        path: "contests/contests/:gradeId",
        element: <AdminContestsSubjects />,
      },
      {
        path: "contests/contests/:gradeId/:subject",
        element: <AdminContestsContests />,
      },
      { path: "my-contests", element: <TeacherContests /> },
      { path: "my-contests/:contestId", element: <TeacherContestDetail /> },
      // {
      //   path: "contests/contests/:gradeId/:subject/:contestId",
      //   element: <AdminContestsViewQuiz />,
      // },
      {
        path: "contests/contests/:gradeId/:subject/:contestId",
        element: <AdminContestDetail />,
      },
      {
        path: "contests/contests/:gradeId/:subject/:contestId/:topicId/edit/:quizId",
        element: <AdminEditcontestQuiz />,
      },

      {
        path: "contests/contests/:gradeId/:subject/:contestId/:topicId/edit/:quizId/add-question",
        element: <AdminAddContestQuestion />,
      },
      {
        path: "contests/contests/:gradeId/:subject/:contestId/:topicId/edit/:quizId/add-with-ai",
        element: <AdminAddQuestionAI />,
      },

      {
        path: "contests/contests/:gradeId/:subject/:contestId/:topicId/edit/:quizId/edit-question/:questionId",
        element: <AdminEditContestQuestion />,
      },

      {
        path: "contests/contests/:gradeId/:subject/add",
        element: <AdminContestsAdd />,
      },
      // this section is for adding quizzes to contests in the admin side
      //##########################################

      {
        path: "contests/contests/:gradeId/:subjectId/add/add",
        element: <ContestQuizzesTopics />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId",
        element: <ContestQuizzesQuizzes />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId/add",
        element: <ContestAddQuiz />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId/edit/:quizId",
        element: <ContestEditQuiz />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId/edit/:quizId/add-with-ai",
        element: <AdminAddQuestionAI />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId/edit/:quizId/add-question",
        element: <ContestAddQuestion />,
      },
      {
        path: "contests/contests/:gradeId/:subjectId/add/add/:topicId/edit/:quizId/edit-question/:questionId",
        element: <ContestEditQuestion />,
      },

      //#######################################################

      {
        path: "contests/contests/:gradeId/:subjectId/add/choose",
        element: <AdminContestsChooseTopic />,
      },

      {
        path: "contests/contests/:gradeId/:subject/add/choose/:topicId/",
        element: <AdminContestsChooseQuiz />,
      },

      {
        path: "contests/contests/:gradeId/:subject/add/choose/:topicId/:quizId",
        element: <AdminContestsQuiz />,
      },

      // quizzes
      { path: "contests/quizzes/:gradeId", element: <AdminQuizzesSubjects /> },
      {
        path: "contests/quizzes/:gradeId/:subjectId", // I WILL START FROM THIS POINT
        element: <AdminQuizTopics />,
      },
      {
        path: "contests/quizzes/:gradeId/:subject/add",
        element: <AdminDataAddTopic />,
      },
      {
        path: "contests/quizzes/:gradeId/:subject/edit/:topicId",
        element: <AdminDataEditTopic />,
      },
      {
        path: "contests/quizzes/:gradeId/:subject/:topicId", // THIS IS MY SECOND POINT
        element: <AdminQuizzesQuizzes />,
      },
      {
        path: "contests/quizzes/:gradeId/:subject/:topicId/add", // FOR ADDING QUIZ
        element: <AdminAddQuiz />,
      },
      {
        path: "contests/quizzes/:gradeId/:subject/:topicId/edit/:quizId", // FOR EDITING QUIZ
        element: <AdminEditQuiz />,
      },

      {
        path: "contests/quizzes/:gradeId/:subject/:topicId/edit/:quizId/add-question", // FOR ADDING QUESTION
        element: <AdminAddQuestion />,
      },

      {
        path: "contests/quizzes/:gradeId/:subject/:topicId/edit/:quizId/add-with-ai", // FOR ADDING QUIZ using AI
        element: <AdminAddQuestionAI />,
      },

      {
        path: "contests/quizzes/:gradeId/:subject/:topicId/edit/:quizId/edit-question/:questionId", // FOR EDITING QUESTION INSIDE A QUIZ
        element: <AdminEditQuestion />,
      },
      //contest results
      { path: "contests-results", element: <AdminContestsResults /> },
      { path: "contests-results/:contestId", element: <AdminContestResults /> },
      {
        path: "contests-results/:contestId/:studentId/add",
        element: <AdminContestResultsAddFeedback />,
      },
      {
        path: "contests-results/:contestId/:studentId/edit",
        element: <AdminContestResultsEditFeedback />,
      },
    ],
  },
]);
