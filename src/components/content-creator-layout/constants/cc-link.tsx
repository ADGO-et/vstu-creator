import { SlNotebook } from "react-icons/sl";
import { IoIosAdd } from "react-icons/io";
import { MdPendingActions } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";

export const CClinks = [

  //Todo:Remove quizzes flow after quizzes and contests are separated
  { title: "Add questions", to: "/cc/add-question", Icon: IoIosAdd },
  { title: "Check lists and approve", to: "/cc/lists", Icon: SlNotebook },
  { title: "Add Contest Quizzes", to: "/cc/quizzes", Icon: IoIosAdd },
  { title: "Check reports", to: "/cc/reports", Icon: FaQuestionCircle },
  { title: "All unverified Quizzes", to: "/cc/unverified", Icon: MdPendingActions },
];
