import { SlNotebook } from "react-icons/sl";
import { IoIosAdd } from "react-icons/io";
import { MdPendingActions } from "react-icons/md";

export const CClinks = [

  //Todo:Remove quizzes flow after quizzes and contests are separated
  { title: "Add questions", to: "/cc/add-question", Icon: IoIosAdd },
  { title: "Check lists and approve", to: "/cc/lists", Icon: SlNotebook },
  { title: "Add Contest Quizzes", to: "/cc/quizzes", Icon: IoIosAdd },
  { title: "All unverified Quizzes", to: "/cc/unverified", Icon: MdPendingActions },
];
