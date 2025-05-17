import Back from "@/components/admin-components/Back";
import FlashCardForm from "@/components/admin-components/FlashCardForm";

export default function AdminAddCards() {
  return (
    <div>
      <Back steps={2} />
      <FlashCardForm isEdit={false} />
      {/* <p>hello cards</p> */}
    </div>
  );
}
